import { withYak } from "@yak/react/withYak";
const yakOptions = process.env.FOLD === "false" ? { foldStatic: false } : {};
export default withYak(yakOptions, {});
