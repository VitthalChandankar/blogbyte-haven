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
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Checking auth status:", user);
      
      if (!user) {
        console.log("User not authenticated, redirecting to signin");
        toast({
          title: "Authentication required",
          description: "Please sign in to write a blog post",
        });
        navigate("/signin");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      console.log("Creating new post with title:", title);
      const { data: post, error } = await supabase
        .from('posts')
        .insert([
          {
            title,
            content,
            author_id: user.id,
            published: true
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating post:", error);
        throw error;
      }

      console.log("Post created successfully:", post);
      toast({
        title: "Success!",
        description: "Your article has been published.",
      });

      // Navigate to the newly created post
      navigate(`/post/${post.id}`);
    } catch (error) {
      console.error("Error publishing post:", error);
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      });
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
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
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
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToolClick("Italic")}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToolClick("Heading")}
            >
              <Type className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToolClick("List")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToolClick("Link")}
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToolClick("Image")}
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
          
          <div className="flex justify-end">
            <Button type="submit">Publish</Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Write;