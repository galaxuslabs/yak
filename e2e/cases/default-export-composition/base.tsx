import { styled } from "@yak/react";

const Base = styled.div`
  color: red;
`;

// Extends the default export in the same file, so its styles must come after Base's
export const Extended = styled(Base)`
  color: blue;
`;

export default Base;
