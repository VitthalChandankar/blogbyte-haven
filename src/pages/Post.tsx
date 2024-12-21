import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Comment } from "@/components/Comment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Post = () => {
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      console.log("Fetching post with ID:", id);
      // First get the post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (postError) {
        console.error("Error fetching post:", postError);
        throw postError;
      }

      // Then get the author details
      const { data: author, error: authorError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', post.author_id)
        .single();

      if (authorError) {
        console.error("Error fetching author:", authorError);
        // Don't throw here, we'll just return the post without author details
      }

      console.log("Fetched post and author:", { post, author });
      return {
        ...post,
        author: author || { username: 'Anonymous' }
      };
    }
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      console.log("Fetching comments for post:", id);
      // First get the comments
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (commentsError) {
        console.error("Error fetching comments:", commentsError);
        throw commentsError;
      }

      // If we have comments, get the author details for each
      if (comments && comments.length > 0) {
        const commentsWithAuthors = await Promise.all(
          comments.map(async (comment) => {
            const { data: author } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', comment.author_id)
              .single();

            return {
              ...comment,
              author: author || { username: 'Anonymous' }
            };
          })
        );
        console.log("Fetched comments with authors:", commentsWithAuthors);
        return commentsWithAuthors;
      }

      return comments || [];
    }
  });

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
            post_id: id,
            author_id: user.id
          }
        ]);

      if (error) throw error;

      console.log("Comment added to post:", id);
      
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

  if (postLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-serif font-bold mb-4">
              {post.title}
            </h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <img
                  src={post.author?.avatar_url || "https://via.placeholder.com/40"}
                  alt="Author"
                  className="w-10 h-10 rounded-full"
                />
                <span>{post.author?.username || "Anonymous"}</span>
              </div>
              <span>•</span>
              <span>3 min read</span>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </header>
          
          {post.image_url && (
            <img
              src={post.image_url}
              alt="Article hero"
              className="w-full aspect-[2/1] object-cover mb-8 rounded-lg"
            />
          )}
          
          <div className="prose prose-lg max-w-none">
            {post.content}
          </div>

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
              {commentsLoading ? (
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
                  postId={id || ""}
                />
              ))}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default Post;