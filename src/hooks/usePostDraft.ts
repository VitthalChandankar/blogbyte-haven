import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const usePostDraft = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndDraft = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Checking auth status:", user);
      
      if (!user) {
        console.log("User not authenticated, redirecting to signin");
        toast({
          title: "Authentication required",
          description: "Please sign in to write a blog post",
        });
        navigate("/signin");
        return;
      }

      try {
        // Check for existing draft
        const { data: draft, error: draftError } = await supabase
          .from('posts')
          .select('*')
          .eq('author_id', user.id)
          .eq('published', false)
          .maybeSingle();

        if (draftError && draftError.code !== 'PGRST116') {
          console.error("Error fetching draft:", draftError);
          return;
        }

        if (draft) {
          console.log("Loading existing draft:", draft);
          setTitle(draft.title || "");
          setContent(draft.content || "");
        }
      } catch (error) {
        console.error("Error in checkAuthAndDraft:", error);
      }
    };

    checkAuthAndDraft();
  }, [navigate, toast]);

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

      // Check for existing draft
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
        // Update existing draft
        result = await supabase
          .from('posts')
          .update(postData)
          .eq('id', existingDraft.id)
          .select()
          .single();
      } else {
        // Create new draft
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

      // Check for existing draft
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
        // Update and publish existing draft
        result = await supabase
          .from('posts')
          .update(postData)
          .eq('id', existingDraft.id)
          .select()
          .single();
      } else {
        // Create new published post
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
    title,
    setTitle,
    content,
    setContent,
    isLoading,
    handleSaveAsDraft,
    handlePublish
  };
};