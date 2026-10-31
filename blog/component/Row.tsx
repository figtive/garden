import type { ReactNode } from "react";

type RowProps = {
  side?: ReactNode;
  skipPreview?: boolean;
  children: ReactNode;
};

function Row({ side, skipPreview = false, children }: RowProps) {
  return (
    <div className="row" data-preview-skip={skipPreview || undefined}>
      <div className="row__side text-meta">{side}</div>
      <div className="row__main">{children}</div>
    </div>
  );
}

export default Row;
