import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Trophy, 
  Clock, 
  ArrowRight, 
  User, 
  Upload, 
  Heart, 
  Vote, 
  ThumbsUp 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/contexts/LanguageContext';

// Sample challenge data for demonstration
export const SAMPLE_CHALLENGES = [
  { 
    id: 1, 
    title: "Summer Vegetarian Delights", 
    description: "Create a refreshing vegetarian dish perfect for summer using seasonal vegetables.",
    theme: "Vegetarian",
    rules: "Must include at least 3 seasonal vegetables. No meat allowed. Creativity is encouraged!",
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-05-07'),
    prizeDescription: "Featured recipe on homepage, Vegetarian Master badge",
    imageUrl: null,
    status: "active",
    participants: 23,
    entries: [
      { id: 1, userId: 101, username: "chef_maria", recipeTitle: "Rainbow Veggie Salad", votes: 18 },
      { id: 2, userId: 102, username: "cooking_dad", recipeTitle: "Grilled Vegetable Platter", votes: 12 },
      { id: 3, userId: 103, username: "veggie_lover", recipeTitle: "Summer Ratatouille", votes: 24 }
    ]
  },
  { 
    id: 2, 
    title: "Quick Breakfast Ideas", 
    description: "Share your best breakfast recipes that can be prepared in 15 minutes or less.",
    theme: "Quick Meals",
    rules: "Recipe must be completable in 15 minutes or less. Breakfast foods only. Ingredients must be common household items.",
    startDate: new Date('2025-05-15'),
    endDate: new Date('2025-05-21'),
    prizeDescription: "Breakfast Champion badge, Featured in newsletter",
    imageUrl: null,
    status: "upcoming",
    participants: 0,
    entries: []
  },
  { 
    id: 3, 
    title: "Traditional Family Recipes", 
    description: "Share a cherished family recipe passed down through generations.",
    theme: "Family Traditions",
    rules: "Recipe must have a family story. Traditional cooking methods preferred. Include a photo of the finished dish.",
    startDate: new Date('2025-04-10'),
    endDate: new Date('2025-04-20'),
    prizeDescription: "Family Heritage badge, Recipe featured in community cookbook",
    imageUrl: null,
    status: "completed",
    participants: 36,
    entries: [
      { id: 4, userId: 104, username: "grandmas_kitchen", recipeTitle: "Italian Sunday Gravy", votes: 45, winner: true },
      { id: 5, userId: 105, username: "heritage_chef", recipeTitle: "Argentinian Empanadas", votes: 37 },
      { id: 6, userId: 106, username: "home_cooking", recipeTitle: "German Apple Strudel", votes: 29 }
    ]
  }
];

// Arabic translations for sample challenges
export const SAMPLE_CHALLENGES_AR = [
  { 
    id: 1, 
    title: "أطباق نباتية صيفية", 
    description: "ابتكر طبقًا نباتيًا منعشًا مثاليًا للصيف باستخدام الخضروات الموسمية.",
    theme: "نباتي",
    rules: "يجب أن تشمل 3 خضروات موسمية على الأقل. غير مسموح باللحوم. الإبداع مشجع!",
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-05-07'),
    prizeDescription: "وصفة مميزة على الصفحة الرئيسية، شارة سيد المأكولات النباتية",
    imageUrl: null,
    status: "active",
    participants: 23,
    entries: [
      { id: 1, userId: 101, username: "الشيف_ماريا", recipeTitle: "سلطة الخضروات قوس قزح", votes: 18 },
      { id: 2, userId: 102, username: "أب_الطبخ", recipeTitle: "طبق الخضار المشوي", votes: 12 },
      { id: 3, userId: 103, username: "محب_الخضار", recipeTitle: "راتاتوي الصيفي", votes: 24 }
    ]
  },
  { 
    id: 2, 
    title: "أفكار وجبة إفطار سريعة", 
    description: "شارك أفضل وصفات الإفطار التي يمكن تحضيرها في 15 دقيقة أو أقل.",
    theme: "وجبات سريعة",
    rules: "يجب إكمال الوصفة في 15 دقيقة أو أقل. أطعمة الإفطار فقط. يجب أن تكون المكونات عناصر منزلية شائعة.",
    startDate: new Date('2025-05-15'),
    endDate: new Date('2025-05-21'),
    prizeDescription: "شارة بطل الإفطار، مميز في النشرة الإخبارية",
    imageUrl: null,
    status: "upcoming",
    participants: 0,
    entries: []
  },
  { 
    id: 3, 
    title: "وصفات عائلية تقليدية", 
    description: "شارك وصفة عائلية عزيزة متوارثة عبر الأجيال.",
    theme: "تقاليد عائلية",
    rules: "يجب أن تحتوي الوصفة على قصة عائلية. يفضل استخدام طرق الطهي التقليدية. تضمين صورة للطبق النهائي.",
    startDate: new Date('2025-04-10'),
    endDate: new Date('2025-04-20'),
    prizeDescription: "شارة التراث العائلي، الوصفة مميزة في كتاب طبخ المجتمع",
    imageUrl: null,
    status: "completed",
    participants: 36,
    entries: [
      { id: 4, userId: 104, username: "مطبخ_الجدة", recipeTitle: "صلصة الأحد الإيطالية", votes: 45, winner: true },
      { id: 5, userId: 105, username: "شيف_التراث", recipeTitle: "إمباناداس أرجنتينية", votes: 37 },
      { id: 6, userId: 106, username: "طبخ_المنزل", recipeTitle: "شترودل التفاح الألماني", votes: 29 }
    ]
  }
];

