"use client";
import InventoryStats from "@/components/inventory/stats/InventoryStats";
import InventoryTable from "@/components/inventory/table/InventoryTable";
import { Package } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

export default function InventoryPage() {
    // const [isLoading, setIsLoading] = useState(false);
    const { data: alerts, isLoading } = useQuery({
        queryKey: ['inventory-alerts'],
        queryFn: async () => {
            const alerts = await api.get('/inventory/alerts');
            return alerts.data;
        }
    })

    const { data: storage } = useQuery({
        queryKey: ['inventory-storage'],
        queryFn: async () => {
            const storage = await api.get('/storage/items');
            return storage.data;
        }
    })


    const inventoryData = alerts || [];
    // console.log("******************************************");
    // console.log(inventoryData);
    // console.log("******************************************");

    const storageData = storage || [];
    // console.log("******************************************");
    // console.log(storageData);
    // console.log("******************************************");




    return (
        <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 pb-20" dir="rtl">
            <PageHeader
                title="المخزون المركزي"
                description="إدارة ومراقبة المخزون الطبي لجميع النقاط والمراكز"
                icon={Package}
                regionName={inventoryData.region}
            />

            {/* Stats Overview */}
            <section>
                <InventoryStats />
            </section>

            {/* Main Inventory Content */}
            <section className="bg-card sm:rounded-3xl sm:border border-border/50 shadow-sm -mx-4 sm:mx-0 overflow-hidden">
                <div className="p-3 sm:p-6">
                    <InventoryTable />
                </div>
            </section>
        </div>
    );
}
