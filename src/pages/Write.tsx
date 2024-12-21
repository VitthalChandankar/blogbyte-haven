import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Bold, Italic, Image, Type, List, Link } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Write = () => {
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

      // Check for existing draft
      const { data: draft, error: draftError } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', user.id)
        .eq('published', false)
        .single();

      if (draftError && draftError.code !== 'PGRST116') {
        console.error("Error fetching draft:", draftError);
        return;
      }

      if (draft) {
        console.log("Loading existing draft:", draft);
        setTitle(draft.title || "");
        setContent(draft.content || "");
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
        .single();

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
        .single();

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

  const handleToolClick = (tool: string) => {
    console.log("Tool clicked:", tool);
    toast({
      title: "Feature coming soon",
      description: `${tool} formatting will be available soon.`,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handlePublish} className="max-w-3xl mx-auto space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-4xl font-serif font-bold border-none px-0 focus-visible:ring-0"
            />
          </div>

          <div className="flex space-x-2 border-b pb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToolClick("Bold")}
              type="button"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToolClick("Italic")}
              type="button"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToolClick("Heading")}
              type="button"
            >
              <Type className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToolClick("List")}
              type="button"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToolClick("Link")}
              type="button"
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToolClick("Image")}
              type="button"
            >
              <Image className="h-4 w-4" />
            </Button>
          </div>
          
          <div>
            <Textarea
              placeholder="Write your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] text-lg border-none resize-none px-0 focus-visible:ring-0"
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleSaveAsDraft}
              disabled={isLoading}
            >
              Save as Draft
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              Publish
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Write;