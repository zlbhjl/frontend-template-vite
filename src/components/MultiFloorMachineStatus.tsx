import { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, RefreshCw, Bell } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ControllableNotification from "@/components/ControllableNotification";

type MachineStatus = "red" | "green" | "gray";

interface Machine {
    id: number;
    type: "洗濯機" | "乾燥機";
    status: MachineStatus;
    reserved?: boolean;
    lastActiveAt?: Date;
}

const statusColor = {
    red: "bg-red-500",
    green: "bg-green-500",
    gray: "bg-gray-400",
};

const statusLabel = {
    red: "稼働中",
    green: "待機中",
    gray: "故障中",
};

const buildingMachinesMap: Record<string, Machine[]> = {
    buildingA: [
        { id: 1, type: "洗濯機", status: "green", reserved: false },
        { id: 2, type: "洗濯機", status: "red", reserved: true },
        { id: 3, type: "洗濯機", status: "gray" },
        { id: 4, type: "洗濯機", status: "green", reserved: true },
        { id: 5, type: "乾燥機", status: "gray", reserved: false },
        { id: 6, type: "乾燥機", status: "red", reserved: true },
        { id: 7, type: "乾燥機", status: "green" },
        { id: 8, type: "乾燥機", status: "gray", reserved: true },
    ],
    buildingB: [ /* ... */ ],
    buildingC: [],
};

const RESERVATION_TIMEOUT_MINUTES = 3;

interface Props {
    buildingId: string;
}

