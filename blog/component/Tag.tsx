function Tag({ tag }: { tag: string }) {
  return (
    <a className="tag" href={`/topics/${tag}/`}>
      {`#${tag}`}
    </a>
  );
}

export default Tag;
