import {
	type User,
	fetchUsers as fetchUsersFromApi,
} from "@services/userService";
import { create } from "zustand";

interface UserState {
	users: User[];
	loading: boolean;
	error: Error | null;
	fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
	users: [],
	loading: false,
	error: null,
	fetchUsers: async () => {
		set({ loading: true, error: null });
		try {
			const users = await fetchUsersFromApi();
			set({ users, loading: false });
		} catch (e) {
			// `e` は unknown 型。Error 以外はラップして扱う
			const error = e instanceof Error ? e : new Error(String(e));
			set({ error, loading: false });
		}
	},
}));
