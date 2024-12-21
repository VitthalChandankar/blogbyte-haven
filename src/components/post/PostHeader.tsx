interface PostHeaderProps {
  title: string;
  author: {
    username?: string;
    avatar_url?: string;
  };
  created_at: string;
}

export const PostHeader = ({ title, author, created_at }: PostHeaderProps) => (
  <header className="mb-8">
    <h1 className="text-4xl font-serif font-bold mb-4">
      {title}
    </h1>
    <div className="flex items-center space-x-4 text-gray-600">
      <div className="flex items-center space-x-2">
        <img
          src={author?.avatar_url || "https://via.placeholder.com/40"}
          alt="Author"
          className="w-10 h-10 rounded-full"
        />
        <span>{author?.username || "Anonymous"}</span>
      </div>
      <span>•</span>
      <span>3 min read</span>
      <span>•</span>
      <span>{new Date(created_at).toLocaleDateString()}</span>
    </div>
  </header>
);