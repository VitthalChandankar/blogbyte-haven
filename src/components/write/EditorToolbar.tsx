import { Button } from "@/components/ui/button";
import { Bold, Italic, Image, Type, List, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const EditorToolbar = () => {
  const { toast } = useToast();

  const handleToolClick = (tool: string) => {
    console.log("Tool clicked:", tool);
    toast({
      title: "Feature coming soon",
      description: `${tool} formatting will be available soon.`,
    });
  };

  return (
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
  );
};