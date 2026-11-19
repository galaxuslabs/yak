import { component$, useContextProvider, useStore } from "@qwik.dev/core";
import { css, styled, YakThemeContext } from "@yak/qwik";

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
const Label = styled.span`
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

// the app provides the theme from component$ code: the package ships no
// provider component
export default component$(() => {
  const theme = useStore<Theme>({ brandName: "brandA" });
  useContextProvider(YakThemeContext, theme);
  return (
    <>
      <button
        data-testid="toggle-brand"
        onClick$={() => (theme.brandName = theme.brandName === "brandA" ? "brandB" : "brandA")}
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
    </>
  );
});
