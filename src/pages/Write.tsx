import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Bold, Italic, Image, Type, List, Link } from "lucide-react";

const Write = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Publishing post:", { title, content });
    
    toast({
      title: "Post published!",
      description: "Your article has been published successfully.",
    });

    // Simulate redirect to the new post
    navigate("/post/1");
  };

  const handleToolClick = (tool: string) => {
    console.log("Tool clicked:", tool);
    // Here you would implement the actual formatting logic
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

          {/* Formatting toolbar */}
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