import { useMemo, useState, useRef, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    buildingB: [
        { id: 1, type: "洗濯機", status: "green", reserved: false },
        { id: 2, type: "洗濯機", status: "green", reserved: false },
        { id: 3, type: "洗濯機", status: "green" },
        { id: 4, type: "洗濯機", status: "gray", reserved: false },
        { id: 5, type: "乾燥機", status: "green", reserved: false },
        { id: 6, type: "乾燥機", status: "green", reserved: false },
        { id: 7, type: "乾燥機", status: "red" },
        { id: 8, type: "乾燥機", status: "gray", reserved: true },
    ],
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
            const machines = baseMachines.map((m) => ({
                ...m,
                id: m.id + i * 10,
            }));
            return { floor, machines };
        });
    }, [buildingId]);

    const [machinesByFloor, setMachinesByFloor] = useState(initialFloors);
    const [notifiedMachines, setNotifiedMachines] = useState<Set<number>>(new Set());
    const [watchList, setWatchList] = useState<Set<number>>(new Set());
    const prevMachinesByFloorRef = useRef<typeof machinesByFloor | null>(null);
    const reservationTimersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

    // 通知機能のためのuseEffect
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

                const shouldNotify =
                    becameAvailable &&
                    (watchList.has(machine.id) || machine.reserved);

                if (shouldNotify) {
                    const reasons = [];
                    if (watchList.has(machine.id)) reasons.push("通知対象");
                    if (machine.reserved) reasons.push("予約者");

                    alert(`🔔 ${machine.type} #${machine.id} が「待機中」になりました（${reasons.join("・")}）。`);

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
                }
            });
        });

        // ★ 修正点: ここから`prevMachinesByFloorRef`の更新を削除
    }, [machinesByFloor, watchList, notifiedMachines]);

    // 待機中かつ予約中の機械を「指定した分」後に自動で予約解除するuseEffect
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

                    console.log(`[タイマーセット] 機器 #${machine.id} の予約自動解除タイマー（${RESERVATION_TIMEOUT_MINUTES}分）を開始します。`);
                    const timerId = setTimeout(() => {
                        console.log(`[タイマー実行] 機器 #${machine.id} は${RESERVATION_TIMEOUT_MINUTES}分間利用されなかったため、予約を自動解除しました。`);
                        handleReserve(floor.floor, machine.id);
                        reservationTimersRef.current.delete(machine.id);
                    }, RESERVATION_TIMEOUT_MINUTES * 60 * 1000);

                    reservationTimersRef.current.set(machine.id, timerId);
                } else if (!isNowWaitingAndReserved && wasWaitingAndReserved) {
                    const existingTimer = reservationTimersRef.current.get(machine.id);
                    if (existingTimer) {
                        console.log(`[タイマー解除] 機器 #${machine.id} の状態が変化したため、予約自動解除タイマーをキャンセルしました。`);
                        clearTimeout(existingTimer);
                        reservationTimersRef.current.delete(machine.id);
                    }
                }
            });
        });
    }, [machinesByFloor]);

    // ★ 修正点: 全てのeffectが実行された後に、次のレンダリングのために「前の状態」を更新する
    useEffect(() => {
        prevMachinesByFloorRef.current = machinesByFloor;
    }, [machinesByFloor]);

    // コンポーネントがアンマウントされる時に全てのタイマーをクリアする
    useEffect(() => {
        return () => {
            reservationTimersRef.current.forEach(timerId => {
                clearTimeout(timerId);
            });
        };
    }, []);


    const handleReserve = (floor: number, machineId: number) => {
        setMachinesByFloor((prevFloors) =>
            prevFloors.map((f) =>
                f.floor === floor
                    ? {
                        ...f,
                        machines: f.machines.map((m) =>
                            m.id === machineId ? { ...m, reserved: !m.reserved } : m
                        ),
                    }
                    : f
            )
        );
    };

    const changeMachineStatus = (
        floor: number,
        machineId: number,
        newStatus: MachineStatus
    ) => {
        setMachinesByFloor((prevFloors) =>
            prevFloors.map((f) =>
                f.floor === floor
                    ? {
                        ...f,
                        machines: f.machines.map((m) => {
                            if (m.id !== machineId) return m;
                            if (m.status === "red" && newStatus === "green") {
                                return {
                                    ...m,
                                    status: newStatus,
                                    lastActiveAt: new Date(),
                                };
                            }
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
            if (newSet.has(machineId)) {
                newSet.delete(machineId);
            } else {
                newSet.add(machineId);
            }
            return newSet;
        });
    };

    const renderMachine = (machine: Machine, floor: number) => (
        <Card
            key={machine.id}
            className="flex flex-col items-center p-4 relative"
        >
            <CardHeader>
                <CardTitle>
                    {machine.type} #{machine.id}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2">
                <div
                    className={`w-12 h-12 rounded-full ${statusColor[machine.status]}`}
                    title={statusLabel[machine.status]}
                />
                <span className="text-sm text-gray-700">
                    {statusLabel[machine.status]}
                </span>

                {machine.status === "green" && machine.lastActiveAt && (
                    <div className="text-xs text-gray-500">
                        最終稼働: {new Date(machine.lastActiveAt).toLocaleString()}
                    </div>
                )}

                {machine.reserved ? (
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReserve(floor, machine.id)}
                    >
                        予約取り消し
                    </Button>
                ) : machine.status !== "gray" ? (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReserve(floor, machine.id)}
                    >
                        予約する
                    </Button>
                ) : null}

                {machine.status !== "gray" && (
                    <Button
                        size="sm"
                        variant={watchList.has(machine.id) ? "destructive" : "outline"}
                        onClick={() => toggleNotify(machine.id)}
                    >
                        {watchList.has(machine.id) ? "通知解除" : "通知する"}
                    </Button>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">
                学生寮 {buildingId} 洗濯機・乾燥機の状況（予約付き）
            </h2>

            <div className="mb-6 flex flex-wrap gap-2">
                {machinesByFloor.map(({ floor }) => (
                    <a
                        key={floor}
                        href={`#floor-${floor}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                        {floor}階へ
                    </a>
                ))}
            </div>

            {machinesByFloor.map(({ floor, machines }) => {
                const dryers = machines.filter((m) => m.type === "乾燥機");
                const washers = machines.filter((m) => m.type === "洗濯機");

                return (
                    <div
                        key={floor}
                        id={`floor-${floor}`}
                        className="mb-12 scroll-mt-24"
                    >
                        <h3 className="text-xl font-semibold mb-4">{floor}階</h3>

                        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {dryers.map((m) => renderMachine(m, floor))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {washers.map((m) => renderMachine(m, floor))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


