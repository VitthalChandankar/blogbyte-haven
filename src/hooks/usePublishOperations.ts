import { supabase } from "@/lib/supabase";
import { toast as Toast } from "@/components/ui/use-toast";
import { NavigateFunction } from "react-router-dom";

interface PublishOperationsProps {
  title: string;
  content: string;
  setIsLoading: (loading: boolean) => void;
  toast: typeof Toast;
  navigate: NavigateFunction;
}

export const usePublishOperations = ({
  title,
  content,
  setIsLoading,
  toast,
  navigate
}: PublishOperationsProps) => {
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to publish a post.",
          variant: "destructive",
        });
        return;
      }

      const { data: existingDraft } = await supabase
        .from('posts')
        .select('id')
        .eq('author_id', user.id)
        .eq('published', false)
        .maybeSingle();

      const postData = {
        title,
        content,
        author_id: user.id,
        published: true,
        updated_at: new Date().toISOString()
      };

      let result;
      if (existingDraft) {
        result = await supabase
          .from('posts')
          .update(postData)
          .eq('id', existingDraft.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('posts')
          .insert([postData])
          .select()
          .single();
      }

      const { data: post, error } = result;
      if (error) throw error;

      console.log("Post published successfully:", post);
      toast({
        title: "Success!",
        description: "Your article has been published.",
      });

      navigate(`/post/${post.id}`);
    } catch (error) {
      console.error("Error publishing post:", error);
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handlePublish
  };
};