export default function MultiFloorMachineStatus({ buildingId }: Props) {
    const initialFloors = useMemo(() => {
        const baseMachines =
            buildingMachinesMap[buildingId] ?? buildingMachinesMap["buildingA"];
        return Array.from({ length: 5 }, (_, i) => {
            const floor = i + 1;
            const machines = baseMachines.map((m) => ({ ...m, id: m.id + i * 10 }));
            return { floor, machines };
        });
    }, [buildingId]);

    const [machinesByFloor, setMachinesByFloor] = useState(initialFloors);
    const [notifiedMachines, setNotifiedMachines] = useState<Set<number>>(new Set());
    const [watchList, setWatchList] = useState<Set<number>>(new Set());
    const prevMachinesByFloorRef = useRef<typeof machinesByFloor | null>(null);
    const reservationTimersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const notificationAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        notificationAudioRef.current = new Audio('/notification.mp3');
        notificationAudioRef.current.loop = true;
    }, []);

    useEffect(() => {
        if (!isNotificationOpen) {
            const audio = notificationAudioRef.current;
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    }, [isNotificationOpen]);

    useEffect(() => {
        const prevFloors = prevMachinesByFloorRef.current;
        if (!prevFloors) return;
        machinesByFloor.forEach(({ machines }, floorIndex) => {
            machines.forEach((machine, idx) => {
                const prevMachine = prevFloors[floorIndex]?.machines[idx];
                if (!prevMachine) return;
                const becameAvailable =
                    prevMachine.status === "red" &&
                    machine.status === "green" &&
                    !notifiedMachines.has(machine.id);

                const isWatched = watchList.has(machine.id);
                const shouldNotify = becameAvailable && (isWatched || machine.reserved);

                if (shouldNotify) {
                    const reasons = [];
                    if (isWatched) reasons.push("通知対象");
                    if (machine.reserved) reasons.push("予約者");

                    setNotificationMessage(
                        `${machine.type} #${machine.id} が「待機中」になりました（${reasons.join("・")}）。`
                    );
                    setIsNotificationOpen(true);
                    notificationAudioRef.current?.play().catch(error => console.error("音声再生に失敗:", error));

                    setNotifiedMachines((prev) => {
                        const newSet = new Set(prev);
                        newSet.add(machine.id);
                        setTimeout(() => {
                            setNotifiedMachines((after) => {
                                const updated = new Set(after);
                                updated.delete(machine.id);
                                return updated;
                            });
                        }, 5 * 60 * 1000);
                        return newSet;
                    });

                    // ★★★ 変更点1: 通知後、watchListから自動で削除する ★★★
                    if (isWatched) {
                        setWatchList((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(machine.id);
                            return newSet;
                        });
                    }
                }
            });
        });
    }, [machinesByFloor, watchList, notifiedMachines]);

    useEffect(() => {
        const prevFloors = prevMachinesByFloorRef.current;
        if (!prevFloors) return;
        machinesByFloor.forEach((floor, floorIndex) => {
            floor.machines.forEach((machine, machineIndex) => {
                const prevMachine = prevFloors[floorIndex]?.machines[machineIndex];
                if (!prevMachine) return;
                const isNowWaitingAndReserved = machine.status === 'green' && machine.reserved;
                const wasWaitingAndReserved = prevMachine.status === 'green' && prevMachine.reserved;
                if (isNowWaitingAndReserved && !wasWaitingAndReserved) {
                    const existingTimer = reservationTimersRef.current.get(machine.id);
                    if (existingTimer) clearTimeout(existingTimer);
                    const timerId = setTimeout(() => {
                        handleReserve(floor.floor, machine.id); // タイムアウトで予約取り消し
                        reservationTimersRef.current.delete(machine.id);
                    }, RESERVATION_TIMEOUT_MINUTES * 60 * 1000);
                    reservationTimersRef.current.set(machine.id, timerId);
                } else if (!isNowWaitingAndReserved && wasWaitingAndReserved) {
                    const existingTimer = reservationTimersRef.current.get(machine.id);
                    if (existingTimer) {
                        clearTimeout(existingTimer);
                        reservationTimersRef.current.delete(machine.id);
                    }
                }
            });
        });
    }, [machinesByFloor]);

    useEffect(() => {
        prevMachinesByFloorRef.current = machinesByFloor;
    }, [machinesByFloor]);

    useEffect(() => {
        return () => {
            reservationTimersRef.current.forEach(timerId => clearTimeout(timerId));
        };
    }, []);

    const handleReserve = (floor: number, machineId: number) => {
        setMachinesByFloor((prevFloors) =>
            prevFloors.map((f) =>
                f.floor === floor
                    ? { ...f, machines: f.machines.map((m) => m.id === machineId ? { ...m, reserved: !m.reserved } : m) }
                    : f
            )
        );
    };

    const changeMachineStatus = (floor: number, machineId: number, newStatus: MachineStatus) => {
        setMachinesByFloor((prevFloors) =>
            prevFloors.map((f) =>
                f.floor === floor
                    ? {
                        ...f,
                        machines: f.machines.map((m) => {
                            if (m.id !== machineId) return m;

                            // ★★★ 変更点2: 状態変更時のロジックを修正 ★★★
                            // 待機中(green) -> 稼働中(red) になるとき、予約を解除する
                            if (m.status === "green" && newStatus === "red") {
                                return { ...m, status: newStatus, reserved: false };
                            }
                            // 稼働中(red) -> 待機中(green) になるとき、最終稼働日時を記録
                            if (m.status === "red" && newStatus === "green") {
                                return { ...m, status: newStatus, lastActiveAt: new Date() };
                            }
                            // その他の状態変化
                            return { ...m, status: newStatus };
                        }),
                    }
                    : f
            )
        );
    };

    const toggleNotify = (machineId: number) => {
        setWatchList((prev) => {
            const newSet = new Set(prev);
            newSet.has(machineId) ? newSet.delete(machineId) : newSet.add(machineId);
            return newSet;
        });
    };

    const handleTest1Click = () => { changeMachineStatus(1, 2, "green"); };
    const handleTest2Click = () => { changeMachineStatus(1, 2, "red"); };
    const handleCloseNotification = () => { setIsNotificationOpen(false); };

    // renderMachine関数とreturn以下のJSXは変更なしのため省略
    const renderMachine = (machine: Machine, floor: number, idx: number) => (
        <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            whileHover={{ scale: 1.03 }}
        >
            <Card key={machine.id} className="flex flex-col items-center p-4 relative bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border-0 h-full transition-shadow duration-300 hover:shadow-2xl">
                <CardHeader>
                    <CardTitle className="font-semibold text-gray-800">{machine.type} #{machine.id}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full ${statusColor[machine.status]}`} title={statusLabel[machine.status]} />
                    <span className="text-sm text-gray-800 font-semibold">{statusLabel[machine.status]}</span>
                    {machine.status === "green" && machine.lastActiveAt && (
                        <div className="text-xs text-gray-500">最終稼働: {new Date(machine.lastActiveAt).toLocaleString()}</div>
                    )}
                    {machine.reserved ? (
                        <Button size="sm" variant="destructive" onClick={() => handleReserve(floor, machine.id)}>予約取り消し</Button>
                    ) : machine.status !== "gray" ? (
                        <Button size="sm" variant="outline" onClick={() => handleReserve(floor, machine.id)}>予約する</Button>
                    ) : null}
                    {machine.status !== "gray" && (
                        <Button size="sm" variant={watchList.has(machine.id) ? "destructive" : "outline"} onClick={() => toggleNotify(machine.id)} className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            {watchList.has(machine.id) ? "通知解除" : "通知する"}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <div className="relative p-4 min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50">
            <ControllableNotification
                isOpen={isNotificationOpen}
                message={notificationMessage}
                onClose={handleCloseNotification}
            />
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button onClick={handleTest1Click} variant="default">テスト1</Button>
                <Button onClick={handleTest2Click} variant="default">テスト2</Button>
            </div>
            <h2 className="text-4xl font-extrabold mb-6 text-indigo-700">学生寮 {buildingId} 洗濯機・乾燥機の状況（予約付き）</h2>
            <div className="mb-6 flex flex-wrap gap-2">
                {machinesByFloor.map(({ floor }) => (
                    <a key={floor} href={`#floor-${floor}`} className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm shadow-md transition-transform transform hover:scale-105">
                        {floor}階へ
                    </a>
                ))}
            </div>
            {machinesByFloor.map(({ floor, machines }) => {
                const washers = machines.filter((m) => m.type === "洗濯機");
                const dryers = machines.filter((m) => m.type === "乾燥機");
                return (
                    <div key={floor} id={`floor-${floor}`} className="mb-12 scroll-mt-24">
                        <h3 className="text-3xl font-bold mb-6 border-b-2 border-pink-200 pb-3 text-pink-600 flex items-center">
                            <Zap className="w-8 h-8 mr-3 text-yellow-400 animate-pulse" />
                            {floor}階
                        </h3>
                        <div className="mb-8">
                            <h4 className="text-lg font-semibold mb-3 text-indigo-600 flex items-center">
                                <RefreshCw className="w-5 h-5 mr-2 text-blue-500 animate-spin" style={{ animationDuration: '3s' }} />
                                洗濯機
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {washers.length > 0 ? washers.map((m, idx) => renderMachine(m, floor, idx)) : <p className="text-gray-500 col-span-full">設置されていません</p>}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-3 text-indigo-600 flex items-center">
                                <Zap className="w-5 h-5 mr-2 text-red-500" />
                                乾燥機
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {dryers.length > 0 ? dryers.map((m, idx) => renderMachine(m, floor, washers.length + idx)) : <p className="text-gray-500 col-span-full">設置されていません</p>}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


