import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { EditorToolbar } from "@/components/write/EditorToolbar";
import { EditorContent } from "@/components/write/EditorContent";
import { usePostDraft } from "@/hooks/usePostDraft";

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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handlePublish} className="max-w-3xl mx-auto space-y-6">
          <EditorContent
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
          />
          
          <EditorToolbar />
          
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