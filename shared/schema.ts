import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const businessLeads = pgTable("business_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessName: text("business_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code"),
  phonePrimary: text("phone_primary"),
  websiteStatus: text("website_status").notNull(), // NO_WEBSITE, SOCIAL_ONLY, OUTDATED_SITE, MODERN_SITE
  websiteUrl: text("website_url"),
  googleMapsUrl: text("google_maps_url"),
  yelpUrl: text("yelp_url"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  tiktokUrl: text("tiktok_url"),
  linkedinUrl: text("linkedin_url"),
  emailBusiness: text("email_business"),
  ownerName: text("owner_name"),
  ownerVerified: boolean("owner_verified").default(false),
  ownerSources: jsonb("owner_sources").$type<string[]>().default([]),
  ownerContact: text("owner_contact"),
  recentPosts: text("recent_posts"),
  avgRating: integer("avg_rating"),
  numReviews: integer("num_reviews"),
  independentBusiness: boolean("independent_business").default(true),
  personalHook: text("personal_hook"),
  demoDesktopScreenshotUrl: text("demo_desktop_screenshot_url"),
  demoMobileScreenshotUrl: text("demo_mobile_screenshot_url"),
  demoVideoUrl: text("demo_video_url"),
  leadScore: integer("lead_score").notNull(),
  scoreBreakdown: jsonb("score_breakdown").$type<{
    website: { value: number; weight: number; score: number };
    decisionMaker: { value: number; weight: number; score: number };
    social: { value: number; weight: number; score: number };
    reputation: { value: number; weight: number; score: number };
    sizeMatch: { value: number; weight: number; score: number };
  }>(),
  confidence: integer("confidence").notNull(), // 0-100
  flags: jsonb("flags").$type<string[]>().default([]),
  outreachEmail: text("outreach_email"),
  outreachDm: text("outreach_dm"),
  outreachSms: text("outreach_sms"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const discoveryJobs = pgTable("discovery_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  businessType: text("business_type").notNull(),
  filters: jsonb("filters").$type<{
    noWebsite: boolean;
    socialOnly: boolean;
    outdatedSite: boolean;
    independentOnly: boolean;
    verifiedOwner: boolean;
    activeSocial: boolean;
  }>(),
  status: text("status").notNull().default("pending"), // pending, running, completed, failed
  progress: jsonb("progress").$type<{
    googlePlaces: number;
    socialMedia: number;
    ownerVerification: number;
  }>().default({ googlePlaces: 0, socialMedia: 0, ownerVerification: 0 }),
  totalFound: integer("total_found").default(0),
  qualifiedLeads: integer("qualified_leads").default(0),
  highScoreLeads: integer("high_score_leads").default(0),
  verifiedOwners: integer("verified_owners").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBusinessLeadSchema = createInsertSchema(businessLeads).omit({
  id: true,
  createdAt: true,
});

export const insertDiscoveryJobSchema = createInsertSchema(discoveryJobs).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const searchConfigSchema = z.object({
  location: z.string().min(1, "Location is required"),
  businessType: z.string().min(1, "Business type is required"),
  filters: z.object({
    noWebsite: z.boolean().default(true),
    socialOnly: z.boolean().default(true),
    outdatedSite: z.boolean().default(true),
    independentOnly: z.boolean().default(false),
    verifiedOwner: z.boolean().default(false),
    activeSocial: z.boolean().default(false),
  }),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type BusinessLead = typeof businessLeads.$inferSelect;
export type InsertBusinessLead = z.infer<typeof insertBusinessLeadSchema>;
export type DiscoveryJob = typeof discoveryJobs.$inferSelect;
export type InsertDiscoveryJob = z.infer<typeof insertDiscoveryJobSchema>;
export type SearchConfig = z.infer<typeof searchConfigSchema>;
