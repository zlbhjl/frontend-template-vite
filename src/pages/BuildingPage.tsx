import { useParams } from "react-router-dom";
import MultiFloorMachineStatus from "@/components/MultiFloorMachineStatus";

export default function BuildingPage() {
    const { buildingId } = useParams();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{buildingId?.toUpperCase()}棟の状況</h1>
            <MultiFloorMachineStatus buildingId={buildingId} />
        </div>
    );
}
