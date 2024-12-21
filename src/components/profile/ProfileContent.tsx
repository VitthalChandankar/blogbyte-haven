import { ArticleCard } from "@/components/ArticleCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post } from "@/lib/supabase";

interface ProfileContentProps {
  posts: Post[] | undefined;
  postsLoading: boolean;
}

export const ProfileContent = ({ posts, postsLoading }: ProfileContentProps) => {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="drafts">Drafts</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="space-y-6 mt-6">
        {postsLoading ? (
          <p>Loading posts...</p>
        ) : posts?.length ? (
          posts.map((post) => (
            <ArticleCard key={post.id} />
          ))
        ) : (
          <p className="text-gray-600">No posts yet</p>
        )}
      </TabsContent>
      <TabsContent value="drafts">
        <p className="text-gray-600">No drafts yet</p>
      </TabsContent>
      <TabsContent value="analytics">
        <p className="text-gray-600">Analytics coming soon</p>
      </TabsContent>
    </Tabs>
  );
};