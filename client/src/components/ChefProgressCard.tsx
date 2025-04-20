import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, ChefHat, Sparkles, Star, Flame } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/contexts/LanguageContext';

// Definition of chef levels
export const CHEF_LEVELS = [
  { level: 1, title: "Kitchen Novice", requiredXP: 0, color: "bg-zinc-300" },
  { level: 2, title: "Recipe Follower", requiredXP: 100, color: "bg-zinc-400" },
  { level: 3, title: "Home Cook", requiredXP: 250, color: "bg-amber-200" },
  { level: 4, title: "Enthusiastic Chef", requiredXP: 500, color: "bg-amber-300" },
  { level: 5, title: "Culinary Artist", requiredXP: 1000, color: "bg-amber-400" },
  { level: 6, title: "Kitchen Master", requiredXP: 2000, color: "bg-amber-500" },
  { level: 7, title: "Professional Chef", requiredXP: 3500, color: "bg-amber-600" },
  { level: 8, title: "Culinary Expert", requiredXP: 5000, color: "bg-yellow-500" },
  { level: 9, title: "Chef Virtuoso", requiredXP: 7500, color: "bg-yellow-600" },
  { level: 10, title: "Culinary Legend", requiredXP: 10000, color: "bg-yellow-700" },
];

// Arabic translations for chef levels
export const CHEF_LEVELS_AR = [
  { level: 1, title: "مبتدئ المطبخ", requiredXP: 0, color: "bg-zinc-300" },
  { level: 2, title: "متبع الوصفات", requiredXP: 100, color: "bg-zinc-400" },
  { level: 3, title: "طباخ منزلي", requiredXP: 250, color: "bg-amber-200" },
  { level: 4, title: "طباخ متحمس", requiredXP: 500, color: "bg-amber-300" },
  { level: 5, title: "فنان الطهي", requiredXP: 1000, color: "bg-amber-400" },
  { level: 6, title: "سيد المطبخ", requiredXP: 2000, color: "bg-amber-500" },
  { level: 7, title: "شيف محترف", requiredXP: 3500, color: "bg-amber-600" },
  { level: 8, title: "خبير طهي", requiredXP: 5000, color: "bg-yellow-500" },
  { level: 9, title: "عبقري الطهي", requiredXP: 7500, color: "bg-yellow-600" },
  { level: 10, title: "أسطورة الطهي", requiredXP: 10000, color: "bg-yellow-700" },
];

// Sample badges for demonstration
export const SAMPLE_BADGES = [
  { id: 1, name: "First Recipe", description: "Created your first recipe", category: "basics", imageUrl: null },
  { id: 2, name: "Recipe Explorer", description: "Tried 5 different cuisines", category: "exploration", imageUrl: null },
  { id: 3, name: "Community Chef", description: "Participated in a cooking challenge", category: "community", imageUrl: null },
  { id: 4, name: "Spice Master", description: "Created recipes with 20 different spices", category: "expertise", imageUrl: null },
  { id: 5, name: "Health Guru", description: "Created 10 healthy recipes", category: "specialty", imageUrl: null },
];

// Arabic translations for badges
export const SAMPLE_BADGES_AR = [
  { id: 1, name: "الوصفة الأولى", description: "أنشأت وصفتك الأولى", category: "basics", imageUrl: null },
  { id: 2, name: "مستكشف الوصفات", description: "جربت 5 مطابخ مختلفة", category: "exploration", imageUrl: null },
  { id: 3, name: "طاهي المجتمع", description: "شاركت في تحدي طهي", category: "community", imageUrl: null },
  { id: 4, name: "سيد التوابل", description: "أنشأت وصفات باستخدام 20 نوعًا مختلفًا من التوابل", category: "expertise", imageUrl: null },
  { id: 5, name: "خبير الطعام الصحي", description: "أنشأت 10 وصفات صحية", category: "specialty", imageUrl: null },
];

interface ChefProgressCardProps {
  userId?: number;
  currentLevel?: number;
  currentXP?: number; 
  earnedBadges?: any[];
  onViewJourney?: () => void;
}

