import { css, styled, YakThemeProvider } from "@yak/react";
import { useState } from "react";

type Theme = { brandName: "brandA" | "brandB" };

const Panel = styled.div.attrs(({ theme }) => ({
  title: (theme as Theme).brandName,
}))`
  ${({ theme }) =>
    (theme as Theme).brandName === "brandA"
      ? css`
          color: red;
        `
      : css`
          color: blue;
        `}
`;

// A themed component without attrs: no attrs function runs, so only the style
// function reads the theme
const Label = styled.span<{ theme?: Theme }>`
  ${({ theme }) =>
    (theme as Theme).brandName === "brandA"
      ? css`
          color: red;
        `
      : css`
          color: blue;
        `}
`;

// A constant of the module with the name `theme`: the first condition reads
// the yak theme, the second one reads this constant
const theme: Theme = { brandName: "brandB" };

const Badge = styled.span<{ $on?: boolean }>`
  ${({ theme: yakTheme }) =>
    (yakTheme as Theme).brandName === "brandA" &&
    css`
      color: red;
    `}
  ${(props) =>
    props.$on &&
    theme.brandName === "brandB" &&
    css`
      text-decoration: underline;
    `}
`;

export default function App() {
  const [theme, setTheme] = useState<Theme>({ brandName: "brandA" });
  return (
    <YakThemeProvider theme={theme}>
      <button
        data-testid="toggle-brand"
        onClick={() =>
          setTheme((current) => ({
            brandName: current.brandName === "brandA" ? "brandB" : "brandA",
          }))
        }
      >
        Switch brand
      </button>
      <Panel data-testid="panel">Themed</Panel>
      <Label data-testid="label">Theme from the provider</Label>
      <Label data-testid="label-theme-prop" theme={{ brandName: "brandB" }}>
        Theme from the prop
      </Label>
      <Badge data-testid="badge" $on>
        Theme and a constant with the same name
      </Badge>
    </YakThemeProvider>
  );
}
