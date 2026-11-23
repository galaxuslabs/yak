/** @jsxImportSource @yak/react */
import { useState } from "react";
import { css, styled } from "@yak/react";

// folds to a plain div
const Card = styled.div`
  color: rgb(0, 128, 0);
`;

// folds to <Card className="...">
const Extended = styled(Card)`
  background-color: rgb(255, 255, 0);
`;

// three-level chain - every level's style applies with foldStatic on and off
const Button = styled.button`
  color: rgb(0, 0, 139);
`;
const PrimaryButton = styled(Button)`
  background-color: rgb(173, 216, 230);
`;
const FullWidthButton = styled(PrimaryButton)`
  border-color: rgb(255, 20, 147);
`;

// class-toggling $prop - foldable usages inline the condition
const Toggle = styled.span<{ $active?: boolean }>`
  color: rgb(0, 0, 255);
  ${({ $active }) =>
    $active &&
    css`
      color: rgb(255, 0, 0);
    `}
`;

// ternary mixin
const Tone = styled.p<{ $variant?: string }>`
  ${({ $variant }) =>
    $variant === "primary"
      ? css`
          color: rgb(128, 0, 128);
        `
      : css`
          color: rgb(255, 165, 0);
        `}
`;

// string comparison against an attribute that JSX spells with an HTML entity -
// the fold must compare the decoded value, not the source text
const Category = styled.li<{ $label?: string }>`
  color: rgb(105, 105, 105);
  ${({ $label }) =>
    $label === "Food & Drink" &&
    css`
      color: rgb(220, 20, 60);
    `}
`;

// backslashes in JSX attribute strings are literal characters, not JS escapes
const Shortcut = styled.kbd<{ $keys?: string }>`
  color: rgb(105, 105, 105);
  ${({ $keys }) =>
    $keys === "a\\tb" &&
    css`
      color: rgb(30, 144, 255);
    `}
`;

// non-$ prop: stays on the element and toggles classes
const ActionButton = styled.button<{ disabled?: boolean }>`
  color: rgb(0, 0, 0);
  ${({ disabled }) =>
    !disabled &&
    css`
      color: rgb(0, 128, 128);
    `}
`;

// default values in the destructuring
const Aligned = styled.p<{ $align?: "start" | "end" }>`
  ${({ $align = "start" }) =>
    $align === "start"
      ? css`
          text-align: start;
        `
      : css`
          text-align: end;
        `}
`;
const Sized = styled.div<{ $size?: number }>`
  width: ${({ $size = 32 }) => $size}px;
`;

// a condition and a pick between two css constants inside a nested css literal
const spacingSmall = css`
  letter-spacing: 1px;
`;
const spacingLarge = css`
  letter-spacing: 3px;
`;
const Nested = styled.p<{ $on?: boolean; $big?: boolean }>`
  ${({ $on, $big }) =>
    $on &&
    css`
      color: rgb(72, 61, 139);
      ${
        $big &&
        css`
          text-indent: 5px;
        `
      }
      ${$big ? spacingLarge : spacingSmall}
    `}
`;

// a switch that ends with an exhaustive check as a statement
type Density = "compact" | "roomy";
function assertNever(value: never): never {
  throw new Error(`Unknown density: ${String(value)}`);
}
const Dense = styled.p<{ $density: Density }>`
  ${({ $density }) => {
    switch ($density) {
      case "compact":
        return css`
          line-height: 10px;
        `;
      case "roomy":
        return css`
          line-height: 30px;
        `;
      default:
        assertNever($density);
    }
  }}
`;

// a short name for a read of a nested prop with an optional member
type Placement = { medium?: { size: "s" | "m" } };
const Placed = styled.p<{ $placement: Placement }>`
  ${({ $placement }) => {
    const size = $placement.medium?.size;
    if (size === "s") {
      return css`
        word-spacing: 2px;
      `;
    }
    return css`
      word-spacing: 6px;
    `;
  }}
`;

