import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "@/components/Comment";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface CommentsSectionProps {
  postId: string;
  comments: any[];
  isLoading: boolean;
}

export const CommentsSection = ({ postId, comments, isLoading }: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleAddComment = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
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
            content: newComment,
            post_id: postId,
            author_id: user.id
          }
        ]);

      if (error) throw error;
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
      
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-2xl font-serif font-bold mb-6">Comments</h3>
      
      <div className="mb-8">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-2"
        />
        <Button onClick={handleAddComment}>Add Comment</Button>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div>Loading comments...</div>
        ) : comments?.map((comment) => (
          <Comment 
            key={comment.id} 
            comment={{
              id: comment.id,
              content: comment.content,
              author: comment.author?.username || "Anonymous",
              replies: []
            }}
            postId={postId}
          />
        ))}
      </div>
    </div>
  );
};