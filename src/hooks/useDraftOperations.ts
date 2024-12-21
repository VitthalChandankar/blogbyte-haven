import { supabase } from "@/lib/supabase";
import { toast as Toast } from "@/components/ui/use-toast";

interface DraftOperationsProps {
  title: string;
  content: string;
  setIsLoading: (loading: boolean) => void;
  toast: typeof Toast;
}

export const useDraftOperations = ({
  title,
  content,
  setIsLoading,
  toast
}: DraftOperationsProps) => {
  const handleLoadDraft = async (
    userId: string,
    setTitle: (title: string) => void,
    setContent: (content: string) => void
  ) => {
    try {
      const { data: draft, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', userId)
        .eq('published', false)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching draft:", error);
        return;
      }

      if (draft) {
        console.log("Loading existing draft:", draft);
        setTitle(draft.title || "");
        setContent(draft.content || "");
      }
    } catch (error) {
      console.error("Error in handleLoadDraft:", error);
    }
  };

  const handleSaveAsDraft = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save a draft.",
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
        published: false,
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

      const { error } = result;
      if (error) throw error;

      console.log("Draft saved successfully");
      toast({
        title: "Success!",
        description: "Your draft has been saved.",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSaveAsDraft,
    handleLoadDraft
  };
};