// a guard block whose paths return or go on with the next statement
const Guarded = styled.p<{ $size: "s" | "l"; $n: number }>`
  ${({ $size, $n }) => {
    if ($size === "l") {
      if ($n >= 12) {
        return css`
          padding-left: 12px;
        `;
      }
      if ($n === 0) return;
    }
    if ($n >= 6) {
      return css`
        padding-left: 6px;
      `;
    }
    return css`
      padding-left: 1px;
    `;
  }}
`;

export default function App() {
  const [active, setActive] = useState(false);
  const spreadProps = { $active: true };
  return (
    <>
      <Card data-testid="static">static fold</Card>
      <Extended data-testid="extended">static styled(Component) fold</Extended>
      <FullWidthButton data-testid="chain">three-level chain</FullWidthButton>
      <Toggle data-testid="toggle-on" $active>
        on
      </Toggle>
      <Toggle data-testid="toggle-off">off</Toggle>
      <Toggle data-testid="toggle-state" $active={active}>
        state driven
      </Toggle>
      <button data-testid="activate" onClick={() => setActive(true)}>
        activate
      </button>
      {/* spread props keep the runtime path - must render like the folded twin */}
      <Toggle data-testid="toggle-runtime" {...spreadProps}>
        runtime path
      </Toggle>
      <Toggle
        data-testid="merged"
        $active
        css={css`
          text-decoration-line: underline;
        `}
      >
        css prop merge
      </Toggle>
      <Tone data-testid="tone-primary" $variant="primary">
        primary
      </Tone>
      <Tone data-testid="tone-default">default</Tone>
      <ActionButton data-testid="enabled">enabled</ActionButton>
      <ActionButton data-testid="disabled" disabled>
        disabled
      </ActionButton>
      <Aligned data-testid="default-start">default start</Aligned>
      <Aligned data-testid="default-end" {...{ $align: "end" as const }}>
        end
      </Aligned>
      <Sized data-testid="default-size">default size</Sized>
      <Sized data-testid="default-size-set" {...{ $size: 48 }}>
        size 48
      </Sized>
      <Nested data-testid="nested-big" {...{ $on: true, $big: true }}>
        nested big
      </Nested>
      <Nested data-testid="nested-small" {...{ $on: true }}>
        nested small
      </Nested>
      <Nested data-testid="nested-off">nested off</Nested>
      <Dense data-testid="density-compact" $density="compact">
        compact
      </Dense>
      <Dense data-testid="density-roomy" {...{ $density: "roomy" as const }}>
        roomy
      </Dense>
      <Placed data-testid="placed-small" $placement={{ medium: { size: "s" } }}>
        placed small
      </Placed>
      <Placed data-testid="placed-missing" $placement={{}}>
        placed missing
      </Placed>
      <Guarded data-testid="guarded-return" $size="l" $n={12}>
        guarded return
      </Guarded>
      <Guarded data-testid="guarded-fall-through" $size="l" $n={7}>
        guarded fall through
      </Guarded>
      <Guarded data-testid="guarded-nothing" $size="l" $n={0}>
        guarded nothing
      </Guarded>
      {/* entity spelling decodes to "Food & Drink" - must match like the runtime twin below */}
      <Category data-testid="entity" $label="Food &amp; Drink">
        Food &amp; Drink
      </Category>
      <Category data-testid="entity-runtime" {...{ $label: "Food & Drink" }}>
        runtime twin
      </Category>
      {/* the attribute value is the four characters a \ t b - not a tab */}
      <Shortcut data-testid="backslash" $keys="a\tb">
        a\tb
      </Shortcut>
      {/* a static merge with a backslash escape in the user className - the
          folded class attribute must read the same as the runtime twin below */}
      <Card data-testid="escape" className="mark before:content-['\d7']">
        escape merge
      </Card>
      <Card data-testid="escape-runtime" {...{ className: "mark before:content-['\\d7']" }}>
        runtime twin
      </Card>
      {/* an emoji className must reach the DOM byte-exact, matching its twin */}
      <Card data-testid="emoji" className="🔥 mark">
        emoji merge
      </Card>
      <Card data-testid="emoji-runtime" {...{ className: "🔥 mark" }}>
        runtime twin
      </Card>
    </>
  );
}
