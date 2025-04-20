import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Recipe cache table
export const recipeCaches = pgTable("recipe_caches", {
  id: serial("id").primaryKey(),
  ingredients: text("ingredients").notNull(), // Comma-separated ingredients list
  result: text("result").notNull(), // JSON string of the recipe results
  createdAt: text("created_at").notNull(), // ISO Date string
});

// Recipe cache schemas
export const insertRecipeCacheSchema = createInsertSchema(recipeCaches).omit({
  id: true,
});

export type InsertRecipeCache = z.infer<typeof insertRecipeCacheSchema>;
export type RecipeCache = typeof recipeCaches.$inferSelect;

// Users table (from template, keeping as is)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
