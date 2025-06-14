// machineUtils.ts
export const getStatusColor = (status: string) => {
    switch (status) {
        case "red":
            return "bg-red-500";
        case "green":
            return "bg-green-500";
        case "gray":
            return "bg-gray-400";
        default:
            return "";
    }
};

export const getStatusLabel = (status: string) => {
    switch (status) {
        case "red":
            return "稼働中";
        case "green":
            return "待機中";
        case "gray":
            return "故障中";
        default:
            return "";
    }
};

