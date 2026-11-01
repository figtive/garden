import { ClientScript } from "@figtive/garden-engine";
import Preview from "../Preview/Preview.tsx";
import hoverPreviewScript from "./HoverPreview.client.ts";

function HoverPreview() {
  return (
    <>
      <ClientScript src={hoverPreviewScript} />
      <div className="hover-preview" popover="manual" aria-hidden="true">
        <Preview className="hover-preview__body" />
      </div>
    </>
  );
}

export default HoverPreview;
