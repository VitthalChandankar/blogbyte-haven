import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useNotifications();

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {notifications.length === 0 ? (
                <DropdownMenuItem>No notifications</DropdownMenuItem>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`p-4 ${!notification.read ? 'bg-gray-50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div>
                      <p className="font-medium">
                        {notification.type === 'new_post' && "New post from a writer you follow"}
                        {notification.type === 'new_comment' && "New comment on your post"}
                        {notification.type === 'new_follower' && "You have a new follower"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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