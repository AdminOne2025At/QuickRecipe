import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Camera, Save, LogOut, Shield, Settings } from "lucide-react";
import { auth, updateUserProfile, uploadProfilePicture } from "@/lib/firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import translations from "@/lib/translations";
import { useQuery } from "@tanstack/react-query";

export default function ProfilePage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { language } = useLanguage();
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // التحقق مما إذا كان المستخدم مشرفًا
  const isAdmin = user?.isAdmin === true;
  
  // التفضيلات الافتراضية
  const defaultUserPreferences = {
    theme: 'system' as 'light' | 'dark' | 'system',
    notificationsEnabled: true,
    favoriteCuisine: 'عربية'
  };
  
  const [preferences, setPreferences] = useState(defaultUserPreferences);
  
  // استعلامات الإحصائيات للمشرف
  const { data: postsCount = 0, isLoading: postsCountLoading } = useQuery({
    queryKey: ['/api/community-posts/count'],
    enabled: isAdmin
  });
  
  const { data: usersCount = 0, isLoading: usersCountLoading } = useQuery({
    queryKey: ['/api/users/count'],
    enabled: isAdmin
  });
  
  const { data: reportsCount = 0, isLoading: reportsCountLoading } = useQuery({
    queryKey: ['/api/reports/count'],
    enabled: isAdmin
  });
  
  // استخراج علامة التبويب من عنوان URL
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const defaultTab = urlParams.get('tab') === 'preferences' ? 'preferences' : 'profile';

  // التحقق من حالة تسجيل الدخول
  useEffect(() => {
    // التحقق أولاً من وجود مستخدم في سياق المصادقة
    if (user) {
      console.log("User found in auth context:", user);
      setIsLoading(false);
      
      // في حالة المشرف، استخدام بيانات المستخدم من سياق المصادقة مباشرة
      if (user.isAdmin) {
        console.log("Admin user detected, using auth context user");
        setCurrentUser({
          uid: user.id.toString(), 
          displayName: user.displayName || "مشرف النظام",
          email: user.email,
          photoURL: user.photoURL
        });
        
        // تحميل التفضيلات للمشرف
        const adminPrefKey = `preferences_admin_${user.id}`;
        const savedPreferences = localStorage.getItem(adminPrefKey);
        if (savedPreferences) {
          try {
            setPreferences(JSON.parse(savedPreferences));
          } catch (error) {
            console.error("Error parsing admin saved preferences:", error);
          }
        }
        return; // الخروج من useEffect لأننا وجدنا المستخدم
      }
    }
    
    // في حالة عدم وجود مستخدم مشرف، نتحقق من Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("Firebase user found:", firebaseUser.displayName);
        setCurrentUser(firebaseUser);
        
        // تحميل التفضيلات من localStorage
        const savedPreferences = localStorage.getItem(`preferences_${firebaseUser.uid}`);
        if (savedPreferences) {
          try {
            setPreferences(JSON.parse(savedPreferences));
          } catch (error) {
            console.error("Error parsing saved preferences:", error);
          }
        }
      } else {
        console.log("No user found in Firebase, redirecting to auth page");
        // إذا لم يوجد مستخدم في Firebase ولا في سياق المصادقة، نوجه للصفحة تسجيل الدخول
        if (!user) {
          window.location.href = "/auth";
        }
      }
      
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [user, setLocation]);

  // تحديث بيانات النموذج عندما يتم تحميل بيانات المستخدم
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || "");
      setImagePreview(currentUser.photoURL);
    }
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    try {
      // إذا كان المستخدم مشرفًا، قم بإزالة بيانات المستخدم من localStorage فقط
      if (isAdmin) {
        console.log("Admin user logging out");
        localStorage.removeItem("user");
        window.location.href = "/auth";
        return;
      }
      
      // لبقية المستخدمين، استخدم تسجيل الخروج من Firebase
      await firebaseSignOut(auth);
      localStorage.removeItem("user");
      window.location.href = "/auth";
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setSaving(true);
      
      if (imageFile) {
        setUploading(true);
        const downloadURL = await uploadProfilePicture(imageFile);
        await updateUserProfile(displayName, downloadURL);
        setUploading(false);
        setImageFile(null);
        toast({
          title: "تم التحديث",
          description: "تم رفع الصورة بنجاح",
        });
      } else if (displayName !== currentUser.displayName) {
        await updateUserProfile(displayName);
        toast({
          title: "تم التحديث",
          description: "تم تحديث الاسم بنجاح",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الملف الشخصي",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesUpdate = () => {
    try {
      // حفظ التفضيلات في localStorage
      localStorage.setItem(`preferences_${currentUser.uid}`, JSON.stringify(preferences));
      toast({
        title: "تم الحفظ",
        description: "تم حفظ التفضيلات بنجاح",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ التفضيلات",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-center md:text-right">{translations['profilePage'][language]}</h1>
      </div>
      
      <Tabs defaultValue={defaultTab} className="w-full">
        <div className="flex justify-center w-full mb-6">
          <TabsList className={`grid w-full max-w-md ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} mb-6`}>
            <TabsTrigger value="profile">{translations['personalInfo'][language]}</TabsTrigger>
            <TabsTrigger value="preferences">{translations['preferencesTab'][language]}</TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="bg-amber-100 hover:bg-amber-200 text-amber-900">
                <Shield className="h-4 w-4 mr-2" />
                {translations['adminPanelTab'][language]}
              </TabsTrigger>
            )}
          </TabsList>
        </div>
        
        {/* المعلومات الشخصية */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{translations['personalInfo'][language]}</CardTitle>
              <CardDescription>
                {translations['personalInfoDesc'][language]}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={imagePreview || ""} alt={displayName} />
                    <AvatarFallback>{displayName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="profileImage" 
                    className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary p-1 text-primary-foreground shadow-sm hover:bg-primary/90"
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                {uploading && <p className="text-sm text-muted-foreground">{translations['uploadingImage'][language]}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">{translations['displayName'][language]}</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={translations['enterName'][language]}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{translations['email'][language]}</Label>
                <Input
                  id="email"
                  value={currentUser.email || ""}
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  {translations['emailGoogleDesc'][language]}
                </p>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 w-full justify-start"
                >
                  <LogOut className="h-4 w-4" />
                  {translations['signOutAccount'][language]}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleProfileUpdate} 
                disabled={saving || uploading}
                className="gap-2"
              >
                {(saving || uploading) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {translations['saveChanges'][language]}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* الإعدادات والتفضيلات */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{translations['preferencesTitle'][language]}</CardTitle>
              <CardDescription>
                {translations['preferencesDesc'][language]}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{translations['appearance'][language]}</h3>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Select
                    value={preferences.theme}
                    onValueChange={(value) => setPreferences({...preferences, theme: value as 'light' | 'dark' | 'system'})}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={translations['appearance'][language]} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{translations['lightMode'][language]}</SelectItem>
                      <SelectItem value="dark">{translations['darkMode'][language]}</SelectItem>
                      <SelectItem value="system">{translations['systemMode'][language]}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label htmlFor="theme">{translations['displayMode'][language]}</Label>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{translations['notifications'][language]}</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">{translations['enableNotifications'][language]}</Label>
                  <Switch
                    id="notifications"
                    checked={preferences.notificationsEnabled}
                    onCheckedChange={(checked) => setPreferences({...preferences, notificationsEnabled: checked})}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{translations['foodPreferences'][language]}</h3>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Select
                    value={preferences.favoriteCuisine}
                    onValueChange={(value) => setPreferences({...preferences, favoriteCuisine: value})}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={translations['favoriteCuisine'][language]} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="عربية">عربية</SelectItem>
                      <SelectItem value="مصرية">مصرية</SelectItem>
                      <SelectItem value="لبنانية">لبنانية</SelectItem>
                      <SelectItem value="سورية">سورية</SelectItem>
                      <SelectItem value="خليجية">خليجية</SelectItem>
                      <SelectItem value="مغربية">مغربية</SelectItem>
                      <SelectItem value="هندية">هندية</SelectItem>
                      <SelectItem value="إيطالية">إيطالية</SelectItem>
                      <SelectItem value="صينية">صينية</SelectItem>
                      <SelectItem value="تركية">تركية</SelectItem>
                      <SelectItem value="يابانية">يابانية</SelectItem>
                      <SelectItem value="أمريكية">أمريكية</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label htmlFor="cuisineType">{translations['favoriteCuisine'][language]}</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handlePreferencesUpdate} 
                className="ml-auto gap-2"
              >
                <Save className="h-4 w-4" />
                {translations['saveSettings'][language]}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* لوحة تحكم المشرف */}
        {isAdmin && (
          <TabsContent value="admin">
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Shield className="h-6 w-6" />
                  <div>
                    <CardTitle>{translations['adminDashboard'][language]}</CardTitle>
                    <CardDescription className="text-amber-100">
                      {translations['adminDashboardDesc'][language]}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="rounded-lg bg-amber-100 p-4 border border-amber-200">
                  <h3 className="text-lg font-medium flex items-center text-amber-900 mb-4">
                    <Settings className="h-5 w-5 mr-2" />
                    {translations['moderationSettings'][language]}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-md shadow-sm">
                        <h4 className="font-medium mb-2">{translations['discordAlerts'][language]}</h4>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="discord-notifications">{translations['sendDiscordNotifications'][language]}</Label>
                          <Switch
                            id="discord-notifications"
                            checked={true}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {translations['sendDiscordAlertsDesc'][language]}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-white rounded-md shadow-sm">
                        <h4 className="font-medium mb-2">{translations['autoDeletePosts'][language]}</h4>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="auto-delete">{translations['autoDeletePosts'][language]}</Label>
                          <Switch
                            id="auto-delete"
                            checked={true}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {translations['autoDeletePostsDesc'][language]}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">{translations['contentModerationSettings'][language]}</h4>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="content-moderation">{translations['aiContentModeration'][language]}</Label>
                        <Switch
                          id="content-moderation"
                          checked={true}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {translations['aiContentModerationDesc'][language]}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-white p-4 border">
                  <h3 className="text-lg font-medium mb-4">{translations['platformStats'][language]}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                      <p className="text-sm text-blue-600">{translations['posts'][language]}</p>
                      <p className="text-2xl font-bold">
                        {postsCountLoading ? (
                          <Loader2 className="h-5 w-5 inline-block animate-spin" />
                        ) : postsCount}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-md border border-green-100">
                      <p className="text-sm text-green-600">{translations['users'][language]}</p>
                      <p className="text-2xl font-bold">
                        {usersCountLoading ? (
                          <Loader2 className="h-5 w-5 inline-block animate-spin" />
                        ) : usersCount}
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-md border border-red-100">
                      <p className="text-sm text-red-600">{translations['reportsHeader'][language]}</p>
                      <p className="text-2xl font-bold">
                        {reportsCountLoading ? (
                          <Loader2 className="h-5 w-5 inline-block animate-spin" />
                        ) : reportsCount}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-white p-4 border">
                  <h3 className="text-lg font-medium mb-4">{translations['quickLinks'][language]}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="gap-2 justify-start border-amber-200 hover:bg-amber-50"
                      onClick={() => setLocation("/community-posts")}
                    >
                      <Settings className="h-4 w-4 text-amber-500" />
                      {translations['manageCommunityPosts'][language]}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="gap-2 justify-start border-amber-200 hover:bg-amber-50"
                      onClick={() => window.open(process.env.DISCORD_WEBHOOK_URL?.split('/webhooks/')[0], '_blank')}
                    >
                      <Settings className="h-4 w-4 text-amber-500" />
                      {translations['openDiscordChannel'][language]}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 inline-flex mr-1" />
                  {translations['adminFullPrivilegesMessage'][language]}
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}