interface PostContentProps {
  content: string;
  image_url?: string;
}

export const PostContent = ({ content, image_url }: PostContentProps) => (
  <>
    {image_url && (
      <img
        src={image_url}
        alt="Article hero"
        className="w-full aspect-[2/1] object-cover mb-8 rounded-lg"
      />
    )}
    <div className="prose prose-lg max-w-none">
      {content}
    </div>
  </>
);