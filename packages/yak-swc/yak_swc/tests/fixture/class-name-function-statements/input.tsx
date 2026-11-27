import { styled, css } from "@yak/react";
import { assertNever, log, getLogger } from "./helpers";

type Size = "s" | "m";

export const SwitchAssertNever = styled.div<{ $size: Size }>`
  ${({ $size }) => {
    switch ($size) {
      case "s":
        return css`padding: 2px;`;
      case "m":
        return css`padding: 4px;`;
      default:
        assertNever($size);
    }
  }}
`;

export const SwitchAssertNeverBreak = styled.div<{ $size: Size }>`
  ${({ $size }) => {
    switch ($size) {
      case "s":
        return css`padding: 2px;`;
      default:
        assertNever($size);
        break;
    }
  }}
`;

export const SwitchSatisfiesNever = styled.div<{ $size: Size }>`
  ${({ $size }) => {
    switch ($size) {
      case "s":
        return css`padding: 2px;`;
      case "m":
        return css`padding: 4px;`;
      default:
        $size satisfies never;
    }
  }}
`;

export const SwitchRenamedDefault = styled.div<{ $size?: Size }>`
  ${({ $size: size = "m" }) => {
    switch (size) {
      case "s":
        return css`padding: 2px;`;
      case "m":
        return css`padding: 4px;`;
      default:
        assertNever(size);
    }
  }}
`;

export const SwitchMemberRead = styled.div<{ $size: Size }>`
  ${(p) => {
    switch (p.$size) {
      case "s":
        return css`padding: 2px;`;
      case "m":
        return css`padding: 4px;`;
      default:
        console.log(p.$size);
    }
  }}
`;

export const CaseLogBeforeReturn = styled.div<{ $size: Size }>`
  ${({ $size }) => {
    switch ($size) {
      case "s":
        log($size);
        return css`padding: 2px;`;
      default:
        return css`padding: 4px;`;
    }
  }}
`;

// the last case runs out of the `switch` into the `return` after it
export const LastCaseWithoutReturn = styled.div<{ $size: Size }>`
  ${({ $size }) => {
    switch ($size) {
      case "s":
        return css`padding: 2px;`;
      case "m":
        log($size);
    }
    return css`padding: 8px;`;
  }}
`;

export const DefaultWithoutReturnThenReturn = styled.div<{ $size: Size }>`
  ${({ $size }) => {
    switch ($size) {
      case "s":
        return css`padding: 2px;`;
      default:
        log($size);
    }
    return css`padding: 8px;`;
  }}
`;

export const LogBeforeIf = styled.div<{ $on: boolean }>`
  ${({ $on }) => {
    console.log($on);
    if ($on) {
      return css`color: red;`;
    }
  }}
`;

export const StatementsBeforeReturn = styled.div<{ $on: boolean; $a: number; $b: number }>`
  ${({ $on, $a, $b }) => {
    if ($on) {
      log($a);
      log($b);
      return css`color: red;`;
    }
    return null;
  }}
`;

export const IfWithoutReturn = styled.div<{ $on: boolean }>`
  ${({ $on }) => {
    if ($on) {
      log($on);
    }
    return css`color: red;`;
  }}
`;

export const StatementAtEnd = styled.div<{ $on: boolean }>`
  ${({ $on }) => {
    if ($on) return css`color: red;`;
    log($on);
  }}
`;

export const CssVariable = styled.div<{ $width: number }>`
  width: ${({ $width }) => {
    log($width);
    return $width;
  }}px;
`;

// stays unfolded: a returned call can return a css literal
export const ReturnAssertNever = styled.div<{ $size: Size }>`
  ${({ $size }) => {
    switch ($size) {
      case "s":
        return css`padding: 2px;`;
      default:
        return assertNever($size);
    }
  }}
`;

// stays unfolded: the first case runs into the next one
export const FallThroughAfterStatement = styled.div<{ $size: Size }>`
  ${({ $size }) => {
    switch ($size) {
      case "s":
        log($size);
      case "m":
        return css`padding: 4px;`;
    }
  }}
`;

// stays unfolded: a `break` before the last case
export const BreakBeforeLastCase = styled.div<{ $size: Size }>`
  ${({ $size }) => {
    switch ($size) {
      case "s":
        log($size);
        break;
      case "m":
        return css`padding: 4px;`;
    }
  }}
`;

// at a CSS value position the last case can end without `return`
export const LastCaseThenStatements = styled.div<{ $size: Size }>`
  ${({ $size }) => $size === "s" && css`padding: 2px;`}
  width: ${({ $size }) => {
    switch ($size) {
      case "s":
        return 2;
      default:
        log($size);
    }
    log($size);
    return 8;
  }}px;
`;

// at a CSS value position the `if` can end without `return`
export const IfWithoutReturnThenStatements = styled.div<{ $on: boolean }>`
  width: ${({ $on }) => {
    if ($on) {
      log($on);
    }
    log($on);
    return 8;
  }}px;
`;

// stays unfolded: a statement after a `return`
export const StatementAfterReturn = styled.div<{ $on: boolean }>`
  ${({ $on }) => {
    return $on && css`color: red;`;
    log($on);
  }}
`;

// stays unfolded: a write to a prop
export const AssignProp = styled.div<{ $size?: Size }>`
  ${({ $size }) => {
    $size = $size ?? "m";
    return $size === "s" && css`padding: 2px;`;
  }}
`;

// stays unfolded: a write to a prop
export const UpdateProp = styled.div<{ $count: number }>`
  ${({ $count }) => {
    $count++;
    return $count > 2 && css`padding: 2px;`;
  }}
`;

// stays unfolded: a write to a prop inside an argument
export const AssignInArgument = styled.div<{ $size?: Size }>`
  ${({ $size }) => {
    log(($size = "m"));
    return $size === "s" && css`padding: 2px;`;
  }}
`;

// stays unfolded: `onRender` runs with the props as `this`
export const MethodOnProps = styled.div<{ $on: boolean; onRender: () => void }>`
  ${(p) => {
    p.onRender();
    return p.$on && css`color: red;`;
  }}
`;

// stays unfolded: the callee is a call, not a plain read
export const CallOnCall = styled.div<{ $on: boolean }>`
  ${({ $on }) => {
    getLogger().log($on);
    return $on && css`color: red;`;
  }}
`;
