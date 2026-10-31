type PreviewProps = {
  className?: string;
};

function Preview({ className }: PreviewProps) {
  return <div className={className ? `preview ${className}` : "preview"} />;
}

export default Preview;