interface CookingChallengesProps {
  userId?: number;
  userRecipes?: any[];
  onJoinChallenge?: (challengeId: number) => void;
  onSubmitEntry?: (challengeId: number, recipeId: number, submissionText: string) => void;
  onVote?: (entryId: number) => void;
}

export default function CookingChallenges({ 
  userId, 
  userRecipes = [],
  onJoinChallenge,
  onSubmitEntry,
  onVote
}: CookingChallengesProps) {
  const { language } = useLanguage();
  const isArabic = language.startsWith('ar');
  
  const challenges = isArabic ? SAMPLE_CHALLENGES_AR : SAMPLE_CHALLENGES;
  
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<string>("");
  const [submissionText, setSubmissionText] = useState<string>("");
  
  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-blue-500';
      case 'voting':
        return 'bg-purple-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };
  
  // Format date based on language
  const formatDate = (date: Date) => {
    if (isArabic) {
      return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Get status text based on language
  const getStatusText = (status: string) => {
    if (isArabic) {
      switch (status) {
        case 'active':
          return 'نشط';
        case 'upcoming':
          return 'قادم';
        case 'voting':
          return 'تصويت';
        case 'completed':
          return 'مكتمل';
        default:
          return status;
      }
    }
    return status;
  };
  
  // Text translations
  const texts = {
    weeklyChallenge: isArabic ? "تحديات الطبخ الأسبوعية" : "Weekly Cooking Challenges",
    challengeDescription: isArabic ? "شارك في تحديات الطهي وأظهر مهاراتك" : "Participate in cooking challenges and showcase your skills",
    activeChallenge: isArabic ? "التحديات النشطة" : "Active Challenges",
    upcomingChallenge: isArabic ? "التحديات القادمة" : "Upcoming Challenges",
    pastChallenge: isArabic ? "التحديات السابقة" : "Past Challenges",
    theme: isArabic ? "الموضوع" : "Theme",
    rules: isArabic ? "القواعد" : "Rules",
    prize: isArabic ? "الجائزة" : "Prize",
    dates: isArabic ? "التواريخ" : "Dates",
    participants: isArabic ? "المشاركون" : "Participants",
    entries: isArabic ? "المشاركات" : "Entries",
    viewDetails: isArabic ? "عرض التفاصيل" : "View Details",
    joinChallenge: isArabic ? "انضم للتحدي" : "Join Challenge",
    submitEntry: isArabic ? "قدم مشاركتك" : "Submit Entry",
    viewEntries: isArabic ? "عرض المشاركات" : "View Entries",
    selectRecipe: isArabic ? "اختر وصفة" : "Select Recipe",
    submissionNote: isArabic ? "ملاحظة حول مشاركتك" : "Submission Note",
    cancel: isArabic ? "إلغاء" : "Cancel",
    submit: isArabic ? "تقديم" : "Submit",
    vote: isArabic ? "تصويت" : "Vote",
    winner: isArabic ? "الفائز" : "Winner",
    votes: isArabic ? "الأصوات" : "Votes",
    noRecipes: isArabic ? "ليس لديك وصفات لتقديمها. أنشئ وصفة أولاً!" : "You don't have any recipes to submit. Create a recipe first!",
  };
  
  // Handle submission
  const handleSubmit = () => {
    if (selectedChallenge && selectedRecipe && onSubmitEntry) {
      onSubmitEntry(selectedChallenge.id, parseInt(selectedRecipe), submissionText);
      setSubmissionText("");
      setSelectedRecipe("");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">{texts.weeklyChallenge}</h2>
        <p className="text-muted-foreground">{texts.challengeDescription}</p>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">{texts.activeChallenge}</TabsTrigger>
          <TabsTrigger value="upcoming">{texts.upcomingChallenge}</TabsTrigger>
          <TabsTrigger value="past">{texts.pastChallenge}</TabsTrigger>
        </TabsList>
        
        {/* Active Challenges */}
        <TabsContent value="active">
          <div className="grid gap-4 md:grid-cols-2">
            {challenges.filter(c => c.status === 'active').map(challenge => (
              <Card key={challenge.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="line-clamp-1">{challenge.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {challenge.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      className={`${getStatusColor(challenge.status)} text-white`}
                    >
                      {getStatusText(challenge.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{challenge.theme}</Badge>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{challenge.participants}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        {texts.viewDetails}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{challenge.title}</DialogTitle>
                        <DialogDescription>
                          {challenge.description}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">{texts.theme}</h4>
                          <p className="text-sm text-muted-foreground">{challenge.theme}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">{texts.rules}</h4>
                          <p className="text-sm text-muted-foreground">{challenge.rules}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">{texts.prize}</h4>
                          <p className="text-sm text-muted-foreground">{challenge.prizeDescription}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">{texts.dates}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">{texts.participants}</h4>
                          <p className="text-sm text-muted-foreground">{challenge.participants}</p>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button onClick={() => onJoinChallenge && onJoinChallenge(challenge.id)}>
                          {texts.joinChallenge}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        {texts.submitEntry}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{texts.submitEntry}</DialogTitle>
                        <DialogDescription>
                          {challenge.title}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        {userRecipes.length > 0 ? (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="recipe">{texts.selectRecipe}</Label>
                              <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
                                <SelectTrigger>
                                  <SelectValue placeholder={texts.selectRecipe} />
                                </SelectTrigger>
                                <SelectContent>
                                  {userRecipes.map(recipe => (
                                    <SelectItem key={recipe.id} value={recipe.id.toString()}>
                                      {recipe.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="note">{texts.submissionNote}</Label>
                              <Textarea 
                                id="note"
                                placeholder={isArabic ? "أخبرنا المزيد عن وصفتك وكيف تناسب موضوع التحدي..." : "Tell us more about your recipe and how it fits the challenge theme..."}
                                value={submissionText}
                                onChange={(e) => setSubmissionText(e.target.value)}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            {texts.noRecipes}
                          </div>
                        )}
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {
                          setSubmissionText("");
                          setSelectedRecipe("");
                        }}>
                          {texts.cancel}
                        </Button>
                        <Button 
                          onClick={handleSubmit}
                          disabled={!selectedRecipe || userRecipes.length === 0}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {texts.submit}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Upcoming Challenges */}
        <TabsContent value="upcoming">
          <div className="grid gap-4 md:grid-cols-2">
            {challenges.filter(c => c.status === 'upcoming').map(challenge => (
              <Card key={challenge.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="line-clamp-1">{challenge.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {challenge.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      className={`${getStatusColor(challenge.status)} text-white`}
                    >
                      {getStatusText(challenge.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm">
                    <Badge variant="outline">{challenge.theme}</Badge>
                    
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        {texts.viewDetails}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{challenge.title}</DialogTitle>
                        <DialogDescription>
                          {challenge.description}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">{texts.theme}</h4>
                          <p className="text-sm text-muted-foreground">{challenge.theme}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">{texts.rules}</h4>
                          <p className="text-sm text-muted-foreground">{challenge.rules}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">{texts.prize}</h4>
                          <p className="text-sm text-muted-foreground">{challenge.prizeDescription}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">{texts.dates}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Past Challenges */}
        <TabsContent value="past">
          <div className="grid gap-4 md:grid-cols-2">
            {challenges.filter(c => c.status === 'completed').map(challenge => (
              <Card key={challenge.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="line-clamp-1">{challenge.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {challenge.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      className={`${getStatusColor(challenge.status)} text-white`}
                    >
                      {getStatusText(challenge.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm">
                    <Badge variant="outline">{challenge.theme}</Badge>
                    
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                      </span>
                    </div>
                    
                    {challenge.entries.length > 0 && challenge.entries.find((e: any) => e.winner) && (
                      <div className="flex items-start gap-2 bg-yellow-50 p-2 rounded-md border border-yellow-200">
                        <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-yellow-700">{texts.winner}</div>
                          <div className="text-yellow-600">
                            {challenge.entries.find((e: any) => e.winner)?.username}: {challenge.entries.find((e: any) => e.winner)?.recipeTitle}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        {texts.viewEntries}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{texts.entries}</DialogTitle>
                        <DialogDescription>
                          {challenge.title}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="divide-y">
                          {challenge.entries.map((entry: any) => (
                            <div key={entry.id} className="py-3 first:pt-0 last:pb-0">
                              <div className="flex justify-between mb-1">
                                <div className="font-medium flex items-center gap-1">
                                  {entry.winner && <Trophy className="h-4 w-4 text-yellow-500" />}
                                  {entry.recipeTitle}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Heart className="h-4 w-4 text-red-400" />
                                  <span>{entry.votes} {texts.votes}</span>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {entry.username}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}