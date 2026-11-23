import { styled, css } from "@yak/react";
import { calc, log, SIZES } from "./helpers";

type Size = "s" | "m" | "l";
type Layout = { medium?: { visualSize: Size; width: number } };

export const LayoutPosition = styled.div<{ $layoutPosition: Layout; $totalCount: number }>`
  ${({ $layoutPosition, $totalCount }) => {
    const visualSize = $layoutPosition.medium?.visualSize;
    if (visualSize === "s") return css`padding: 2px;`;
    if (visualSize === "m") return css`padding: 4px;`;
    return css`padding: 8px;`;
  }}
`;

export const MemberParam = styled.div<{ $layout: Layout }>`
  ${(props) => {
    const size = props.$layout.medium!.visualSize as Size;
    switch (size) {
      case "s":
        return css`padding: 2px;`;
      default:
        return css`padding: 4px;`;
    }
  }}
`;

export const RenamedWithDefault = styled.div<{ $size?: Size }>`
  ${({ $size: size = "m" }) => {
    const current = size;
    return current === "s" && css`padding: 2px;`;
  }}
`;

export const SeveralDeclarators = styled.div<{ $a: boolean; $layout: Layout }>`
  ${({ $a, $layout }) => {
    const on = $a,
      medium = $layout.medium;
    return on && medium && css`color: red;`;
  }}
`;

// a const that reads an earlier const
export const ConstOfConst = styled.div<{ $layout: Layout }>`
  ${({ $layout }) => {
    const medium = $layout.medium;
    const size = medium?.visualSize;
    const twice = size;
    return twice === "l" && css`padding: 8px;`;
  }}
`;

// `medium.visualSize` throws for a missing `medium`, so it keeps the parens
export const MemberOfOptionalConst = styled.div<{ $layout: Layout }>`
  ${({ $layout }) => {
    const medium = $layout?.medium;
    return medium.visualSize === "s" && css`padding: 2px;`;
  }}
`;

export const LiteralConst = styled.div<{ $count: number }>`
  ${({ $count }) => {
    const limit = 2;
    return $count > limit && css`color: red;`;
  }}
`;

// the same name in two blocks is two bindings
export const SameNameInTwoBlocks = styled.div<{ $on: boolean; $a: Layout; $b: Layout }>`
  ${({ $on, $a, $b }) => {
    if ($on) {
      const size = $a.medium?.visualSize;
      return size === "s" && css`padding: 2px;`;
    } else {
      const size = $b.medium?.visualSize;
      return size === "s" && css`padding: 4px;`;
    }
  }}
`;

// the same name in two functions of one component is two bindings
export const SameNameInTwoFunctions = styled.div<{ $a: Layout; $b: Layout }>`
  ${({ $a }) => {
    const size = $a.medium?.visualSize;
    return size === "s" && css`padding: 2px;`;
  }}
  ${({ $b }) => {
    const size = $b.medium?.visualSize;
    return size === "s" && css`margin: 2px;`;
  }}
`;

export const ConstInCase = styled.div<{ $kind: "a" | "b"; $layout: Layout }>`
  ${({ $kind, $layout }) => {
    switch ($kind) {
      case "a": {
        const size = $layout.medium?.visualSize;
        return size === "s" && css`padding: 2px;`;
      }
      case "b":
        const width = $layout.medium?.width;
        return width === 1 && css`padding: 4px;`;
    }
  }}
`;

// reads in a nested css literal, a nested arrow, a call statement and a case value
export const ReadsEverywhere = styled.div<{ $layout: Layout; $on: boolean; $kind: Size }>`
  ${({ $layout, $kind }) => {
    const size = $layout.medium?.visualSize;
    log(size, { size });
    switch ($kind) {
      case size:
        return css`
          color: red;
          ${({ $on }) => $on && size === "m" && css`color: blue;`}
        `;
    }
  }}
`;

// the parameter `size` of the nested arrow is another binding than the const
export const ShadowingParameter = styled.div<{ $layout: Layout; size: Size }>`
  ${({ $layout }) => {
    const size = $layout.medium?.visualSize;
    return (
      size === "s" &&
      css`
        ${({ size }) => size === "m" && css`color: blue;`}
      `
    );
  }}
`;

