import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Map,
  Milestone,
  ChefHat,
  Utensils,
  Trophy,
  Sparkles,
  Globe,
  Clock,
  Star,
  Award,
  Flame
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Sample journey data for demonstration
const SAMPLE_JOURNEY_DATA = [
  {
    id: 1,
    type: 'recipe_created',
    title: 'First Recipe',
    description: 'Created your first recipe',
    date: '2025-01-10',
    cuisineType: 'Italian',
    experienceGained: 50,
    icon: 'recipe'
  },
  {
    id: 2,
    type: 'badge_earned',
    title: 'Recipe Creator',
    description: 'Earned the Recipe Creator badge',
    date: '2025-01-10',
    experienceGained: 100,
    icon: 'badge'
  },
  {
    id: 3,
    type: 'cuisine_explored',
    title: 'Italian Cuisine',
    description: 'Explored Italian cuisine',
    date: '2025-01-15',
    cuisineType: 'Italian',
    experienceGained: 75,
    icon: 'cuisine'
  },
  {
    id: 4,
    type: 'recipe_created',
    title: 'Vegetable Pasta',
    description: 'Created a pasta recipe',
    date: '2025-01-20',
    cuisineType: 'Italian',
    experienceGained: 50,
    icon: 'recipe'
  },
  {
    id: 5,
    type: 'challenge_joined',
    title: 'Pasta Challenge',
    description: 'Joined the Weekly Pasta Challenge',
    date: '2025-02-01',
    challengeName: 'Pasta Challenge',
    experienceGained: 150,
    icon: 'challenge'
  },
  {
    id: 6,
    type: 'cuisine_explored',
    title: 'Mexican Cuisine',
    description: 'Explored Mexican cuisine',
    date: '2025-02-10',
    cuisineType: 'Mexican',
    experienceGained: 75,
    icon: 'cuisine'
  },
  {
    id: 7,
    type: 'recipe_created',
    title: 'Chicken Tacos',
    description: 'Created a taco recipe',
    date: '2025-02-15',
    cuisineType: 'Mexican',
    experienceGained: 50,
    icon: 'recipe'
  },
  {
    id: 8,
    type: 'badge_earned',
    title: 'Cuisine Explorer',
    description: 'Earned the Cuisine Explorer badge for trying multiple cuisines',
    date: '2025-02-20',
    experienceGained: 200,
    icon: 'badge'
  },
  {
    id: 9,
    type: 'challenge_won',
    title: 'Pasta Challenge Winner',
    description: 'Won the Weekly Pasta Challenge!',
    date: '2025-03-01',
    experienceGained: 300,
    icon: 'trophy'
  },
  {
    id: 10,
    type: 'level_up',
    title: 'Level Up',
    description: 'Advanced to Chef Level 3: Home Cook',
    date: '2025-03-05',
    experienceGained: 0,
    icon: 'level'
  },
];

