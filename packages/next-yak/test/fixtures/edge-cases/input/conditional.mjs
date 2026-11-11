import { withYak } from "next-yak/withYak";
const yakOptions = process.env.FOLD === "false" ? { foldStatic: false } : {};
export default withYak(yakOptions, {});
