import Base, { Extended } from "./base.tsx";

export default function App() {
  return (
    <>
      <Base data-testid="base">Base</Base>
      <Extended data-testid="extended">Extended</Extended>
    </>
  );
}
