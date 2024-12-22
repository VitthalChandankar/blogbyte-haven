import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Profile } from "@/lib/supabase";
import { EditProfileDialog } from "./EditProfileDialog";

interface ProfileHeaderProps {
  profile: Profile | null;
  isOwnProfile?: boolean;
  onProfileUpdate: () => void;
}

export const ProfileHeader = ({ profile, isOwnProfile, onProfileUpdate }: ProfileHeaderProps) => {
  return (
    <Card>
      <CardContent className="flex items-start justify-between py-6">
        <div className="flex items-center space-x-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>
              {profile?.username?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{profile?.username || 'User'}</h1>
            {profile?.occupation && (
              <p className="text-sm text-gray-600">{profile.occupation}</p>
            )}
            <p className="text-gray-600">{profile?.bio || 'No bio yet'}</p>
          </div>
        </div>
        {isOwnProfile && profile && (
          <EditProfileDialog
            profileId={profile.id}
            currentUsername={profile.username}
            currentBio={profile.bio}
            currentOccupation={profile.occupation}
            onProfileUpdate={onProfileUpdate}
          />
        )}
      </CardContent>
    </Card>
  );
};