// Arabic translations
const SAMPLE_JOURNEY_DATA_AR = [
  {
    id: 1,
    type: 'recipe_created',
    title: 'الوصفة الأولى',
    description: 'أنشأت وصفتك الأولى',
    date: '2025-01-10',
    cuisineType: 'إيطالي',
    experienceGained: 50,
    icon: 'recipe'
  },
  {
    id: 2,
    type: 'badge_earned',
    title: 'منشئ الوصفات',
    description: 'حصلت على شارة منشئ الوصفات',
    date: '2025-01-10',
    experienceGained: 100,
    icon: 'badge'
  },
  {
    id: 3,
    type: 'cuisine_explored',
    title: 'المطبخ الإيطالي',
    description: 'استكشفت المطبخ الإيطالي',
    date: '2025-01-15',
    cuisineType: 'إيطالي',
    experienceGained: 75,
    icon: 'cuisine'
  },
  {
    id: 4,
    type: 'recipe_created',
    title: 'باستا بالخضار',
    description: 'أنشأت وصفة باستا',
    date: '2025-01-20',
    cuisineType: 'إيطالي',
    experienceGained: 50,
    icon: 'recipe'
  },
  {
    id: 5,
    type: 'challenge_joined',
    title: 'تحدي الباستا',
    description: 'انضممت إلى تحدي الباستا الأسبوعي',
    date: '2025-02-01',
    challengeName: 'تحدي الباستا',
    experienceGained: 150,
    icon: 'challenge'
  },
  {
    id: 6,
    type: 'cuisine_explored',
    title: 'المطبخ المكسيكي',
    description: 'استكشفت المطبخ المكسيكي',
    date: '2025-02-10',
    cuisineType: 'مكسيكي',
    experienceGained: 75,
    icon: 'cuisine'
  },
  {
    id: 7,
    type: 'recipe_created',
    title: 'تاكو الدجاج',
    description: 'أنشأت وصفة تاكو',
    date: '2025-02-15',
    cuisineType: 'مكسيكي',
    experienceGained: 50,
    icon: 'recipe'
  },
  {
    id: 8,
    type: 'badge_earned',
    title: 'مستكشف المطابخ',
    description: 'حصلت على شارة مستكشف المطابخ لتجربة مطابخ متعددة',
    date: '2025-02-20',
    experienceGained: 200,
    icon: 'badge'
  },
  {
    id: 9,
    type: 'challenge_won',
    title: 'الفائز بتحدي الباستا',
    description: 'فزت بتحدي الباستا الأسبوعي!',
    date: '2025-03-01',
    experienceGained: 300,
    icon: 'trophy'
  },
  {
    id: 10,
    type: 'level_up',
    title: 'ترقية المستوى',
    description: 'ترقيت إلى مستوى الطاهي 3: طباخ منزلي',
    date: '2025-03-05',
    experienceGained: 0,
    icon: 'level'
  },
];

// Sample exploration stats for the journey map
const EXPLORATION_STATS = {
  cuisinesExplored: [
    { name: 'Italian', count: 2 },
    { name: 'Mexican', count: 2 },
    { name: 'Chinese', count: 1 },
  ],
  recipesCreated: 10,
  challengesCompleted: 3,
  challengesWon: 1,
  badgesEarned: 5,
  totalXP: 1250,
};

// Arabic translation for exploration stats
const EXPLORATION_STATS_AR = {
  cuisinesExplored: [
    { name: 'إيطالي', count: 2 },
    { name: 'مكسيكي', count: 2 },
    { name: 'صيني', count: 1 },
  ],
  recipesCreated: 10,
  challengesCompleted: 3,
  challengesWon: 1,
  badgesEarned: 5,
  totalXP: 1250,
};

interface CulinaryJourneyMapProps {
  userId?: number;
  journeyEvents?: any[];
  stats?: any;
}

