import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchConfigSchema } from "@shared/schema";
import { BusinessDiscoveryService } from "./services/discovery";
import { LeadScoringService } from "./services/scoring";
import { OutreachService } from "./services/outreach";

export async function registerRoutes(app: Express): Promise<Server> {
  const discoveryService = new BusinessDiscoveryService();
  const scoringService = new LeadScoringService();
  const outreachService = new OutreachService();

  // Start discovery job
  app.post("/api/discovery/start", async (req, res) => {
    try {
      const config = searchConfigSchema.parse(req.body);
      
      const job = await storage.createDiscoveryJob({
        location: config.location,
        businessType: config.businessType,
        filters: config.filters,
        status: "pending",
        progress: { googlePlaces: 0, socialMedia: 0, ownerVerification: 0 },
        totalFound: 0,
        qualifiedLeads: 0,
        highScoreLeads: 0,
        verifiedOwners: 0,
      });

      // Start discovery process asynchronously
      processDiscoveryJob(job.id, config);

      res.json({ jobId: job.id, status: "started" });
    } catch (error) {
      res.status(400).json({ error: "Invalid search configuration" });
    }
  });

  // Get discovery job status
  app.get("/api/discovery/:jobId", async (req, res) => {
    try {
      const job = await storage.getDiscoveryJob(req.params.jobId);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: "Failed to get job status" });
    }
  });

  // Get all leads
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getBusinessLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: "Failed to get leads" });
    }
  });

  // Get specific lead
  app.get("/api/leads/:leadId", async (req, res) => {
    try {
      const lead = await storage.getBusinessLead(req.params.leadId);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: "Failed to get lead" });
    }
  });

  // Generate outreach messages for a lead
  app.post("/api/leads/:leadId/outreach", async (req, res) => {
    try {
      const lead = await storage.getBusinessLead(req.params.leadId);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      const messages = outreachService.generateOutreachMessages(lead);
      const alternatives = outreachService.generateAlternativeMessages(lead);

      // Update lead with generated messages
      await storage.updateBusinessLead(lead.id, {
        outreachEmail: messages.email,
        outreachDm: messages.dm,
        outreachSms: messages.sms,
      });

      res.json({ messages, alternatives });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate outreach messages" });
    }
  });

  // Export leads as CSV
  app.get("/api/leads/export/csv", async (req, res) => {
    try {
      const leads = await storage.getBusinessLeads();
      
      const csvHeaders = [
        'Business Name', 'Owner', 'Website Status', 'Lead Score', 'Contact Email', 
        'Phone', 'Address', 'City', 'State', 'Personal Hook'
      ];
      
      const csvData = leads.map(lead => [
        lead.businessName,
        lead.ownerName || '',
        lead.websiteStatus,
        lead.leadScore,
        lead.emailBusiness || lead.ownerContact || '',
        lead.phonePrimary || '',
        lead.address,
        lead.city,
        lead.state,
        lead.personalHook || ''
      ]);

      const csv = [csvHeaders, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
      res.send(csv);
    } catch (error) {
      res.status(500).json({ error: "Failed to export leads" });
    }
  });

  // Process discovery job (async function)
  async function processDiscoveryJob(jobId: string, config: any) {
    try {
      await storage.updateDiscoveryJob(jobId, { status: "running" });

      // Step 1: Google Places search
      await storage.updateDiscoveryJob(jobId, { 
        progress: { googlePlaces: 25, socialMedia: 0, ownerVerification: 0 }
      });

      const businesses = await discoveryService.searchGooglePlaces(config.location, config.businessType);
      
      await storage.updateDiscoveryJob(jobId, { 
        progress: { googlePlaces: 100, socialMedia: 0, ownerVerification: 0 },
        totalFound: businesses.length
      });

      let qualifiedCount = 0;
      let highScoreCount = 0;
      let verifiedOwnerCount = 0;

      // Step 2: Process each business
      for (let i = 0; i < businesses.length; i++) {
        const business = businesses[i];
        
        // Update social media analysis progress
        const socialProgress = Math.round((i / businesses.length) * 100);
        await storage.updateDiscoveryJob(jobId, { 
          progress: { googlePlaces: 100, socialMedia: socialProgress, ownerVerification: 0 }
        });

        // Analyze website status
        const websiteStatus = await discoveryService.analyzeWebsiteStatus(business.websiteUrl || '');
        
        // Apply filters
        if (!shouldIncludeBusiness(websiteStatus, config.filters)) {
          continue;
        }

        // Get owner information
        const ownerInfo = await discoveryService.findOwnerInformation(business.businessName);
        
        // Update owner verification progress
        const ownerProgress = Math.round((i / businesses.length) * 100);
        await storage.updateDiscoveryJob(jobId, { 
          progress: { googlePlaces: 100, socialMedia: 100, ownerVerification: ownerProgress }
        });

        // Generate personal hook
        const personalHook = await discoveryService.generatePersonalHook(
          business.businessName, 
          [business.facebookUrl, business.instagramUrl].filter(Boolean) as string[]
        );

        // Create demo site
        const demoAssets = await discoveryService.createDemoSite(business);

        // Create lead object
        const leadData = {
          businessName: business.businessName,
          address: business.address,
          city: business.city,
          state: business.state,
          postalCode: business.postalCode,
          phonePrimary: business.phonePrimary,
          websiteStatus,
          websiteUrl: business.websiteUrl,
          googleMapsUrl: business.googleMapsUrl,
          yelpUrl: business.yelpUrl,
          facebookUrl: business.facebookUrl,
          instagramUrl: business.instagramUrl,
          emailBusiness: business.emailBusiness,
          ownerName: ownerInfo.ownerName,
          ownerVerified: ownerInfo.ownerVerified,
          ownerSources: ownerInfo.ownerSources,
          ownerContact: ownerInfo.ownerContact,
          recentPosts: `${Math.floor(Math.random() * 30)} days ago`, // Placeholder
          avgRating: business.avgRating,
          numReviews: business.numReviews,
          independentBusiness: true,
          personalHook,
          demoDesktopScreenshotUrl: demoAssets.demoDesktopScreenshotUrl,
          demoMobileScreenshotUrl: demoAssets.demoMobileScreenshotUrl,
          demoVideoUrl: demoAssets.demoVideoUrl,
          leadScore: 0, // Will be calculated
          confidence: 0, // Will be calculated
          flags: [] as string[],
        };

        // Calculate score
        const { leadScore, scoreBreakdown } = scoringService.calculateLeadScore(leadData);
        const confidence = scoringService.calculateConfidence(leadData);

        // Only include leads with score >= 40 (temporarily lowered for testing)
        if (leadScore >= 40) {
          qualifiedCount++;
          if (leadScore >= 80) highScoreCount++;
          if (ownerInfo.ownerVerified) verifiedOwnerCount++;

          // Generate outreach messages
          const tempLead = { ...leadData, leadScore, scoreBreakdown, confidence, id: 'temp' } as any;
          const messages = outreachService.generateOutreachMessages(tempLead);

          await storage.createBusinessLead({
            ...leadData,
            leadScore,
            scoreBreakdown,
            confidence,
            outreachEmail: messages.email,
            outreachDm: messages.dm,
            outreachSms: messages.sms,
          });
        }
      }

      // Complete the job
      await storage.updateDiscoveryJob(jobId, {
        status: "completed",
        progress: { googlePlaces: 100, socialMedia: 100, ownerVerification: 100 },
        qualifiedLeads: qualifiedCount,
        highScoreLeads: highScoreCount,
        verifiedOwners: verifiedOwnerCount,
        completedAt: new Date(),
      });

    } catch (error) {
      console.error('Discovery job failed:', error);
      await storage.updateDiscoveryJob(jobId, { status: "failed" });
    }
  }

  function shouldIncludeBusiness(websiteStatus: string, filters: any): boolean {
    if (websiteStatus === 'NO_WEBSITE' && !filters.noWebsite) return false;
    if (websiteStatus === 'SOCIAL_ONLY' && !filters.socialOnly) return false;
    if (websiteStatus === 'OUTDATED_SITE' && !filters.outdatedSite) return false;
    if (websiteStatus === 'MODERN_SITE') return false; // Never include modern sites
    
    return true;
  }

  const httpServer = createServer(app);
  return httpServer;
}
