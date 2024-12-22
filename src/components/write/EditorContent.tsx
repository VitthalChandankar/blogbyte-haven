import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { forwardRef, ForwardedRef } from "react";

interface EditorContentProps {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

interface EditorContentRef {
  insertFormatting: (format: string) => void;
  insertImage: (url: string) => void;
}

export const EditorContent = forwardRef<EditorContentRef, EditorContentProps>(
  ({ title, content, onTitleChange, onContentChange }, ref: ForwardedRef<EditorContentRef>) => {
    const insertFormatting = (format: string) => {
      const textarea = document.querySelector('textarea');
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);

      let newText = content;
      switch (format) {
        case "**":
          newText = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
          break;
        case "*":
          newText = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
          break;
        case "#":
          newText = content.substring(0, start) + `\n# ${selectedText}` + content.substring(end);
          break;
        case "-":
          newText = content.substring(0, start) + `\n- ${selectedText}` + content.substring(end);
          break;
        case "[":
          newText = content.substring(0, start) + `[${selectedText}]()` + content.substring(end);
          break;
        default:
          return;
      }

      onContentChange(newText);
    };

    const insertImage = (url: string) => {
      const imageMarkdown = `\n![Image](${url})\n`;
      const newText = content + imageMarkdown;
      onContentChange(newText);
    };

    // Expose methods via ref
    if (ref && typeof ref === 'object') {
      ref.current = {
        insertFormatting,
        insertImage
      };
    }

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
  }
);

EditorContent.displayName = "EditorContent";