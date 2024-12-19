import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export const FeaturedPost = () => {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <Link to="/post/1" className="group">
          <div className="aspect-[16/9] overflow-hidden mb-4">
            <img
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
              alt="Featured post"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold group-hover:text-blue-600 transition-colors">
              The Future of Web Development: What's Next?
            </h2>
            <p className="text-gray-600 line-clamp-2">
              Exploring the latest trends and technologies shaping the future of web development.
              From WebAssembly to Edge Computing, discover what's on the horizon.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>John Doe</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};