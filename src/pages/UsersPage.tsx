import { useUserStore } from "@stores/userStore";
import { type FC, useEffect } from "react";

const UsersPage: FC = () => {
	const users = useUserStore((s) => s.users);
	const fetchUsers = useUserStore((s) => s.fetchUsers);

	useEffect(() => {
		fetchUsers().catch(console.error);
	}, [fetchUsers]);

	return (
		<>
			<h1>ユーザー一覧</h1>

			{users.length === 0 ? (
				<p>ロード中...</p>
			) : (
				<ul>
					{users.map((u) => (
						<li key={u.id}>
							UserName: {u.name}／ID: {u.id}
						</li>
					))}
				</ul>
			)}
		</>
	);
};

export default UsersPage;
