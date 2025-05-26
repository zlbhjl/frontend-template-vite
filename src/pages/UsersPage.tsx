import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";

export default function UsersPage() {
	const users = useUserStore((s) => s.users);
	const fetchUsers = useUserStore((s) => s.fetchUsers);
	const loading = useUserStore((s) => s.loading);
	const error = useUserStore((s) => s.error);

	useEffect(() => {
		fetchUsers().catch(console.error);
	}, [fetchUsers]);

	if (loading) return <p>ロード中...</p>;
	if (error) return <p>エラーが発生しました: {error.message}</p>;

	return (
		<div>
			<h1 className="text-2xl font-semibold mb-4">ユーザー一覧</h1>
			<ul className="space-y-2">
				{users.map((u) => (
					<li key={u.id} className="p-4 border rounded-md">
						<p className="font-medium">UserName: {u.name}</p>
						<p className="text-sm text-gray-600">ID: {u.id}</p>
					</li>
				))}
			</ul>
		</div>
	);
}
