import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Pencil } from "lucide-react";

interface EditProfileDialogProps {
  profileId: string;
  currentUsername?: string;
  currentBio?: string;
  currentOccupation?: string;
  onProfileUpdate: () => void;
}

export const EditProfileDialog = ({
  profileId,
  currentUsername,
  currentBio,
  currentOccupation,
  onProfileUpdate
}: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(currentUsername || "");
  const [bio, setBio] = useState(currentBio || "");
  const [occupation, setOccupation] = useState(currentOccupation || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let avatar_url = undefined;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${profileId}-avatar.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        avatar_url = publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          occupation,
          ...(avatar_url && { avatar_url }),
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      onProfileUpdate();
      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Profile Picture</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Occupation</label>
            <Input
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="Your occupation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};