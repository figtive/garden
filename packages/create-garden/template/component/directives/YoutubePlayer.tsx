type Props = {
  videoId: string;
};

function YoutubePlayer({ videoId }: Props) {
  return (
    <iframe
      className="video"
      title="Youtube player"
      sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation"
      src={`https://youtube.com/embed/${videoId}?autoplay=0`}
    ></iframe>
  );
}

export default YoutubePlayer;
