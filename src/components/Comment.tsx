import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface CommentProps {
  comment: {
    id: string;
    content: string;
    author: string;
    replies: CommentProps["comment"][];
  };
  postId: string;
  level?: number;
}

export const Comment = ({ comment, postId, level = 0 }: CommentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();

  const handleReply = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Error",
          description: "You must be logged in to comment.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('comments')
        .insert([
          {
            content: replyContent,
            post_id: postId,
            author_id: user.user.id,
            parent_id: comment.id
          }
        ]);

      if (error) throw error;

      console.log("Reply added to comment:", comment.id);
      
      toast({
        title: "Reply added",
        description: "Your reply has been added successfully.",
      });
      
      setIsReplying(false);
      setReplyContent("");
    } catch (error) {
      console.error("Error adding reply:", error);
      toast({
        title: "Error",
        description: "Failed to add reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`ml-${level * 4} mb-4`}>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm font-medium mb-1">{comment.author}</p>
        <p className="text-gray-700 mb-2">{comment.content}</p>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500"
          onClick={() => setIsReplying(!isReplying)}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Reply
        </Button>
      </div>

      {isReplying && (
        <div className="mt-2 ml-4">
          <Textarea
            placeholder="Write your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="mb-2"
          />
          <Button size="sm" onClick={handleReply}>
            Submit Reply
          </Button>
        </div>
      )}

      {comment.replies?.map((reply) => (
        <Comment key={reply.id} comment={reply} postId={postId} level={level + 1} />
      ))}
    </div>
  );
};