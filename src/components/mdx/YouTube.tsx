interface YouTubeProps {
  id: string;
}

export default function YouTube({ id }: YouTubeProps) {
  return (
    <div className="my-6 aspect-video w-full">
      <iframe
        className="w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

