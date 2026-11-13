// A JSON file that names the yak package, like a package.json, is not a source file:
// the Vite plugin must leave it to Vite's JSON import instead of parsing it as TSX
import { styled } from "@yak/solid";
import packageInfo from "./package-info.json";

const Name = styled.span`
  color: red;
`;

export default function App() {
  return <Name data-testid="name">{packageInfo.name}</Name>;
}
