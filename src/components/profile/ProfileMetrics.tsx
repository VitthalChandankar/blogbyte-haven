import { BookOpen, Clock, Eye, BarChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Post } from "@/lib/supabase";

interface ProfileMetricsProps {
  posts: Post[] | undefined;
}

export const ProfileMetrics = ({ posts }: ProfileMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="flex items-center space-x-2 py-6">
          <BookOpen className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">Posts</p>
            <p className="text-2xl font-bold">{posts?.length || 0}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center space-x-2 py-6">
          <Clock className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm text-gray-600">Avg. Reading Time</p>
            <p className="text-2xl font-bold">5 min</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center space-x-2 py-6">
          <Eye className="h-5 w-5 text-purple-500" />
          <div>
            <p className="text-sm text-gray-600">Total Views</p>
            <p className="text-2xl font-bold">1.2k</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center space-x-2 py-6">
          <BarChart className="h-5 w-5 text-orange-500" />
          <div>
            <p className="text-sm text-gray-600">Engagement Rate</p>
            <p className="text-2xl font-bold">4.5%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};