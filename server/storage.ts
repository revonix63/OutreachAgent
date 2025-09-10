import { type User, type InsertUser, type BusinessLead, type InsertBusinessLead, type DiscoveryJob, type InsertDiscoveryJob } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createDiscoveryJob(job: InsertDiscoveryJob): Promise<DiscoveryJob>;
  getDiscoveryJob(id: string): Promise<DiscoveryJob | undefined>;
  updateDiscoveryJob(id: string, updates: Partial<DiscoveryJob>): Promise<DiscoveryJob | undefined>;
  getActiveDiscoveryJobs(): Promise<DiscoveryJob[]>;
  
  createBusinessLead(lead: InsertBusinessLead): Promise<BusinessLead>;
  getBusinessLeads(jobId?: string): Promise<BusinessLead[]>;
  getBusinessLead(id: string): Promise<BusinessLead | undefined>;
  updateBusinessLead(id: string, updates: Partial<BusinessLead>): Promise<BusinessLead | undefined>;
  deleteBusinessLead(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private discoveryJobs: Map<string, DiscoveryJob>;
  private businessLeads: Map<string, BusinessLead>;

  constructor() {
    this.users = new Map();
    this.discoveryJobs = new Map();
    this.businessLeads = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDiscoveryJob(insertJob: InsertDiscoveryJob): Promise<DiscoveryJob> {
    const id = randomUUID();
    const job: DiscoveryJob = {
      ...insertJob,
      id,
      status: insertJob.status || 'pending',
      createdAt: new Date(),
      completedAt: null,
      progress: insertJob.progress || { googlePlaces: 0, socialMedia: 0, ownerVerification: 0 },
    };
    this.discoveryJobs.set(id, job);
    return job;
  }

  async getDiscoveryJob(id: string): Promise<DiscoveryJob | undefined> {
    return this.discoveryJobs.get(id);
  }

  async updateDiscoveryJob(id: string, updates: Partial<DiscoveryJob>): Promise<DiscoveryJob | undefined> {
    const job = this.discoveryJobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...updates };
    this.discoveryJobs.set(id, updatedJob);
    return updatedJob;
  }

  async getActiveDiscoveryJobs(): Promise<DiscoveryJob[]> {
    return Array.from(this.discoveryJobs.values()).filter(
      job => job.status === 'running' || job.status === 'pending'
    );
  }

  async createBusinessLead(insertLead: InsertBusinessLead): Promise<BusinessLead> {
    const id = randomUUID();
    const lead: BusinessLead = {
      ...insertLead,
      id,
      createdAt: new Date(),
      scoreBreakdown: insertLead.scoreBreakdown || null,
      postalCode: insertLead.postalCode || null,
    };
    this.businessLeads.set(id, lead);
    return lead;
  }

  async getBusinessLeads(jobId?: string): Promise<BusinessLead[]> {
    const leads = Array.from(this.businessLeads.values());
    return leads.sort((a, b) => b.leadScore - a.leadScore);
  }

  async getBusinessLead(id: string): Promise<BusinessLead | undefined> {
    return this.businessLeads.get(id);
  }

  async updateBusinessLead(id: string, updates: Partial<BusinessLead>): Promise<BusinessLead | undefined> {
    const lead = this.businessLeads.get(id);
    if (!lead) return undefined;
    
    const updatedLead = { ...lead, ...updates };
    this.businessLeads.set(id, updatedLead);
    return updatedLead;
  }

  async deleteBusinessLead(id: string): Promise<boolean> {
    return this.businessLeads.delete(id);
  }
}

export const storage = new MemStorage();
