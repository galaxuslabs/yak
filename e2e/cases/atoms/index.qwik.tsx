import { atoms, styled } from "@yak/qwik";

// utility class names as an atomic CSS framework would emit them
// (the stylesheet below is hand written, no framework in the e2e app)
const Joined = styled.div`
  ${atoms("bg-blue text-white")}
`;

const Separate = styled.div`
  ${atoms("bg-blue", "text-white")}
`;

const Conditional = styled.div<{ $active?: boolean }>`
  ${atoms("bg-blue")}
  ${(props) => props.$active && atoms("text-white")}
`;

const ConditionalAtom = styled.div<{ $active?: boolean; $white?: boolean }>`
  ${({ $active, $white }) => $active && atoms("bg-blue", $white && "text-white")}
`;

export default function App() {
  return (
    <>
      <style>{`
        .bg-blue { background-color: rgb(0, 0, 255); }
        .text-white { color: rgb(255, 255, 255); }
      `}</style>
      <Joined data-testid="joined">joined</Joined>
      <Separate data-testid="separate">separate</Separate>
      <Conditional data-testid="conditional-active" $active>
        active
      </Conditional>
      <Conditional data-testid="conditional-inactive">inactive</Conditional>
      <ConditionalAtom data-testid="conditional-atom-white" $active $white>
        white
      </ConditionalAtom>
      <ConditionalAtom data-testid="conditional-atom-plain" $active>
        plain
      </ConditionalAtom>
    </>
  );
}
