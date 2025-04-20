import { useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChefProgressCard from "@/components/ChefProgressCard";
import CookingChallenges from "@/components/CookingChallenges";
import CulinaryJourneyMap from "@/components/CulinaryJourneyMap";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

// Sample user recipes for demonstration
const SAMPLE_USER_RECIPES = [
  { id: 1, title: "Pasta Carbonara", description: "Classic Italian pasta dish", cuisine: "Italian" },
  { id: 2, title: "Chicken Tacos", description: "Spicy Mexican tacos", cuisine: "Mexican" },
  { id: 3, title: "Vegetable Stir Fry", description: "Healthy Asian stir fry", cuisine: "Asian" },
];

// Arabic translation of sample recipes
const SAMPLE_USER_RECIPES_AR = [
  { id: 1, title: "باستا كاربونارا", description: "طبق باستا إيطالي كلاسيكي", cuisine: "إيطالي" },
  { id: 2, title: "تاكو الدجاج", description: "تاكو مكسيكي حار", cuisine: "مكسيكي" },
  { id: 3, title: "خضار مقلي", description: "قلي صحي آسيوي", cuisine: "آسيوي" },
];

export default function GamificationPage() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const isArabic = language.startsWith('ar');
  
  // Simple demo data
  const userRecipes = isArabic ? SAMPLE_USER_RECIPES_AR : SAMPLE_USER_RECIPES;
  
  // Initial tab to display
  const urlParams = new URLSearchParams(window.location.search);
  const defaultTab = urlParams.get('tab') || 'progress';
  
  // Handlers for different features
  const handleViewJourney = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Wait for scroll to complete before changing tab
    setTimeout(() => {
      document.querySelector('[data-value="journey"]')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
    }, 500);
  };
  
  const handleJoinChallenge = (challengeId: number) => {
    console.log(`Joined challenge: ${challengeId}`);
    // Here you would connect to a backend API to join the challenge
  };
  
  const handleSubmitEntry = (challengeId: number, recipeId: number, submissionText: string) => {
    console.log(`Submitted entry for challenge ${challengeId} with recipe ${recipeId}`);
    console.log(`Submission text: ${submissionText}`);
    // Here you would connect to a backend API to submit the entry
  };
  
  const handleVote = (entryId: number) => {
    console.log(`Voted for entry: ${entryId}`);
    // Here you would connect to a backend API to vote for an entry
  };
  
  // Text translations
  const texts = {
    gamification: isArabic ? "منصة الطبخ التفاعلية" : "Interactive Cooking Platform",
    progress: isArabic ? "تقدم الطاهي" : "Chef Progress",
    challenges: isArabic ? "تحديات الطبخ" : "Cooking Challenges",
    journey: isArabic ? "خريطة الرحلة" : "Journey Map",
    loading: isArabic ? "جاري التحميل..." : "Loading...",
    notLoggedIn: isArabic ? "يرجى تسجيل الدخول لعرض هذه الصفحة" : "Please log in to view this page",
  };
  
  // Authentication check is disabled for demonstration
  /*
  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{texts.loading}</span>
      </div>
    );
  }
  
  if (!currentUser) {
    // Redirect to auth page after a short delay
    setTimeout(() => setLocation("/auth"), 1500);
    
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg">{texts.notLoggedIn}</p>
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }
  */
  
  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">{texts.gamification}</h1>
      
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="progress" data-value="progress">{texts.progress}</TabsTrigger>
          <TabsTrigger value="challenges" data-value="challenges">{texts.challenges}</TabsTrigger>
          <TabsTrigger value="journey" data-value="journey">{texts.journey}</TabsTrigger>
        </TabsList>
        
        {/* Chef Progress */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left column: Chef progress card */}
            <ChefProgressCard
              currentLevel={3}
              currentXP={350}
              earnedBadges={[1, 3, 5]}
              onViewJourney={handleViewJourney}
            />
            
            {/* Right column: Upcoming featured items */}
            <div className="space-y-6">
              <div className="rounded-lg border p-6">
                <h3 className="mb-4 text-xl font-semibold">
                  {isArabic ? "التحديات المميزة القادمة" : "Upcoming Featured Challenges"}
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4 rounded-md bg-muted/50 p-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                      <span className="text-lg font-bold text-amber-600">15</span>
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {isArabic ? "أفكار وجبة إفطار سريعة" : "Quick Breakfast Ideas"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? "تبدأ في 15 مايو" : "Starts May 15"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 rounded-md bg-muted/50 p-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-lg font-bold text-blue-600">30</span>
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {isArabic ? "أطباق الشواء الصيفية" : "Summer Grilling Dishes"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? "تبدأ في 30 مايو" : "Starts May 30"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border p-6">
                <h3 className="mb-4 text-xl font-semibold">
                  {isArabic ? "المهارات التالية" : "Skills Next Up"}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {isArabic ? "مهارات المطبخ الإيطالي" : "Italian Cuisine Skills"}
                    </span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-3/4 rounded-full bg-amber-500"></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium">
                      {isArabic ? "تقنيات السكين" : "Knife Techniques"}
                    </span>
                    <span className="text-sm text-muted-foreground">50%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-1/2 rounded-full bg-blue-500"></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium">
                      {isArabic ? "تقنيات الخبز" : "Baking Techniques"}
                    </span>
                    <span className="text-sm text-muted-foreground">25%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-1/4 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Cooking Challenges */}
        <TabsContent value="challenges">
          <CookingChallenges
            userRecipes={userRecipes}
            onJoinChallenge={handleJoinChallenge}
            onSubmitEntry={handleSubmitEntry}
            onVote={handleVote}
          />
        </TabsContent>
        
        {/* Journey Map */}
        <TabsContent value="journey">
          <CulinaryJourneyMap />
        </TabsContent>
      </Tabs>
    </div>
  );
}