type Props = {
  videoId: string;
  title?: string | undefined;
};

function YoutubePlayer({ videoId, title }: Props) {
  return (
    <figure className="video">
      <iframe
        className="video__frame"
        title={title ?? "YouTube video"}
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      {title && <figcaption className="video__caption">{title}</figcaption>}
    </figure>
  );
}

export default YoutubePlayer;
