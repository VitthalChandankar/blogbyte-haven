import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { PostHeader } from "@/components/post/PostHeader";
import { PostContent } from "@/components/post/PostContent";
import { CommentsSection } from "@/components/post/CommentsSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Validate UUID format
  if (id && !isValidUUID(id)) {
    console.error("Invalid UUID format:", id);
    navigate("/");
    return null;
  }

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
    },
    enabled: !!id && isValidUUID(id)
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
    },
    enabled: !!id && isValidUUID(id)
  });

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
          <PostHeader 
            title={post.title}
            author={post.author}
            created_at={post.created_at}
          />
          
          <PostContent 
            content={post.content}
            image_url={post.image_url}
          />

          <CommentsSection 
            postId={id || ""}
            comments={comments || []}
            isLoading={commentsLoading}
          />
        </article>
      </main>
    </div>
  );
};

export default Post;