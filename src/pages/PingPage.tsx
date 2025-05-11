import { usePingStore } from "@stores/pingStore";
import type React from "react";
import { useEffect } from "react";

const PingPage: React.FC = () => {
	const { message, loading, error, loadPing } = usePingStore();

	useEffect(() => {
		loadPing();
	}, [loadPing]);

	if (loading) return <p>ロード中…</p>;
	if (error) return <p>エラーが発生しました: {error.message}</p>;

	return (
		<div>
			<h1>Ping</h1>
			<p>サーバーからの応答: {message}</p>
		</div>
	);
};

export default PingPage;