export default function CulinaryJourneyMap({ 
  userId,
  journeyEvents = SAMPLE_JOURNEY_DATA,
  stats = EXPLORATION_STATS
}: CulinaryJourneyMapProps) {
  const { language } = useLanguage();
  const isArabic = language.startsWith('ar');
  const { toast } = useToast();
  
  // Use the appropriate language data
  const events = isArabic ? SAMPLE_JOURNEY_DATA_AR : journeyEvents;
  const explorationStats = isArabic ? EXPLORATION_STATS_AR : stats;
  
  // Format date based on language
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isArabic) {
      return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Text translations
  const texts = {
    culinaryJourney: isArabic ? "رحلتك الطهي" : "Your Culinary Journey",
    journeyDescription: isArabic ? "تتبع تقدمك واستكشافاتك في عالم الطبخ" : "Track your progress and explorations in the culinary world",
    milestones: isArabic ? "المعالم" : "Milestones",
    stats: isArabic ? "الإحصائيات" : "Stats",
    cuisinesExplored: isArabic ? "المطابخ المستكشفة" : "Cuisines Explored",
    recipesCreated: isArabic ? "الوصفات المنشأة" : "Recipes Created",
    challengesCompleted: isArabic ? "التحديات المكتملة" : "Challenges Completed",
    challengesWon: isArabic ? "التحديات المفوز بها" : "Challenges Won",
    badgesEarned: isArabic ? "الشارات المكتسبة" : "Badges Earned",
    totalXP: isArabic ? "مجموع نقاط الخبرة" : "Total XP",
    shareJourney: isArabic ? "مشاركة رحلتك" : "Share Your Journey",
    seeRecommendations: isArabic ? "رؤية التوصيات" : "See Recommendations",
    today: isArabic ? "اليوم" : "Today",
    viewAll: isArabic ? "عرض الكل" : "View All",
    downloadAsCertificate: isArabic ? "تنزيل كشهادة" : "Download as Certificate",
    yourJourney: isArabic ? "رحلتك" : "Your Journey",
  };
  
  // Get icon component based on event type
  const getEventIcon = (type: string, iconName: string) => {
    const iconSize = "h-6 w-6";
    const iconColor = getEventColor(type);
    
    switch (iconName) {
      case 'recipe':
        return <Utensils className={`${iconSize} ${iconColor}`} />;
      case 'badge':
        return <Award className={`${iconSize} ${iconColor}`} />;
      case 'cuisine':
        return <Globe className={`${iconSize} ${iconColor}`} />;
      case 'challenge':
        return <Flame className={`${iconSize} ${iconColor}`} />;
      case 'trophy':
        return <Trophy className={`${iconSize} ${iconColor}`} />;
      case 'level':
        return <ChefHat className={`${iconSize} ${iconColor}`} />;
      default:
        return <Milestone className={`${iconSize} ${iconColor}`} />;
    }
  };
  
  // Get color based on event type
  const getEventColor = (type: string) => {
    switch (type) {
      case 'recipe_created':
        return 'text-blue-500';
      case 'badge_earned':
        return 'text-purple-500';
      case 'cuisine_explored':
        return 'text-green-500';
      case 'challenge_joined':
        return 'text-orange-500';
      case 'challenge_won':
        return 'text-yellow-500';
      case 'level_up':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Get background color based on event type
  const getEventBgColor = (type: string) => {
    switch (type) {
      case 'recipe_created':
        return 'bg-blue-50';
      case 'badge_earned':
        return 'bg-purple-50';
      case 'cuisine_explored':
        return 'bg-green-50';
      case 'challenge_joined':
        return 'bg-orange-50';
      case 'challenge_won':
        return 'bg-yellow-50';
      case 'level_up':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };
  
  // Handle share journey
  const handleShareJourney = () => {
    // Implement journey sharing via social media, etc.
    toast({
      title: isArabic ? "تمت مشاركة رحلتك!" : "Journey shared!",
      description: isArabic ? "تمت مشاركة رحلتك الطهي مع أصدقائك." : "Your culinary journey has been shared with your friends.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">{texts.culinaryJourney}</h2>
        <p className="text-muted-foreground">{texts.journeyDescription}</p>
      </div>
      
      {/* Journey Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{texts.recipesCreated}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{explorationStats.recipesCreated}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{texts.challengesCompleted}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{explorationStats.challengesCompleted}</div>
            <div className="text-xs text-muted-foreground">
              {explorationStats.challengesWon} {texts.challengesWon}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{texts.badgesEarned}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{explorationStats.badgesEarned}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Cuisine Exploration */}
      <Card>
        <CardHeader>
          <CardTitle>{texts.cuisinesExplored}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {explorationStats.cuisinesExplored.map((cuisine: any, index: number) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {cuisine.name} ({cuisine.count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Journey Timeline */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{texts.yourJourney}</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleShareJourney}>
              {texts.shareJourney}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 border-r-2 border-dashed border-gray-200" />
            
            {events.map((event, index) => (
              <div key={event.id} className="relative flex items-start pb-8 last:pb-0">
                {/* Icon */}
                <div className={`flex rounded-full ${getEventBgColor(event.type)} p-2 mr-4 z-10`}>
                  {getEventIcon(event.type, event.icon)}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(event.date)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {event.description}
                  </p>
                  {event.experienceGained > 0 && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                      <Sparkles className="h-3 w-3 mr-1" />
                      +{event.experienceGained} XP
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            
            {/* Current point */}
            <div className="relative flex items-start pt-4">
              <div className="flex rounded-full bg-blue-100 p-2 mr-4 z-10">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1 pt-1">
                <div className="font-medium">{texts.today}</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.print()}>
            {texts.downloadAsCertificate}
          </Button>
          <Button>
            {texts.seeRecommendations}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}