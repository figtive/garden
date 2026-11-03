import type { BlogPost } from "../plugin.ts";
import { pluralize } from "../utils/text.ts";
import Stage, { stages } from "./Stage.tsx";

type StageCountsProps = {
  posts: BlogPost[];
};

function StageCounts({ posts }: StageCountsProps) {
  const stageCounts = [...stages]
    .reverse()
    .map((stage) => ({
      stage,
      count: posts.filter((post) => post.pluginOutput.stage === stage).length,
    }))
    .filter(({ count }) => count > 0);

  return (
    <p className="topic__stages text-meta">
      <span>{pluralize(posts.length, "post")}</span>
      {stageCounts.map(({ stage, count }) => (
        <Stage key={stage} stage={stage} label={`${count} ${stage}`} />
      ))}
    </p>
  );
}

export default StageCounts;
