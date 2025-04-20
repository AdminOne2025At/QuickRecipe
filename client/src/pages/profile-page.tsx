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
import { Loader2, Camera, Save, LogOut } from "lucide-react";
import { auth, updateUserProfile, uploadProfilePicture } from "@/lib/firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // التفضيلات الافتراضية
  const defaultUserPreferences = {
    theme: 'system' as 'light' | 'dark' | 'system',
    notificationsEnabled: true,
    favoriteCuisine: 'عربية'
  };
  
  const [preferences, setPreferences] = useState(defaultUserPreferences);
  
  // استخراج علامة التبويب من عنوان URL
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const defaultTab = urlParams.get('tab') === 'preferences' ? 'preferences' : 'profile';

  // التحقق من حالة تسجيل الدخول
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
      
      if (!user) {
        setLocation("/auth");
      } else {
        // تحميل التفضيلات من localStorage
        const savedPreferences = localStorage.getItem(`preferences_${user.uid}`);
        if (savedPreferences) {
          try {
            setPreferences(JSON.parse(savedPreferences));
          } catch (error) {
            console.error("Error parsing saved preferences:", error);
          }
        }
      }
    });
    
    return () => unsubscribe();
  }, [setLocation]);

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
      await firebaseSignOut(auth);
      setLocation("/auth");
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
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">الملف الشخصي</h1>
        <Button 
          variant="outline" 
          onClick={handleSignOut}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
      
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="profile">المعلومات الشخصية</TabsTrigger>
          <TabsTrigger value="preferences">الإعدادات</TabsTrigger>
        </TabsList>
        
        {/* المعلومات الشخصية */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الشخصية</CardTitle>
              <CardDescription>
                قم بتعديل معلومات حسابك هنا. بعد الانتهاء، انقر على حفظ التغييرات.
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
                {uploading && <p className="text-sm text-muted-foreground">جاري رفع الصورة...</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">الاسم</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="أدخل اسمك"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  value={currentUser.email || ""}
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  لا يمكن تغيير البريد الإلكتروني المرتبط بحساب Google.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </Button>
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
                حفظ التغييرات
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* الإعدادات والتفضيلات */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات والتفضيلات</CardTitle>
              <CardDescription>
                خصص تجربتك في تطبيق Quick Recipe حسب اختياراتك.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">المظهر</h3>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Select
                    value={preferences.theme}
                    onValueChange={(value) => setPreferences({...preferences, theme: value as 'light' | 'dark' | 'system'})}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="اختر المظهر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">فاتح</SelectItem>
                      <SelectItem value="dark">داكن</SelectItem>
                      <SelectItem value="system">تلقائي (حسب النظام)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label htmlFor="theme">وضع العرض</Label>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">الإشعارات</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">تفعيل الإشعارات</Label>
                  <Switch
                    id="notifications"
                    checked={preferences.notificationsEnabled}
                    onCheckedChange={(checked) => setPreferences({...preferences, notificationsEnabled: checked})}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">تفضيلات الطعام</h3>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Select
                    value={preferences.favoriteCuisine}
                    onValueChange={(value) => setPreferences({...preferences, favoriteCuisine: value})}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="اختر المطبخ المفضل" />
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
                  <Label htmlFor="cuisineType">المطبخ المفضل</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handlePreferencesUpdate} 
                className="ml-auto gap-2"
              >
                <Save className="h-4 w-4" />
                حفظ الإعدادات
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}