import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search");
    console.log("Searching for:", query);
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold">
          <a href="/" className="text-gray-900">
            PracticeByte
          </a>
        </h1>
        
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Input
              type="search"
              name="search"
              placeholder="Search articles..."
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </form>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </Button>
          <Button onClick={() => navigate("/write")}>Write</Button>
        </div>
      </div>
    </header>
  );
};