import { styled } from "@yak/react";
import { colors } from "e2e-installed-tokens";
import { colors as colorsSubpath } from "e2e-installed-tokens/colors";
import { colors as excluded } from "e2e-installed-tokens-excluded";
import { colors as excludedSubpath } from "e2e-installed-tokens-excluded/colors";
import { radius } from "e2e-installed-tokens-excluded/radius";
import { sizes } from "e2e-installed-tokens/tokens.yak.js";
import { Box } from "e2e-installed-tokens-excluded/box-react";
import { Card } from "e2e-installed-tokens-excluded/card-react";

// In vite dev, e2e-installed-tokens resolves to its pre-bundled copy in
// .vite/deps. The Vite configs exclude e2e-installed-tokens-excluded, so it
// resolves to its own files in node_modules.

const PreBundled = styled.div`
  color: ${colors.entry};
`;

const PreBundledSubpath = styled.div`
  color: ${colorsSubpath.subpath};
`;

const Excluded = styled.div`
  color: ${excluded.entry};
`;

const ExcludedSubpath = styled.div`
  color: ${excludedSubpath.subpath};
`;

const TypeScriptToken = styled.div`
  border-radius: ${radius.small};
`;

const YakFile = styled.div`
  border: ${sizes.border} solid;
`;

export default function App() {
  return (
    <>
      <PreBundled data-testid="pre-bundled">Purple</PreBundled>
      <PreBundledSubpath data-testid="pre-bundled-subpath">Orange</PreBundledSubpath>
      <Excluded data-testid="excluded">Teal</Excluded>
      <ExcludedSubpath data-testid="excluded-subpath">Navy</ExcludedSubpath>
      <TypeScriptToken data-testid="ts-token">Rounded</TypeScriptToken>
      <YakFile data-testid="yak-file">4px border</YakFile>
      <Box data-testid="box">Teal with a purple border</Box>
      <Card>Rounded corners</Card>
    </>
  );
}
