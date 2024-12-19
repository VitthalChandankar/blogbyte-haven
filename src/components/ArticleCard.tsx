import { Card, CardContent } from "@/components/ui/card";

export const ArticleCard = () => {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <a href="/post/1" className="flex space-x-4 group">
          <div className="flex-1 space-y-2">
            <h3 className="font-serif font-bold group-hover:text-blue-600 transition-colors">
              Understanding Modern JavaScript: A Deep Dive
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              A comprehensive guide to modern JavaScript features and best practices.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Jane Smith</span>
              <span>•</span>
              <span>3 min read</span>
            </div>
          </div>
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
              alt="Article thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
        </a>
      </CardContent>
    </Card>
  );
};