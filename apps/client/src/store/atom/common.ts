import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
// import { getList } from "../../api/post";
export const sideBarOpenedAtom = atom(true);
// export const postAtom = atomWithQuery(() => ({
//   queryKey: ["post"],
//   queryFn: async ({ queryKey: [,] }) => {
//     const res = await getList();
//     return res;
//   },
// }));
