import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileMetrics } from "@/components/profile/ProfileMetrics";
import { ProfileContent } from "@/components/profile/ProfileContent";

const Profile = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id: profileId } = useParams(); // For viewing other user profiles

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        console.log("User logged in:", user.id);
      } else {
        navigate("/signin");
      }
    };
    
    checkUser();
  }, [navigate]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', profileId || userId],
    queryFn: async () => {
      const targetId = profileId || userId;
      if (!targetId) return null;
      console.log("Fetching profile for user:", targetId);
      
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetId)
        .single();
      
      if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        if (fetchError.code === 'PGRST116') {
          console.log("Profile not found, creating new profile");
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: targetId,
                username: 'New User',
                notifications_enabled: true,
              }
            ])
            .select()
            .single();
            
          if (createError) {
            console.error("Error creating profile:", createError);
            throw createError;
          }
          return newProfile;
        }
        throw fetchError;
      }
      
      return existingProfile;
    },
    enabled: !!(profileId || userId)
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['user-posts', profileId || userId],
    queryFn: async () => {
      const targetId = profileId || userId;
      if (!targetId) return [];
      console.log("Fetching posts for user:", targetId);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', targetId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!(profileId || userId)
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate("/signin");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['profile', profileId || userId] });
  };

  const isOwnProfile = !profileId || profileId === userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {isOwnProfile && (
            <div className="flex justify-end">
              <Button variant="destructive" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          )}
          
          <ProfileHeader 
            profile={profile} 
            isOwnProfile={isOwnProfile}
            onProfileUpdate={handleProfileUpdate}
          />
          <ProfileMetrics posts={posts} />
          <ProfileContent posts={posts} postsLoading={postsLoading} />
        </div>
      </main>
    </div>
  );
};

export default Profile;