import React from 'react';

interface Props {
    isOpen: boolean;
    message: string;
    onClose: () => void;
}

// シンプルな通知UIコンポーネント
export default function ControllableNotification({ isOpen, message, onClose }: Props) {
    if (!isOpen) {
        return null; // isOpenがfalseなら何も表示しない
    }

    return (
        // 画面右上に固定表示するスタイル
        <div className="fixed top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200 animate-fade-in-down">
            <div className="flex items-start gap-4">
                <div className="text-lg">🔔</div>
                <div className="flex-1">
                    <p className="font-bold">通知</p>
                    <p className="text-gray-700">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-700"
                    aria-label="閉じる"
                >
                    &times; {/* HTMLエンティティの乗算記号 */}
                </button>
            </div>
        </div>
    );
}