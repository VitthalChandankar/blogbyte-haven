import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Profile } from "@/lib/supabase";

interface ProfileHeaderProps {
  profile: Profile | null;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
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
  );
};