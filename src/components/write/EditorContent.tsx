import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditorContentProps {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export const EditorContent = ({
  title,
  content,
  onTitleChange,
  onContentChange,
}: EditorContentProps) => {
  return (
    <>
      <div>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-4xl font-serif font-bold border-none px-0 focus-visible:ring-0"
        />
      </div>
      <div>
        <Textarea
          placeholder="Write your story..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="min-h-[400px] text-lg border-none resize-none px-0 focus-visible:ring-0"
        />
      </div>
    </>
  );
};