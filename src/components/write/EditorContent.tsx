import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (format: string) => {
    const textarea = textareaRef.current;
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
    const textarea = textareaRef.current;
    if (!textarea) return;

    const imageMarkdown = `\n![Image](${url})\n`;
    const newText = content + imageMarkdown;
    onContentChange(newText);
  };

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
          ref={textareaRef}
          placeholder="Write your story..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="min-h-[400px] text-lg border-none resize-none px-0 focus-visible:ring-0"
        />
      </div>
    </>
  );
};