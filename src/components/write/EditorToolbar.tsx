import { Button } from "@/components/ui/button";
import { Bold, Italic, Image, Type, List, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface EditorToolbarProps {
  onFormat: (format: string) => void;
  onImageUpload: (url: string) => void;
}

export const EditorToolbar = ({ onFormat, onImageUpload }: EditorToolbarProps) => {
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('article-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);

      console.log("Image uploaded successfully:", publicUrl);
      onImageUpload(publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex space-x-2 border-b pb-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("**")}
        type="button"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("*")}
        type="button"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("#")}
        type="button"
      >
        <Type className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("-")}
        type="button"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("[")}
        type="button"
      >
        <Link className="h-4 w-4" />
      </Button>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => document.getElementById('image-upload')?.click()}
          type="button"
        >
          <Image className="h-4 w-4" />
        </Button>
        <input
          type="file"
          id="image-upload"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};