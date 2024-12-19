import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";

const Post = () => {
  const { id } = useParams();
  console.log("Rendering post with ID:", id);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-serif font-bold mb-4">
              Understanding Modern JavaScript: A Deep Dive
            </h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt="Author"
                  className="w-10 h-10 rounded-full"
                />
                <span>Jane Smith</span>
              </div>
              <span>•</span>
              <span>3 min read</span>
              <span>•</span>
              <span>Mar 15, 2024</span>
            </div>
          </header>
          
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
            alt="Article hero"
            className="w-full aspect-[2/1] object-cover mb-8 rounded-lg"
          />
          
          <div className="prose prose-lg max-w-none">
            <p>
              JavaScript has evolved significantly since its inception. Modern JavaScript
              brings powerful features that make development more efficient and enjoyable.
              Let's explore some of these features and best practices.
            </p>
            
            <h2>Modern Features</h2>
            <p>
              ES6+ introduced many game-changing features like arrow functions,
              destructuring, and async/await. These features have revolutionized how we
              write JavaScript code.
            </p>
            
            <h2>Best Practices</h2>
            <p>
              Following best practices ensures your code is maintainable, performant,
              and easy to understand. Some key practices include using meaningful
              variable names, writing pure functions, and proper error handling.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
};

export default Post;