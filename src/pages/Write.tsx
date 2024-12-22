import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { EditorToolbar } from "@/components/write/EditorToolbar";
import { EditorContent } from "@/components/write/EditorContent";
import { usePostDraft } from "@/hooks/usePostDraft";
import { useRef } from "react";

const Write = () => {
  const {
    title,
    setTitle,
    content,
    setContent,
    isLoading,
    handleSaveAsDraft,
    handlePublish
  } = usePostDraft();

  const editorContentRef = useRef<{ insertFormatting: (format: string) => void, insertImage: (url: string) => void }>();

  const handleFormat = (format: string) => {
    editorContentRef.current?.insertFormatting(format);
  };

  const handleImageUpload = (url: string) => {
    editorContentRef.current?.insertImage(url);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handlePublish} className="max-w-3xl mx-auto space-y-6">
          <EditorToolbar 
            onFormat={handleFormat}
            onImageUpload={handleImageUpload}
          />
          
          <EditorContent
            ref={editorContentRef}
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
          />
          
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