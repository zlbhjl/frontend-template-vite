import api from "./api";

export type User = {
	id: string;
	name: string;
};

export const fetchUsers = async (): Promise<User[]> => {
	const { data } = await api.get<User[]>("/users");
	return data;
};
