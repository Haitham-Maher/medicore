import DeptStats from "./DeptStats";
import DeptDoctorsList from "./DeptDoctorsList";
import DeptPerformanceChart from "./DeptPerformanceChart";

interface DeptOverviewProps {
    isLoading: boolean;
    stats: any;
    head: any;
    doctors: any[];
    accentColor?: string;
    onViewAllDoctors: () => void;
    weeklyData?: { day: string; visits: number }[];
}

export default function DeptOverview({
    isLoading,
    stats,
    head,
    doctors,
    accentColor,
    onViewAllDoctors,
    weeklyData,
}: DeptOverviewProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Stats */}
            <DeptStats isLoading={isLoading} stats={stats} />

            {/* Side by side: Top Doctors + Performance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DeptDoctorsList
                    variant="top"
                    isLoading={isLoading}
                    doctors={doctors}
                    onViewAll={onViewAllDoctors}
                />
                <DeptPerformanceChart isLoading={isLoading} accentColor={accentColor} weeklyData={weeklyData} />
            </div>
        </div>
    );
}
