import { pgTable, text, serial, timestamp, integer, uniqueIndex, primaryKey, boolean, json, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Recipe cache table
export const recipeCaches = pgTable("recipe_caches", {
  id: serial("id").primaryKey(),
  ingredients: text("ingredients").notNull(), // Comma-separated ingredients list
  result: text("result").notNull(), // JSON string of the recipe results
  createdAt: timestamp("created_at").defaultNow().notNull(), // ISO Date string
});

// Recipe cache schemas
export const insertRecipeCacheSchema = createInsertSchema(recipeCaches).omit({
  id: true,
  createdAt: true,
});

export type InsertRecipeCache = z.infer<typeof insertRecipeCacheSchema>;
export type RecipeCache = typeof recipeCaches.$inferSelect;

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  // Chef progression system
  chefLevel: integer("chef_level").default(1).notNull(),
  experiencePoints: integer("experience_points").default(0).notNull(),
  badges: text("badges").array().default([]),
  // User preferences
  preferences: json("preferences").$type<{
    theme?: 'light' | 'dark' | 'system';
    notificationsEnabled?: boolean;
    favoriteCuisine?: string;
  }>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  userIngredients: many(userIngredients),
  recipes: many(recipes),
  contestEntries: many(contestEntries),
  achievedBadges: many(userBadges),
  userJourneyEvents: many(userJourneyEvents)
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  photoURL: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Chef Badges (Achievements)
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(), // cooking, exploration, community, etc.
  requiredPoints: integer("required_points"), // XP needed if applicable
  requiredActions: json("required_actions").$type<{
    recipeCount?: number;
    challengesCompleted?: number;
    specificCuisine?: string;
    specificDifficulty?: string;
  }>().default({}), // JSON with conditions
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges)
}));

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
  createdAt: true,
});

export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;

// User Badges (User-Badge relation)
export const userBadges = pgTable("user_badges", {
  userId: integer("user_id").notNull().references(() => users.id),
  badgeId: integer("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  showcased: boolean("showcased").default(false), // Featured on profile
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.badgeId] }),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  earnedAt: true,
});

export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;

// Cooking Challenges (Contests)
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  theme: text("theme").notNull(),
  rules: text("rules").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  prizeDescription: text("prize_description"),
  imageUrl: text("image_url"),
  status: text("status").notNull().default("upcoming"), // upcoming, active, voting, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const challengesRelations = relations(challenges, ({ many }) => ({
  contestEntries: many(contestEntries)
}));

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
});

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

// Challenge Entries (Submissions)
export const contestEntries = pgTable("contest_entries", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  userId: integer("user_id").notNull().references(() => users.id),
  recipeId: integer("recipe_id").notNull().references(() => recipes.id),
  submissionText: text("submission_text"),
  photoUrl: text("photo_url"),
  votes: integer("votes").default(0).notNull(),
  standing: integer("standing"), // Final position in contest
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const contestEntriesRelations = relations(contestEntries, ({ one }) => ({
  challenge: one(challenges, {
    fields: [contestEntries.challengeId],
    references: [challenges.id],
  }),
  user: one(users, {
    fields: [contestEntries.userId],
    references: [users.id],
  }),
  recipe: one(recipes, {
    fields: [contestEntries.recipeId],
    references: [recipes.id],
  }),
}));

export const insertContestEntrySchema = createInsertSchema(contestEntries).omit({
  id: true,
  votes: true,
  standing: true,
  submittedAt: true,
});

export type InsertContestEntry = z.infer<typeof insertContestEntrySchema>;
export type ContestEntry = typeof contestEntries.$inferSelect;

// User Journey Events (for Journey Map)
export const userJourneyEvents = pgTable("user_journey_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  eventType: text("event_type").notNull(), // recipe_created, cuisine_explored, challenge_joined, etc.
  eventData: json("event_data").$type<{
    name: string;
    description?: string;
    cuisineType?: string;
    difficulty?: string;
    challenge?: string;
  }>().default({name: ""}), // Structured data about the event
  cuisineType: text("cuisine_type"), // If applicable
  recipeCategory: text("recipe_category"), // If applicable
  recipeId: integer("recipe_id").references(() => recipes.id),
  challengeId: integer("challenge_id").references(() => challenges.id),
  badgeId: integer("badge_id").references(() => badges.id),
  experienceGained: integer("experience_gained").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userJourneyEventsRelations = relations(userJourneyEvents, ({ one }) => ({
  user: one(users, {
    fields: [userJourneyEvents.userId],
    references: [users.id],
  }),
  recipe: one(recipes, {
    fields: [userJourneyEvents.recipeId],
    references: [recipes.id],
  }),
  challenge: one(challenges, {
    fields: [userJourneyEvents.challengeId],
    references: [challenges.id],
  }),
  badge: one(badges, {
    fields: [userJourneyEvents.badgeId],
    references: [badges.id],
  }),
}));

export const insertUserJourneyEventSchema = createInsertSchema(userJourneyEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertUserJourneyEvent = z.infer<typeof insertUserJourneyEventSchema>;
export type UserJourneyEvent = typeof userJourneyEvents.$inferSelect;

// Ingredients table
export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
  userIngredients: many(userIngredients),
}));

