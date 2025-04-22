import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { generateRecipesDeepSeek } from "./services/deepseek";
import { generateRecipesMealDB } from "./services/mealdb";
import { generateRecipesGemini, generateSubstitutionsGemini } from "./services/gemini";
import { searchYouTubeVideos } from "./services/youtube";
import { getIngredientSubstitutes } from "./services/substitutions";
// التحقق من المحتوى
import { moderateContent, moderateComment } from "./services/content-moderation";
// تمت إزالة استيراد الترجمة
import { storage } from "./storage";
import { insertRecipeCacheSchema, insertIngredientSchema, insertUserSchema, insertRecipeSchema, insertCommunityPostSchema, insertPostCommentSchema } from "@shared/schema";
import { z } from "zod";
// استيراد خدمة إشعارات Discord
import { sendPostReportToDiscord, sendAutoRemovalNotification, sendLoginNotificationToDiscord } from "./services/discord-notifications";
// استيراد نظام المصادقة الجديد
import { setupAuth, comparePasswords, hashPassword } from "./auth";

// Import types for recipe interface
import type { RecipeResult } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Route to fetch recipes based on ingredients
  app.post("/api/recipes", async (req, res) => {
    try {
      const { ingredients } = req.body;

      if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({
          message: "Invalid ingredients. Please provide an array of ingredients.",
        });
      }

      // Sort ingredients alphabetically for consistent cache keys
      const sortedIngredients = [...ingredients].sort((a, b) => a.localeCompare(b));
      const ingredientsKey = sortedIngredients.join(',');

      // Check database cache first
      try {
        const cachedResult = await storage.getRecipeCache(ingredientsKey);
        
        if (cachedResult) {
          console.log("Cache hit for ingredients:", ingredientsKey);
          const parsedResult = JSON.parse(cachedResult.result);
          return res.json(parsedResult);
        }
      } catch (cacheError) {
        console.error("Error checking recipe cache:", cacheError);
        // Continue execution if cache check fails
      }

      // Generate recipes using Google Gemini AI (or fallback if API fails)
      let recipesData;
      try {
        recipesData = await generateRecipesGemini(ingredients);

        if (!recipesData.recipes || !Array.isArray(recipesData.recipes) || recipesData.recipes.length === 0) {
          // No recipes found, but we have suggestions
          return res.status(200).json({
            recipes: [],
            suggestedIngredients: recipesData.suggestedIngredients || [
              "طماطم", "بصل", "بطاطس", "دجاج", "أرز", "ثوم", "زيت زيتون", "بيض", "جزر", "فلفل"
            ],
            message: "لم نتمكن من إيجاد وصفات مناسبة للمكونات المدخلة. حاول إضافة المزيد من المكونات الأساسية."
          });
        }
      } catch (recipeError) {
        console.error("Error generating recipes:", recipeError);
        return res.status(200).json({
          recipes: [],
          suggestedIngredients: [
            "طماطم", "بصل", "بطاطس", "دجاج", "أرز", "ثوم", "زيت زيتون", "بيض", "جزر", "فلفل"
          ],
          message: "حدث خطأ أثناء معالجة طلبك. يرجى إضافة المزيد من المكونات أو المحاولة مرة أخرى لاحقًا."
        });
      }

      // Fetch YouTube videos for each recipe that doesn't already have a videoId
      const recipesWithVideos = await Promise.all(
        recipesData.recipes.map(async (recipe: any) => {
          // If the recipe already has a videoId, use it
          if (recipe.videoId) {
            return recipe;
          }
          
          // Otherwise, try to fetch from YouTube API
          try {
            const videoId = await searchYouTubeVideos(recipe.title + " recipe");
            return { ...recipe, videoId };
          } catch (error) {
            console.error(`Error fetching video for ${recipe.title}:`, error);
            return recipe; // Return recipe without video if there's an error
          }
        })
      );

      const responseData = {
        recipes: recipesWithVideos,
        suggestedIngredients: recipesData.suggestedIngredients || [],
      };

      // Cache the result in the database
      try {
        await storage.createRecipeCache({
          ingredients: ingredientsKey,
          result: JSON.stringify(responseData),
        });
      } catch (cacheError) {
        console.error("Error saving recipe cache:", cacheError);
        // Continue execution if caching fails
      }

      return res.json(responseData);
    } catch (error) {
      console.error("Error processing recipe request:", error);
      return res.status(500).json({
        message: "An error occurred while processing your request.",
      });
    }
  });

  // User registration endpoint
  app.post("/api/users/register", async (req, res) => {
    try {
      const userSchema = insertUserSchema.extend({
        confirmPassword: z.string()
      }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"]
      });

      const validatedData = userSchema.parse(req.body);

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create new user (password would be hashed in a real app)
      const newUser = await storage.createUser({
        username: validatedData.username,
        password: validatedData.password, // In a real app, hash this password!
      });

      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("User registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to register user" });
    }
  });

  // User login endpoint
  app.post("/api/users/login", async (req, res) => {
    try {
      const loginSchema = z.object({
        username: z.string().min(1),
        password: z.string().min(1)
      });

      const validatedData = loginSchema.parse(req.body);
      
      // Find user and check password (would use proper comparison in a real app)
      const user = await storage.getUserByUsername(validatedData.username);
      
      if (!user || user.password !== validatedData.password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Login with Firebase endpoint - for existing Firebase users
  app.post("/api/login", async (req, res) => {
    try {
      const loginSchema = z.object({
        username: z.string().min(1),
        password: z.string().min(1)
      });

      const validatedData = loginSchema.parse(req.body);
      
      // Find user by username
      const user = await storage.getUserByUsername(validatedData.username);
      
      if (!user || user.password !== validatedData.password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // إرسال إشعار تسجيل دخول غير متزامن
      try {
        const userAgent = req.headers['user-agent'] || 'غير معروف';
        const ipAddress = req.ip || req.socket.remoteAddress || 'غير معروف';
        
        sendLoginNotificationToDiscord({
          userId: user.id,
          username: user.username,
          loginMethod: 'google', // باعتبار أنه تسجيل دخول عام
          loginTime: new Date(),
          userAgent,
          ipAddress
        }).catch(err => console.error("فشل إرسال إشعار تسجيل دخول:", err));
      } catch (notificationError) {
        console.error("خطأ عند إعداد إشعار تسجيل الدخول:", notificationError);
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Firebase login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ message: "Login failed" });
    }
  });
  
  // مسار إشعار تسجيل الدخول والخروج (للزوار وحسابات جوجل)
  app.post("/api/login/notify", async (req, res) => {
    try {
      const notifySchema = z.object({
        username: z.string().default("زائر"),
        loginMethod: z.enum(['google', 'admin', 'guest']).default('guest'),
        userAgent: z.string().optional(),
        isGuest: z.boolean().optional(),
        email: z.string().optional(),
        isAdmin: z.boolean().optional().default(false),
        isLogout: z.boolean().optional().default(false) // إضافة علامة للتمييز بين تسجيل الدخول والخروج
      });

      const validatedData = notifySchema.parse(req.body);
      const ipAddress = req.ip || req.socket.remoteAddress || 'غير معروف';
      
      // إرسال إشعار تسجيل دخول أو خروج غير متزامن
      sendLoginNotificationToDiscord({
        username: validatedData.username,
        loginMethod: validatedData.loginMethod,
        loginTime: new Date(),
        userAgent: validatedData.userAgent,
        ipAddress,
        isAdmin: validatedData.isAdmin,
        email: validatedData.email,
        isLogout: validatedData.isLogout // تمرير علامة تسجيل الخروج
      }).catch(err => console.error("فشل إرسال إشعار:", err));

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("إشعار تسجيل الدخول:", error);
      // حتى لو حدث خطأ، نرسل استجابة نجاح لتجنب أي مشاكل في واجهة المستخدم
      return res.status(200).json({ success: false });
    }
  });

  // Save a favorite recipe
  app.post("/api/recipes/save", async (req, res) => {
    try {
      // In a real app, get userId from authenticated session
      const { userId, recipe } = req.body;

      if (!userId || !recipe) {
        return res.status(400).json({ message: "Missing userId or recipe data" });
      }

      // Ensure user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Save the recipe
      const savedRecipe = await storage.createRecipe({
        userId,
        title: recipe.title,
        description: recipe.description,
        ingredients: JSON.stringify(recipe.ingredients),
        instructions: JSON.stringify(recipe.instructions),
        videoId: recipe.videoId,
      });

      return res.status(201).json(savedRecipe);
    } catch (error) {
      console.error("Error saving recipe:", error);
      return res.status(500).json({ message: "Failed to save recipe" });
    }
  });

  // Get user's saved recipes
  app.get("/api/users/:userId/recipes", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Ensure user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get user's saved recipes
      const recipes = await storage.getUserRecipes(userId);
      
      // Parse JSON strings back to arrays
      const formattedRecipes = recipes.map(recipe => ({
        ...recipe,
        ingredients: JSON.parse(recipe.ingredients),
        instructions: JSON.parse(recipe.instructions)
      }));

      return res.json(formattedRecipes);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      return res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  // API endpoints for saved recipes
  
  // Get user's saved recipes
  app.get("/api/users/:userId/saved-recipes", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Ensure user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get user's saved recipes
      const savedRecipes = await storage.getUserSavedRecipes(userId);
      return res.json(savedRecipes);
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
      return res.status(500).json({ message: "Failed to fetch saved recipes" });
    }
  });

  // Check if recipe is already saved
  app.post("/api/users/:userId/saved-recipes/check", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { recipeData } = req.body;
      
      if (isNaN(userId) || !recipeData) {
        return res.status(400).json({ message: "Invalid user ID or recipe data" });
      }

      // Check if recipe is already saved
      const isSaved = await storage.isSavedRecipe(userId, recipeData);
      return res.json({ isSaved });
    } catch (error) {
      console.error("Error checking saved recipe:", error);
      return res.status(500).json({ message: "Failed to check saved recipe" });
    }
  });

  // Save a recipe to user's saved recipes
  app.post("/api/users/:userId/saved-recipes", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { recipeData, tags } = req.body;
      
      if (isNaN(userId) || !recipeData) {
        return res.status(400).json({ message: "Invalid user ID or recipe data" });
      }

      // Ensure user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if recipe is already saved
      const isSaved = await storage.isSavedRecipe(userId, recipeData);
      if (isSaved) {
        return res.status(409).json({ message: "Recipe already saved" });
      }

      // Save recipe
      const savedRecipe = await storage.createSavedRecipe({
        userId,
        recipeData,
        tags: tags || []
      });

      return res.status(201).json(savedRecipe);
    } catch (error) {
      console.error("Error saving recipe:", error);
      return res.status(500).json({ message: "Failed to save recipe" });
    }
  });

  // Delete a saved recipe
  app.delete("/api/users/:userId/saved-recipes/:recipeId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const recipeId = parseInt(req.params.recipeId);
      
      if (isNaN(userId) || isNaN(recipeId)) {
        return res.status(400).json({ message: "Invalid user ID or recipe ID" });
      }

      // Ensure user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get recipe to verify it belongs to the user
      const recipe = await storage.getSavedRecipe(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      if (recipe.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this recipe" });
      }

      // Delete recipe
      await storage.deleteSavedRecipe(recipeId);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting saved recipe:", error);
      return res.status(500).json({ message: "Failed to delete saved recipe" });
    }
  });

  // Save user ingredients
  app.post("/api/users/:userId/ingredients", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { ingredients } = req.body;
      
      if (isNaN(userId) || !ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ message: "Invalid user ID or ingredients" });
      }

      // Ensure user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Save each ingredient
      const savedIngredients = await Promise.all(
        ingredients.map(async (ingredientName) => {
          // Check if ingredient exists
          let ingredient = await storage.getIngredientByName(ingredientName);
          
          // Create ingredient if it doesn't exist
          if (!ingredient) {
            ingredient = await storage.createIngredient({ name: ingredientName });
          }
          
          // Link ingredient to user
          await storage.addUserIngredient({
            userId,
            ingredientId: ingredient.id
          });
          
          return ingredient;
        })
      );

      return res.status(201).json(savedIngredients);
    } catch (error) {
      console.error("Error saving ingredients:", error);
      return res.status(500).json({ message: "Failed to save ingredients" });
    }
  });

  // Get user's saved ingredients
  app.get("/api/users/:userId/ingredients", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Ensure user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get user's saved ingredients
      const userIngredients = await storage.getUserIngredients(userId);
      return res.json(userIngredients);
    } catch (error) {
      console.error("Error fetching user ingredients:", error);
      return res.status(500).json({ message: "Failed to fetch ingredients" });
    }
  });

  // Delete a user's saved ingredient
  app.delete("/api/users/:userId/ingredients/:ingredientId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const ingredientId = parseInt(req.params.ingredientId);
      
      if (isNaN(userId) || isNaN(ingredientId)) {
        return res.status(400).json({ message: "Invalid user ID or ingredient ID" });
      }

      // Remove the ingredient link
      await storage.removeUserIngredient(userId, ingredientId);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      return res.status(500).json({ message: "Failed to delete ingredient" });
    }
  });
  
  // Get ingredient substitutes
  app.get("/api/substitutes", async (req, res) => {
    try {
      const { ingredient } = req.query;
      
      if (!ingredient || typeof ingredient !== 'string') {
        return res.status(400).json({ 
          message: "Missing or invalid ingredient parameter"
        });
      }
      
      // Get ingredient substitutes
      const substitutes = await getIngredientSubstitutes(ingredient);
      return res.json(substitutes);
    } catch (error) {
      console.error("Error getting ingredient substitutes:", error);
      return res.status(500).json({ 
        message: "فشل في العثور على بدائل. يرجى المحاولة مرة أخرى."
      });
    }
  });
  
  // Search for recipes by name
  app.get("/api/recipes/search", async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ 
          message: "Missing or invalid query parameter"
        });
      }
      
      // Simple validation
      if (query.trim().length < 2) {
        return res.status(400).json({
          message: "Query must be at least 2 characters long"
        });
      }
      
      // Generate recipes using Google Gemini AI
      try {
        // Here we're using the same Gemini function but with a modified prompt
        // In a production app, you'd create a separate function for search by name
        const recipesData = await generateRecipesGemini([query]);
        
        // Add videos to recipes
        const recipesWithVideos = await Promise.all(
          recipesData.recipes.map(async (recipe: any) => {
            if (recipe.videoId) return recipe;
            
            try {
              const videoId = await searchYouTubeVideos(recipe.title + " recipe");
              return { ...recipe, videoId };
            } catch (error) {
              console.error(`Error fetching video for ${recipe.title}:`, error);
              return recipe;
            }
          })
        );
        
        return res.json({
          recipes: recipesWithVideos,
          suggestedIngredients: recipesData.suggestedIngredients || []
        });
      } catch (error) {
        console.error("Error searching recipes by name:", error);
        return res.status(200).json({
          recipes: [],
          suggestedIngredients: [
            "طماطم", "بصل", "بطاطس", "دجاج", "أرز", "ثوم", "زيت زيتون", "بيض", "جزر", "فلفل"
          ],
          message: "حدث خطأ أثناء البحث عن الوصفات. يرجى المحاولة مرة أخرى لاحقًا."
        });
      }
    } catch (error) {
      console.error("Error in recipe search:", error);
      return res.status(500).json({
        message: "حدث خطأ أثناء معالجة طلبك"
      });
    }
  });

  // Translation endpoint
  // تمت إزالة نقطة نهاية الترجمة
  
  // تمت إزالة نقطة نهاية الترجمة متعددة اللغات

  // Admin features
  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const loginSchema = z.object({
        username: z.string().min(1),
        password: z.string().min(1)
      });

      const validatedData = loginSchema.parse(req.body);
      
      // قائمة المشرفين المسموح لهم بالدخول (في تطبيق حقيقي، هذا سيكون في قاعدة البيانات)
      const adminCredentials = {
        username: "admin",
        password: "admin123"
      };
      
      // التحقق من بيانات الدخول
      if (validatedData.username !== adminCredentials.username || 
          validatedData.password !== adminCredentials.password) {
        return res.status(401).json({ message: "بيانات اعتماد غير صحيحة للمشرف" });
      }

      // ملاحظة: تم نقل إرسال إشعار تسجيل الدخول إلى واجهة المستخدم
      // سيتم إرسال الإشعار من خلال نقطة النهاية /api/login/notify بعد تسجيل الدخول بنجاح
      // هذا يمنع إرسال إشعارات مزدوجة عند تسجيل دخول المشرف
      
      // إرجاع بيانات المستخدم المشرف
      return res.status(200).json({
        id: 9999, // رقم تعريفي خاص بالمشرف
        username: adminCredentials.username,
        isAdmin: true
      });
    } catch (error) {
      console.error("Admin login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ message: "فشل تسجيل دخول المشرف" });
    }
  });
  
  // حذف منشور بواسطة المشرف
  app.delete("/api/admin/posts/:postId", async (req, res) => {
    try {
      // التحقق من صلاحيات المشرف
      if (!verifyAdminAccess(req, res)) return;
      
      const postId = parseInt(req.params.postId);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "معرف المنشور غير صالح" });
      }
      
      // التحقق من وجود المنشور
      const post = await storage.getCommunityPost(postId);
      if (!post) {
        return res.status(404).json({ message: "المنشور غير موجود" });
      }
      
      // حذف المنشور
      await storage.deleteCommunityPost(postId);
      
      // إرسال إشعار Discord (اختياري) إذا تم حذف المنشور من قبل مشرف
      try {
        await sendAutoRemovalNotification(postId, 0, 'تم الحذف بواسطة مشرف');
      } catch (error) {
        console.warn("Could not send Discord notification:", error);
      }
      
      return res.status(200).json({ message: "تم حذف المنشور بنجاح" });
    } catch (error) {
      console.error("Admin delete post error:", error);
      return res.status(500).json({ message: "فشل حذف المنشور" });
    }
  });
  
  // Helper function to verify admin access
  function verifyAdminAccess(req: Request, res: Response): boolean {
    if (req.query.adminKey !== "admin123") {
      res.status(403).json({ message: "وصول مرفوض. يجب أن تكون مشرف." });
      return false;
    }
    return true;
  }
  
  // الحصول على البلاغات للمشرفين
  app.get("/api/admin/reports", async (req, res) => {
    try {
      // التحقق من صلاحيات المشرف
      if (!verifyAdminAccess(req, res)) return;
      
      // جلب كل البلاغات مع معلومات المنشورات المرتبطة
      const reportedPostIds = await storage.getAllReportedPostIds();
      
      // تجميع البيانات النهائية للإرجاع
      const reports = await Promise.all(
        reportedPostIds.map(async (postId) => {
          const post = await storage.getCommunityPost(postId);
          const reportCount = await storage.getPostReportsCount(postId);
          
          return {
            postId,
            postTitle: post?.title || "المنشور غير متوفر",
            reportCount,
            createdAt: post?.createdAt || new Date(),
            authorId: post?.userId
          };
        })
      );
      
      return res.json(reports);
    } catch (error) {
      console.error("Error fetching admin reports:", error);
      return res.status(500).json({ message: "فشل في استرجاع البلاغات" });
    }
  });

  // Community posts endpoints
  // Get all community posts (with optional pagination)
  app.get("/api/community-posts", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const posts = await storage.getAllCommunityPosts(limit, offset);
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      return res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Get trending community posts
  app.get("/api/community-posts/trending", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const posts = await storage.getTrendingCommunityPosts(limit);
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching trending posts:", error);
      return res.status(500).json({ message: "Failed to fetch trending posts" });
    }
  });

  // Get recent community posts
  app.get("/api/community-posts/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const posts = await storage.getRecentCommunityPosts(limit);
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching recent posts:", error);
      return res.status(500).json({ message: "Failed to fetch recent posts" });
    }
  });

  // Get posts by category/type (e.g. recipe, challenge)
  app.get("/api/community-posts/types/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const posts = await storage.getPostsByType(type);
      return res.json(posts);
    } catch (error) {
      console.error(`Error fetching posts of type ${req.params.type}:`, error);
      return res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Get a specific post by ID
  app.get("/api/community-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getCommunityPost(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      return res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      return res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // Create a new community post
  app.post("/api/community-posts", async (req, res) => {
    try {
      // جلب البيانات الأساسية من طلب الإنشاء
      const { userName, userAvatar, ...postPayload } = req.body;
      const postData = insertCommunityPostSchema.parse(postPayload);
      
      // Ensure user exists
      const user = await storage.getUser(postData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // التحقق من المحتوى للكشف عن المحتوى غير اللائق
      const moderationResult = await moderateContent(
        postData.content,
        postData.title,
        postData.imageUrl || undefined
      );
      
      // إذا كان المحتوى غير مناسب، ارفض إنشاء المنشور
      if (!moderationResult.isAppropriate) {
        return res.status(400).json({
          message: "محتوى غير مناسب",
          reason: moderationResult.reason || "يحتوي المنشور على محتوى غير لائق أو مخالف للقواعد."
        });
      }
      
      // إذا كان هناك محتوى معدل (تم تنقيته)، استخدمه بدلاً من المحتوى الأصلي
      const safeContent = moderationResult.moderatedContent || postData.content;
      
      // إضافة معلومات المستخدم الإضافية (الاسم والصورة) للمنشور
      // تحقق مما إذا كان المستخدم مشرفًا أو مرسل من معرفات المشرفين الخاصة
      const isAdmin = user.isAdmin || postData.userId === 5 || postData.userId === 9999 || Boolean(postData.isVerified);
      
      const enrichedPostData = {
        ...postData,
        content: safeContent, // استخدام المحتوى الآمن
        userName: isAdmin ? "فريق كويك ريسب" : (userName || user.username || "User"),
        userAvatar: isAdmin ? "https://cdn-icons-png.flaticon.com/512/1177/1177428.png" : (userAvatar || ""),
        userLevel: isAdmin ? "Admin" : (postData.userLevel || undefined), // دائماً "Admin" للمشرفين
        isVerified: isAdmin, // إضافة علامة التوثيق للمشرفين
      };
      
      const post = await storage.createCommunityPost(enrichedPostData);
      
      // إذا تم تعديل المحتوى للتنقية، أخبر المستخدم
      if (moderationResult.moderatedContent) {
        return res.status(201).json({
          ...post,
          message: "تم نشر المحتوى بعد التعديل لإزالة أي محتوى غير لائق."
        });
      }
      
      return res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Update a community post
  app.patch("/api/community-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      // Verify the post exists
      const existingPost = await storage.getCommunityPost(id);
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Verify the user owns the post (in a real app)
      // if (existingPost.userId !== req.user.id) {
      //  return res.status(403).json({ message: "Not authorized to update this post" });
      // }
      
      // تحقق مما إذا كان المستخدم الذي يقوم بالتعديل مشرفًا أو من معرفات المشرفين
      const user = await storage.getUser(existingPost.userId);
      const isAdmin = (user && user.isAdmin) || existingPost.userId === 5 || existingPost.userId === 9999 || Boolean(existingPost.isVerified);
      
      const updateData = insertCommunityPostSchema.partial().parse(req.body);
      
      // حفظ حالة التوثيق وتحديث userLevel للمشرفين
      updateData.isVerified = isAdmin;
      updateData.userLevel = isAdmin ? "Admin" : updateData.userLevel;
      
      // التحقق من المحتوى إذا تم تحديثه
      if (updateData.content || updateData.title || updateData.imageUrl) {
        const moderationResult = await moderateContent(
          updateData.content || existingPost.content,
          updateData.title || existingPost.title,
          (updateData.imageUrl || existingPost.imageUrl || undefined)
        );
        
        // إذا كان المحتوى غير مناسب، ارفض التحديث
        if (!moderationResult.isAppropriate) {
          return res.status(400).json({
            message: "محتوى غير مناسب",
            reason: moderationResult.reason || "يحتوي التحديث على محتوى غير لائق أو مخالف للقواعد."
          });
        }
        
        // إذا كان هناك محتوى معدل (تم تنقيته)، استخدمه بدلاً من المحتوى الأصلي
        if (updateData.content && moderationResult.moderatedContent) {
          updateData.content = moderationResult.moderatedContent;
        }
      }
      
      const updatedPost = await storage.updateCommunityPost(id, updateData);
      
      return res.json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to update post" });
    }
  });

  // Delete a community post
  app.delete("/api/community-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      // Verify the post exists
      const existingPost = await storage.getCommunityPost(id);
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Verify the user owns the post (in a real app)
      // if (existingPost.userId !== req.user.id) {
      //  return res.status(403).json({ message: "Not authorized to delete this post" });
      // }
      
      await storage.deleteCommunityPost(id);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting post:", error);
      return res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Like a post
  app.post("/api/community-posts/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      // Verify the post exists
      const existingPost = await storage.getCommunityPost(id);
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      await storage.likePost(id);
      
      // Get the updated post
      const updatedPost = await storage.getCommunityPost(id);
      return res.json(updatedPost);
    } catch (error) {
      console.error("Error liking post:", error);
      return res.status(500).json({ message: "Failed to like post" });
    }
  });
  
  // Report a post
  app.post("/api/community-posts/:id/report", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      let { userId, reason } = req.body;
      
      if (!userId || !reason) {
        return res.status(400).json({ message: "User ID and reason are required" });
      }
      
      // تحويل معرف المستخدم إلى رقم إذا كان سلسلة نصية
      userId = typeof userId === 'string' ? parseInt(userId) : userId;
      
      // التحقق من وجود المستخدم
      let user = await storage.getUser(userId);
      
      // إذا لم يتم العثور على المستخدم، استخدم معرف المستخدم الافتراضي (1)
      if (!user) {
        console.warn(`User with ID ${userId} not found, using default user (1) for report`);
        userId = 1;
        user = await storage.getUser(1);
        if (!user) {
          // إنشاء مستخدم افتراضي إذا لم يكن موجوداً
          user = await storage.createUser({
            username: "default_user",
            password: "default_password",
            email: "default@example.com"
          });
          userId = user.id;
        }
      }
      
      // Verify the post exists
      const existingPost = await storage.getCommunityPost(postId);
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Check if user has already reported this post
      try {
        const hasReported = await storage.hasUserReportedPost(userId, postId);
        if (hasReported) {
          return res.status(400).json({ message: "You have already reported this post" });
        }
      } catch (error) {
        // المواصلة حتى إذا فشل التحقق (في حالة عدم وجود جدول البلاغات بعد)
        console.warn("Could not check if user reported post:", error);
      }
      
      try {
        // إنشاء بلاغ جديد
        const report = await storage.reportPost({
          userId,
          postId,
          reason
        });
        
        // إرسال إشعار إلى Discord
        try {
          await sendPostReportToDiscord(report.id);
        } catch (discordError) {
          console.error("Failed to send Discord notification:", discordError);
          // استمر حتى إذا فشل إرسال إشعار Discord
        }
        
        // تحقق مما إذا كان المنشور تجاوز الحد الأقصى للبلاغات (50 بلاغ)
        const reportsCount = await storage.getPostReportsCount(postId);
        if (reportsCount >= 50) {
          // حذف المنشور تلقائيًا
          await storage.deleteCommunityPost(postId);
          
          // إرسال إشعار بالحذف التلقائي
          try {
            await sendAutoRemovalNotification(postId, reportsCount);
          } catch (discordError) {
            console.error("Failed to send auto-removal notification:", discordError);
          }
          
          return res.status(200).json({
            message: "Post automatically removed due to excessive reports",
            wasRemoved: true
          });
        }
        
        return res.status(201).json({
          message: "Post reported successfully",
          postReports: existingPost.reports + 1,
          report
        });
      } catch (error) {
        console.error("Error reporting post:", error);
        return res.status(500).json({ message: "Failed to report post" });
      }
    } catch (error) {
      console.error("Error processing report:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  });
  
  // Save a post (add to favorites)
  app.post("/api/community-posts/:id/save", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      let { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      // تحويل معرف المستخدم إلى رقم إذا كان سلسلة نصية
      userId = typeof userId === 'string' ? parseInt(userId) : userId;
      
      // التحقق من وجود المستخدم
      let user = await storage.getUser(userId);
      
      // إذا لم يتم العثور على المستخدم، استخدم معرف المستخدم الافتراضي (1)
      if (!user) {
        console.warn(`User with ID ${userId} not found, using default user (1) for save post`);
        userId = 1;
        user = await storage.getUser(1);
        if (!user) {
          // إنشاء مستخدم افتراضي إذا لم يكن موجوداً
          user = await storage.createUser({
            username: "default_user",
            password: "default_password",
            email: "default@example.com"
          });
          userId = user.id;
        }
      }
      
      // Verify the post exists
      const existingPost = await storage.getCommunityPost(postId);
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Check if post is already saved
      try {
        const isSaved = await storage.isPostSaved(userId, postId);
        if (isSaved) {
          return res.status(400).json({ message: "Post already saved" });
        }
      } catch (error) {
        // المواصلة حتى إذا فشل التحقق (في حالة عدم وجود جدول المنشورات المحفوظة بعد)
        console.warn("Could not check if post is saved:", error);
      }
      
      try {
        // حفظ المنشور
        const savedPost = await storage.savePost({
          userId,
          postId
        });
        
        return res.status(201).json({
          message: "Post saved successfully",
          savedPost
        });
      } catch (error) {
        console.error("Error saving post:", error);
        return res.status(500).json({ message: "Failed to save post" });
      }
    } catch (error) {
      console.error("Error processing save post:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  });
  
  // Unsave (remove from favorites) a post
  app.delete("/api/community-posts/:id/save", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Verify the post exists
      const existingPost = await storage.getCommunityPost(postId);
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Check if post is actually saved
      try {
        const isSaved = await storage.isPostSaved(userId, postId);
        if (!isSaved) {
          return res.status(400).json({ message: "Post is not saved" });
        }
      } catch (error) {
        // المواصلة حتى إذا فشل التحقق (في حالة عدم وجود جدول المنشورات المحفوظة بعد)
        console.warn("Could not check if post is saved:", error);
      }
      
      try {
        // إلغاء حفظ المنشور
        await storage.unsavePost(userId, postId);
        
        return res.status(200).json({
          message: "Post unsaved successfully"
        });
      } catch (error) {
        console.error("Error unsaving post:", error);
        return res.status(500).json({ message: "Failed to unsave post" });
      }
    } catch (error) {
      console.error("Error processing unsave post:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  });
  
  // Get saved posts for a user
  app.get("/api/users/:userId/saved-posts", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Verify user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      try {
        // الحصول على المنشورات المحفوظة للمستخدم
        const savedPosts = await storage.getUserSavedPosts(userId);
        
        return res.status(200).json(savedPosts);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
        return res.status(500).json({ message: "Failed to fetch saved posts" });
      }
    } catch (error) {
      console.error("Error processing get saved posts:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  });

  // Get comments for a post
  app.get("/api/community-posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const comments = await storage.getPostComments(postId);
      return res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Add a comment to a post
  app.post("/api/community-posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      // Verify the post exists
      const existingPost = await storage.getCommunityPost(postId);
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const commentData = insertPostCommentSchema.parse({
        ...req.body,
        postId,
      });
      
      // التحقق من المحتوى للكشف عن التعليقات غير اللائقة
      const moderationResult = await moderateComment(commentData.content);
      
      // إذا كان التعليق غير مناسب، ارفض إنشاءه
      if (!moderationResult.isAppropriate) {
        return res.status(400).json({
          message: "تعليق غير مناسب",
          reason: moderationResult.reason || "يحتوي التعليق على محتوى غير لائق أو مخالف للقواعد."
        });
      }
      
      // إذا كان هناك محتوى معدل (تم تنقيته)، استخدمه بدلاً من المحتوى الأصلي
      const safeContent = moderationResult.moderatedContent || commentData.content;
      
      // استخدام النسخة الآمنة من التعليق
      const safeCommentData = {
        ...commentData,
        content: safeContent
      };
      
      const comment = await storage.createPostComment(safeCommentData);
      
      // إذا تم تعديل المحتوى للتنقية، أخبر المستخدم
      if (moderationResult.moderatedContent) {
        return res.status(201).json({
          ...comment,
          message: "تم نشر التعليق بعد التعديل لإزالة أي محتوى غير لائق."
        });
      }
      
      return res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Delete a comment
  app.delete("/api/comments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }
      
      await storage.deletePostComment(id);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // API endpoint لاستقبال رسائل الاتصال والإبلاغ عن الأخطاء
  app.post("/api/contact", async (req, res) => {
    try {
      console.log("تلقي طلب اتصال جديد:", req.body);
      const { name, email, subject, message } = req.body;
      
      // تحقق من صحة البيانات
      if (!name || !email || !subject || !message) {
        console.log("بيانات اتصال غير مكتملة:", req.body);
        return res.status(400).json({ 
          message: "جميع الحقول مطلوبة: الاسم، البريد الإلكتروني، الموضوع، والرسالة" 
        });
      }
      
      // في بيئة الإنتاج، يمكننا إرسال بريد إلكتروني هنا باستخدام SendGrid أو خدمة مماثلة
      console.log(`رسالة اتصال جديدة من ${name} (${email}):`);
      console.log(`الموضوع: ${subject}`);
      console.log(`الرسالة: ${message}`);
      console.log(`سيتم إرسال رد إلى البريد الإلكتروني: ${email}`);
      
      // محاكاة معالجة الرسالة
      const responseData = {
        success: true,
        message: "تم استلام رسالتك بنجاح! سنرد عليك قريباً.",
        contactId: Date.now().toString(), // معرّف وهمي للاتصال
        receivedAt: new Date().toISOString()
      };
      
      // إرسال رد نجاح
      console.log("إرسال رد إلى العميل:", responseData);
      return res.status(200).json(responseData);
    } catch (error) {
      console.error("خطأ في معالجة نموذج الاتصال:", error);
      return res.status(500).json({ 
        success: false, 
        message: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
