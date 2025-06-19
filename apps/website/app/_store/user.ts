// // src/store/userStore.ts
// import { create } from "zustand";
// type IUser = {
//   name: string;
//   email: string;
//   avatar: string;
// };

// interface BearState {
//   user: IUser | null | undefined;
//   setUser: (user: IUser | null | undefined) => void;
//   updateUser: (user: Partial<IUser>) => void;
//   loading: boolean;
//   setLoading: (loading: boolean) => void;
// }

// export const useUserStore = create<BearState>((set, get) => ({
//   user: null,
//   isLogin: false,
//   setUser: (user) => {
//     if (user) {
//       set({ user: user });
//       return;
//     }
//     set({ user: null });
//   },
//   // 更新user中的部分字段
//   updateUser: (user) => {
//     const oldUser = get().user;
//     if (!oldUser) return;
//     const newUser = { ...oldUser, ...user };
//     set({ user: newUser });
//   },
//   loading: true,
//   setLoading: (loading) => set({ loading }),
// }));
