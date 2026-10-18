import type { ReactNode } from "react";

type RowProps = {
  side?: ReactNode;
  children: ReactNode;
};

function Row({ side, children }: RowProps) {
  return (
    <div className="row">
      <div className="row__side text-meta">{side}</div>
      <div className="row__main">{children}</div>
    </div>
  );
}

export default Row;
