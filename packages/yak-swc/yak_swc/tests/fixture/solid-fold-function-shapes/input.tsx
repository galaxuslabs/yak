// The Solid twin of styled-jsx-fold-function-shapes: the same components fold
// into a `class` attribute, which the Solid compiler keeps reactive.
import { atoms, css, styled } from "@yak/solid";

declare const f: () => "s" | "m" | "l";
declare const props: { variant: "s" | "m" | "l"; on: boolean };

const Center = styled.div<{
  $foo?: number;
  $on?: boolean;
  $variant?: "s" | "m" | "l";
}>`
  display: flex;
  ${({ $variant, $on }) => $variant && $on && css`background: black;`}
  ${({ $variant }) => {
    switch ($variant) {
      case "m":
        return css`color: red`;
      case "l":
        return css`color: purple`;
      default:
        return css`color: blue`;
    }
  }}
  ${({ $foo }) =>
    !!$foo &&
    css`
      &:hover {
        ${({ $variant }) => $variant && css`background: black`}
      }
    `}
`;

// the `atoms` call joins its class names next to the condition
const Atoms = styled.span<{ $wide?: boolean }>`
  ${atoms("flex", "gap-2")}
  ${({ $wide }) => $wide && css`width: 100%;`}
`;

// bails: the runtime passes the theme, which is unknown at build time
const Themed = styled.div<{ $on?: boolean }>`
  ${({ theme, $on }) => theme.dark && $on && css`color: white;`}
`;

export const Usages = ({ v, $variant }: { v: "s" | "m" | "l"; $variant: number }) => (
  <>
    {/* absent props are `void 0` */}
    <Center>no props</Center>
    {/* a bare attribute is `true`, literals inline */}
    <Center $variant="m" $on $foo={2}>
      literal props
    </Center>
    {/* an identifier inlines at every read */}
    <Center $variant={v} $on>
      dynamic identifier
    </Center>
    {/* a member read inlines at every read */}
    <Center $variant={props.variant} $on={props.on}>
      member read
    </Center>
    {/* a call runs once: it is bound and every read uses the parameter */}
    <Center $variant={f()} $on>
      call value
    </Center>
    {/* the bound parameter is `__yak_$variant`, so the user `$variant` in the
        other attribute stays the user variable */}
    <Center $variant={f()} $foo={$variant}>
      user variable of the prop name
    </Center>
    <Atoms $wide>atoms</Atoms>
    <Themed $on>bails: theme</Themed>
  </>
);

// a bound non-$ prop needs the element-wrap shape, which would freeze the
// value in Solid: the usage keeps the runtime component
const Row = styled.div<{ disabled?: boolean }>`
  ${({ disabled }) => {
    switch (disabled) {
      case true:
        return css`opacity: 0.5;`;
      default:
        return css`opacity: 1;`;
    }
  }}
`;
declare const busy: () => boolean;
export const Wrapped = () => <Row disabled={busy()} />;