export default function ChefProgressCard({ 
  userId, 
  currentLevel = 2, 
  currentXP = 180, 
  earnedBadges = [1, 3],
  onViewJourney 
}: ChefProgressCardProps) {
  const { language } = useLanguage();
  const isArabic = language.startsWith('ar');
  
  const chefLevels = isArabic ? CHEF_LEVELS_AR : CHEF_LEVELS;
  const badges = isArabic ? SAMPLE_BADGES_AR : SAMPLE_BADGES;
  
  const currentLevelData = chefLevels.find(level => level.level === currentLevel) || chefLevels[0];
  const nextLevelData = chefLevels.find(level => level.level === currentLevel + 1) || chefLevels[chefLevels.length - 1];
  
  // Calculate XP needed for next level
  const xpForCurrentLevel = currentLevelData.requiredXP;
  const xpForNextLevel = nextLevelData.requiredXP;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const currentLevelProgress = Math.min(100, ((currentXP - xpForCurrentLevel) / xpNeeded) * 100);
  
  // Filter earned badges
  const userBadges = badges.filter(badge => earnedBadges.includes(badge.id));
  
  // Text based on language
  const texts = {
    chefLevel: isArabic ? "مستوى الطاهي" : "Chef Level",
    yourLevel: isArabic ? "مستواك" : "Your Level",
    xpToNextLevel: isArabic ? "نقاط الخبرة للمستوى التالي" : "XP to Next Level",
    achievements: isArabic ? "الإنجازات" : "Achievements",
    badges: isArabic ? "الشارات" : "Badges",
    progress: isArabic ? "التقدم" : "Progress",
    viewJourney: isArabic ? "عرض رحلتك الطهي" : "View Your Culinary Journey",
    xpPoints: isArabic ? "نقاط الخبرة" : "XP Points",
  };

  // Icons for badge categories
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basics':
        return <ChefHat className="h-4 w-4" />;
      case 'exploration':
        return <Sparkles className="h-4 w-4" />;
      case 'community':
        return <Trophy className="h-4 w-4" />;
      case 'expertise':
        return <Star className="h-4 w-4" />;
      case 'specialty':
        return <Flame className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{texts.chefLevel}</CardTitle>
            <CardDescription>
              {texts.yourLevel}: {currentLevelData.title}
            </CardDescription>
          </div>
          <div className={`p-3 rounded-full ${currentLevelData.color} flex items-center justify-center`}>
            <ChefHat className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Level {currentLevel}</span>
            <span>{texts.xpToNextLevel}: {xpForNextLevel - currentXP}</span>
          </div>
          <Progress value={currentLevelProgress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentXP} XP</span>
            <span>{xpForNextLevel} XP</span>
          </div>
        </div>

        {/* Badge Showcase */}
        <Tabs defaultValue="achievements">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="achievements">{texts.achievements}</TabsTrigger>
            <TabsTrigger value="badges">{texts.badges}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="achievements" className="space-y-4 py-4">
            {userBadges.length > 0 ? (
              <div className="space-y-2">
                {userBadges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      {getCategoryIcon(badge.category)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-muted-foreground">
                {isArabic ? "لم تحصل على أي إنجازات بعد. ابدأ الطهي للحصول على الشارات!" : "No achievements earned yet. Start cooking to earn badges!"}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="badges">
            <div className="flex flex-wrap gap-2 py-4">
              {badges.map(badge => {
                const isEarned = earnedBadges.includes(badge.id);
                return (
                  <Badge key={badge.id} variant={isEarned ? "default" : "outline"} 
                    className={isEarned ? "bg-amber-500 hover:bg-amber-600" : "text-muted-foreground"}>
                    {getCategoryIcon(badge.category)} 
                    <span className="mr-1 ml-1">{badge.name}</span>
                  </Badge>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={onViewJourney} 
          className="w-full"
        >
          {texts.viewJourney}
        </Button>
      </CardFooter>
    </Card>
  );
}