import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleCard } from "@/components/ArticleCard";
import { Clock, Eye, BookOpen, BarChart } from "lucide-react";

const Profile = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        console.log("User logged in:", user.id);
      }
    };
    
    checkUser();
  }, []);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      console.log("Fetching profile for user:", userId);
      
      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_id', userId)  // Changed from user_id to auth_id
        .single();
      
      if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        // If profile doesn't exist, create one
        if (fetchError.code === 'PGRST116') {
          console.log("Profile not found, creating new profile");
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                auth_id: userId,  // Changed from user_id to auth_id
                username: 'New User',
                notifications_enabled: true,
              }
            ])
            .select()
            .single();
            
          if (createError) throw createError;
          return newProfile;
        }
        throw fetchError;
      }
      
      return existingProfile;
    },
    enabled: !!userId
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['user-posts', userId],
    queryFn: async () => {
      if (!userId) return [];
      console.log("Fetching posts for user:", userId);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', userId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  console.log("Profile data:", profile);
  console.log("Posts data:", posts);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="flex items-center space-x-6 py-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  {profile?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{profile?.username || 'User'}</h1>
                <p className="text-gray-600">{profile?.bio || 'No bio yet'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex items-center space-x-2 py-6">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Posts</p>
                  <p className="text-2xl font-bold">{posts?.length || 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center space-x-2 py-6">
                <Clock className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Avg. Reading Time</p>
                  <p className="text-2xl font-bold">5 min</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center space-x-2 py-6">
                <Eye className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold">1.2k</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center space-x-2 py-6">
                <BarChart className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Engagement Rate</p>
                  <p className="text-2xl font-bold">4.5%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="space-y-6 mt-6">
              {postsLoading ? (
                <p>Loading posts...</p>
              ) : posts?.length ? (
                posts.map((post) => (
                  <ArticleCard key={post.id} />
                ))
              ) : (
                <p className="text-gray-600">No posts yet</p>
              )}
            </TabsContent>
            <TabsContent value="drafts">
              <p className="text-gray-600">No drafts yet</p>
            </TabsContent>
            <TabsContent value="analytics">
              <p className="text-gray-600">Analytics coming soon</p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;