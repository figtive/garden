export type StageName = "seedling" | "budding" | "evergreen";

export const stages: StageName[] = ["seedling", "budding", "evergreen"];

export const stageText: Record<StageName, string> = {
  seedling: "rough, early ideas.",
  budding: "notes that have been worked on, still growing",
  evergreen: "mature and settled, still tended",
};

const sprites: Record<StageName, string[]> = {
  seedling: [
    "...........",
    "...........",
    "...........",
    ".....p.....",
    "....ppp....",
    "...ppppp...",
    "...ppppp...",
    "....ppp....",
    ".....p.....",
    "...........",
    "...........",
  ],
  budding: [
    "...........",
    "...........",
    ".pp.....pp.",
    ".ppp...ppp.",
    "..ppp.ppp..",
    "....ppp....",
    ".....p.....",
    ".....p.....",
    ".....p.....",
    "...........",
    "...........",
  ],
  evergreen: [
    "....ppp....",
    ".pp.ppp.pp.",
    ".ppp.p.ppp.",
    "..pp...pp..",
    "pp..ccc..pp",
    "ppp.ccc.ppp",
    "pp..ccc..pp",
    "..pp...pp..",
    ".ppp.p.ppp.",
    ".pp.ppp.pp.",
    "....ppp....",
  ],
};

function pixelPath(rows: string[], pixel: string) {
  return rows
    .flatMap((row, y) =>
      [...row].map((cell, x) => (cell === pixel ? `M${x} ${y}h1v1h-1z` : "")),
    )
    .join("");
}

function Stage({
  stage,
  label = stage,
  iconOnly = false,
}: {
  stage: StageName;
  label?: string;
  iconOnly?: boolean;
}) {
  const rows = sprites[stage];

  return (
    <span className="stage" data-stage={stage}>
      <svg
        className="stage__icon"
        viewBox="0 0 11 11"
        role={iconOnly ? "img" : undefined}
        aria-hidden={!iconOnly}
      >
        <title>{stage}</title>
        <path className="stage__petals" d={pixelPath(rows, "p")} />
        <path className="stage__center" d={pixelPath(rows, "c")} />
      </svg>
      {!iconOnly && label}
    </span>
  );
}

export default Stage;
