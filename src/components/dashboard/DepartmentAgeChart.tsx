"use client";
import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList
} from "recharts";
import ChartsSkeleton from "./skeletons/ChartsSkeleton";

export default function DepartmentAgeChart() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // جلب البيانات من الـ API الخاص برئيس القسم
    const { data: response, isLoading } = useQuery({
        queryKey: ["department-age-distribution"],
        queryFn: async () => {
            const res = await api.get("/department-head/age-distribution");
            return res.data;
        }
    });

    if (isLoading) {
        return <ChartsSkeleton />;
    }

    // استخراج البيانات من الرد الجديد
    const departmentName = response?.data?.department_name || "";
    const totalPatients = response?.data?.total_patients || 0;
    const rawData = response?.data?.age_distribution;

    // تحويل البيانات من Object إلى Array ليناسب Recharts
    const formattedData = rawData ? [
        { name: "0-17 (أطفال/يافعين)", count: rawData["0-17"] || 0, color: "#14b8a6" }, // Teal
        { name: "18-30 (شباب)", count: rawData["18-30"] || 0, color: "#3b82f6" },       // Blue
        { name: "31-45 (بالغين)", count: rawData["31-45"] || 0, color: "#8b5cf6" },     // Violet
        { name: "46-60 (منتصف العمر)", count: rawData["46-60"] || 0, color: "#f59e0b" },// Amber
        { name: "60+ (كبار السن)", count: rawData["60+"] || 0, color: "#ef4444" }       // Red
    ] : [];

    return (
        <div className="bg-card p-4 md:p-6 rounded-2xl border border-border shadow-sm h-full flex flex-col">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-foreground">
                        التوزيع العمري لمرضى القسم
                        {departmentName && <span className="text-muted-foreground font-normal text-sm mr-2">({departmentName})</span>}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        إجمالي عدد المرضى: <span className="font-bold text-foreground">{totalPatients}</span>
                    </p>
                </div>
            </div>

            <div className="h-[300px] md:h-[350px] w-full mt-auto" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={formattedData}
                        margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                        barSize={isMobile ? 30 : 50}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                        
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: "hsl(var(--foreground))", fontSize: isMobile ? 9 : 11, fontWeight: "600" }} 
                            dy={10} 
                        />
                        
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: "500" }} 
                            width={40} 
                        />
                        
                        <Tooltip 
                            cursor={{ fill: "hsl(var(--muted)/0.1)" }}
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                borderRadius: "12px",
                                border: "1px solid hsl(var(--border))",
                                padding: "8px 12px",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                textAlign: "right"
                            }}
                            formatter={(value) => [`${value} مريض`, "العدد"]}
                        />
                        
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={1000}>
                            {formattedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            {!isMobile && (
                                <LabelList 
                                    dataKey="count" 
                                    position="top" 
                                    style={{ fontSize: '12px', fontWeight: 'bold', fill: 'hsl(var(--foreground))' }} 
                                />
                            )}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
