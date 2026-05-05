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
        ""
    );
}
