import { Header } from "@/components/Header";
import { FeaturedPost } from "@/components/FeaturedPost";
import { ArticleCard } from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <FeaturedPost />
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold">Latest Articles</h2>
            <Button variant="ghost">View all</Button>
          </div>
          
          <div className="space-y-8">
            <ArticleCard />
            <ArticleCard />
            <ArticleCard />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;