export const CssValue = styled.div<{ $layout: Layout }>`
  width: ${({ $layout }) => {
    const width = $layout.medium?.width;
    return width;
  }}px;
`;

// a module constant as initializer
export const ModuleConstant = styled.div<{ $size: number }>`
  ${({ $size }) => {
    const small = SIZES.small;
    return $size === small && css`padding: 2px;`;
  }}
`;

// stays unfolded: `let` could change between two reads
export const LetBinding = styled.div<{ $layout: Layout }>`
  ${({ $layout }) => {
    let size = $layout.medium?.visualSize;
    return size === "s" && css`padding: 2px;`;
  }}
`;

// stays unfolded: `var` could change between two reads
export const VarBinding = styled.div<{ $layout: Layout }>`
  ${({ $layout }) => {
    var size = $layout.medium?.visualSize;
    return size === "s" && css`padding: 2px;`;
  }}
`;

// stays unfolded: a destructuring
export const Destructuring = styled.div<{ $layout: Layout }>`
  ${({ $layout }) => {
    const { medium } = $layout;
    return medium && css`padding: 2px;`;
  }}
`;

// stays unfolded: a call would run once per read
export const CallInitializer = styled.div<{ $size: number }>`
  ${({ $size }) => {
    const size = calc($size);
    return size > 2 && css`padding: 2px;`;
  }}
`;

// stays unfolded: a calculation
export const CalculatedInitializer = styled.div<{ $size: number }>`
  ${({ $size }) => {
    const big = $size > 2;
    return big && css`padding: 2px;`;
  }}
`;

// stays unfolded: a computed member read
export const ComputedInitializer = styled.div<{ $layout: Layout }>`
  ${({ $layout }) => {
    const medium = $layout["medium"];
    return medium && css`padding: 2px;`;
  }}
`;

// stays unfolded: an optional call
export const OptionalCallInitializer = styled.div<{ $read?: () => Size }>`
  ${({ $read }) => {
    const size = $read?.();
    return size === "s" && css`padding: 2px;`;
  }}
`;

// stays unfolded: the const is called, and `$layout.read()` would run with `$layout` as `this`
export const CalledConst = styled.div<{ $layout: { read: () => boolean } }>`
  ${({ $layout }) => {
    const read = $layout.read;
    return read() && css`padding: 2px;`;
  }}
`;

// stays unfolded: a write to a const throws
export const WriteToConst = styled.div<{ $on: boolean }>`
  ${({ $on }) => {
    const on = $on;
    log((on = false));
    return on && css`padding: 2px;`;
  }}
`;

// stays unfolded: the `if` reads `size` before its declaration and throws
export const ReadBeforeDeclaration = styled.div<{ $layout: Layout }>`
  ${({ $layout }) => {
    if (size === "s") return css`padding: 2px;`;
    const size = $layout.medium?.visualSize;
    return css`padding: 4px;`;
  }}
`;

// stays unfolded: the initializer reads the name it declares
export const SelfReference = styled.div<{ $layout: Layout }>`
  ${({ $layout }) => {
    const medium = medium.medium;
    return medium && css`padding: 2px;`;
  }}
`;

// stays unfolded: the first declarator reads the second one before its declaration
export const ReadOfLaterDeclarator = styled.div<{ $layout: Layout }>`
  ${({ $layout }) => {
    const size = medium.visualSize,
      medium = $layout.medium;
    return size === "s" && css`padding: 2px;`;
  }}
`;

// stays unfolded: case "m" reads the `size` of case "s" before its declaration
export const ConstOfOtherCase = styled.div<{ $kind: Size; $layout: Layout }>`
  ${({ $kind, $layout }) => {
    switch ($kind) {
      case "s":
        const size = $layout.medium?.visualSize;
        return size === "s" && css`padding: 2px;`;
      case "m":
        return size === "m" && css`padding: 4px;`;
    }
  }}
`;

// stays unfolded: a `const` after a `return`
export const ConstAfterReturn = styled.div<{ $on: boolean }>`
  ${({ $on }) => {
    return $on && css`padding: 2px;`;
    const unused = $on;
  }}
`;