export const insertIngredientSchema = createInsertSchema(ingredients).omit({
  id: true,
  createdAt: true,
});

export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type Ingredient = typeof ingredients.$inferSelect;

// User Ingredients (saved ingredients for users)
export const userIngredients = pgTable("user_ingredients", {
  userId: integer("user_id").notNull().references(() => users.id),
  ingredientId: integer("ingredient_id").notNull().references(() => ingredients.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.ingredientId] }),
  };
});

export const userIngredientsRelations = relations(userIngredients, ({ one }) => ({
  user: one(users, {
    fields: [userIngredients.userId],
    references: [users.id],
  }),
  ingredient: one(ingredients, {
    fields: [userIngredients.ingredientId],
    references: [ingredients.id],
  }),
}));

export const insertUserIngredientSchema = createInsertSchema(userIngredients).omit({
  createdAt: true,
});

export type InsertUserIngredient = z.infer<typeof insertUserIngredientSchema>;
export type UserIngredient = typeof userIngredients.$inferSelect;

// Recipes table - for user saved/favorite recipes
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ingredients: text("ingredients").notNull(), // JSON string of ingredients
  instructions: text("instructions").notNull(), // JSON string of instructions
  cuisine: text("cuisine"),
  difficulty: text("difficulty").default("medium"), // Easy, Medium, Hard
  prepTime: integer("prep_time"),
  cookTime: integer("cook_time"),
  servings: integer("servings"),
  videoId: text("video_id"),
  imageUrl: text("image_url"),
  tags: text("tags").array(),
  isPublic: boolean("is_public").default(false),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  user: one(users, {
    fields: [recipes.userId],
    references: [users.id],
  }),
  contestEntries: many(contestEntries)
}));

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

// Community Posts table
export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  tags: text("tags").array().default([]),
  likes: integer("likes").default(0).notNull(),
  comments: integer("comments").default(0).notNull(),
  shares: integer("shares").default(0).notNull(),
  postType: text("post_type").default("general").notNull(), // general, recipe, challenge
  recipeId: integer("recipe_id").references(() => recipes.id),
  challengeId: integer("challenge_id").references(() => challenges.id),
  isLikedByUser: boolean("is_liked_by_user").default(false),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const communityPostsRelations = relations(communityPosts, ({ one }) => ({
  user: one(users, {
    fields: [communityPosts.userId],
    references: [users.id],
  }),
  recipe: one(recipes, {
    fields: [communityPosts.recipeId],
    references: [recipes.id],
  }),
  challenge: one(challenges, {
    fields: [communityPosts.challengeId],
    references: [challenges.id],
  }),
}));

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  likes: true,
  comments: true,
  shares: true,
  isLikedByUser: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;

// Community Post Comments table
export const postComments = pgTable("post_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => communityPosts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  likes: integer("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  post: one(communityPosts, {
    fields: [postComments.postId],
    references: [communityPosts.id],
  }),
  user: one(users, {
    fields: [postComments.userId],
    references: [users.id],
  }),
}));

export const insertPostCommentSchema = createInsertSchema(postComments).omit({
  id: true,
  likes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPostComment = z.infer<typeof insertPostCommentSchema>;
export type PostComment = typeof postComments.$inferSelect;
