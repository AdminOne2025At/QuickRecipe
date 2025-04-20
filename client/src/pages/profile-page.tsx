import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Camera, LogOut, Save } from "lucide-react";

export default function ProfilePage() {
  const { currentUser, isLoading, signOut, updateProfile, uploadPicture, userPreferences, updateUserPreferences } = useAuth();
  const [location, setLocation] = useLocation();
  
  const [displayName, setDisplayName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [preferences, setPreferences] = useState(userPreferences);
  
  // استخراج علامة التبويب من عنوان URL
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const defaultTab = urlParams.get('tab') === 'preferences' ? 'preferences' : 'profile';

  // إذا لم يكن المستخدم مسجل الدخول، قم بتحويله إلى صفحة تسجيل الدخول
  useEffect(() => {
    if (!isLoading && !currentUser) {
      setLocation("/auth");
    }
  }, [currentUser, isLoading, setLocation]);

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

  const handleProfileUpdate = async () => {
    try {
      setSaving(true);
      
      if (imageFile) {
        setUploading(true);
        await uploadPicture(imageFile);
        setUploading(false);
        setImageFile(null);
      }
      
      if (displayName !== currentUser.displayName) {
        await updateProfile(displayName);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesUpdate = () => {
    updateUserPreferences(preferences);
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="mb-6 text-3xl font-bold">الملف الشخصي</h1>
      
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
                onClick={() => signOut()}
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
                خصص تجربتك في تطبيق Fast Recipe حسب اختياراتك.
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