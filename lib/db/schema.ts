import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const properties = sqliteTable("properties", {
  id: text("id").primaryKey(),
  slug: text("slug", { length: 60 }).notNull().unique(),
  address: text("address").notNull(),
  verificationCode: text("verification_code", { length: 12 }).notNull(),
  claimedByUserId: text("claimed_by_user_id").references(() => users.id),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
});

export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  propertyId: text("property_id").references(() => properties.id).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  verifiedAt: integer("verified_at", { mode: 'timestamp' }),
  isSubscribed: integer("is_subscribed", { mode: 'boolean' }).default(false).notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
});

export const verificationTokens = sqliteTable("verification_tokens", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  userId: text("user_id").references(() => users.id).notNull(),
  propertyId: text("property_id").references(() => properties.id).notNull(),
  expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  propertyId: text("property_id").references(() => properties.id).notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull(),
  status: text("status").notNull(),
  currentPeriodEnd: integer("current_period_end", { mode: 'timestamp' }).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
});