import type { RawDirectiveProps } from "@figtive/garden-engine";

function GiganticText({ text }: RawDirectiveProps) {
  return <h1 style={{ fontSize: "10rem" }}>{text}</h1>;
}

export default GiganticText;
