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
    Legend,
    ResponsiveContainer,
    LabelList,
} from "recharts";
import ChartsSkeleton from "../skeletons/ChartsSkeleton";

export default function AgeDistributionChart({ isAdmin = true }: { isAdmin?: boolean }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const { data: response, isLoading } = useQuery({
        queryKey: ["chart age", isAdmin],
        queryFn: async () => {
            const endpoint = isAdmin ? "/dashboard/charts/age-distribution" : "/point-manager/age-distribution";
            const res = await api.get(endpoint);
            return res.data;
        }
    });

    if (isLoading) {
        return <ChartsSkeleton />;
    }

    // استخراج الـ Object الذي يحتوي على الأيام من الاستجابة
    const rawData = response?.data;

    const dayTranslation: Record<string, string> = {
        "Saturday": "السبت",
        "Sunday": "الأحد",
        "Monday": "الاثنين",
        "Tuesday": "الثلاثاء",
        "Wednesday": "الأربعاء",
        "Thursday": "الخميس",
        "Friday": "الجمعة"
    };

    // تحويل الـ Object إلى Array of Objects وتجهيزه للرسم البياني
    const formattedData = rawData ? Object.keys(rawData).map((day) => ({
        name: dayTranslation[day] || day,
        children: rawData[day].child || 0,
        adults: rawData[day].adult || 0,
        elderly: rawData[day].elderly || 0,
    })) : [];

    return (
        <div className="bg-card p-4 md:p-6 rounded-2xl border border-border shadow-sm h-full flex flex-col">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground">
                    التوزيع العمري للمراجعين
                    {/* إضافة اسم النقطة ديناميكياً إذا كانت موجودة في الـ API (مثل: جباليا) */}
                    {response?.point && <span className="text-muted-foreground font-normal text-sm mr-2">({response.point})</span>}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    تحليل الفئات العمرية لتوجيه صرف الأدوية
                </p>
            </div>

            <div className="h-[300px] md:h-[350px] w-full mt-auto" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={formattedData}
                        margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                        barCategoryGap={isMobile ? "15%" : "20%"}
                        barGap={isMobile ? 2 : 4}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="hsl(var(--border))"
                            strokeOpacity={0.5}
                        />

                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "hsl(var(--foreground))",
                                fontSize: isMobile ? 10 : 12,
                                fontWeight: "600"
                            }}
                            dy={10}
                            interval={isMobile ? "preserveStartEnd" : 0}
                            minTickGap={10}
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
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                            }}
                            itemStyle={{ fontSize: "12px", padding: "2px 0" }}
                        />

                        <Legend
                            wrapperStyle={{ paddingTop: "25px", fontSize: isMobile ? "10px" : "12px" }}
                            iconType="circle"
                            iconSize={8}
                        />

                        <Bar
                            name="أطفال"
                            dataKey="children"
                            fill="#14b8a6"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1000}
                        >
                            {!isMobile && <LabelList dataKey="children" position="top" style={{ fontSize: '10px', fill: 'hsl(var(--muted-foreground))' }} />}
                        </Bar>

                        <Bar
                            name="بالغين"
                            dataKey="adults"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1000}
                            animationBegin={100}
                        >
                            {!isMobile && <LabelList dataKey="adults" position="top" style={{ fontSize: '10px', fill: 'hsl(var(--muted-foreground))' }} />}
                        </Bar>

                        <Bar
                            name="كبار السن"
                            dataKey="elderly"
                            fill="#8b5cf6"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1000}
                            animationBegin={200}
                        >
                            {!isMobile && <LabelList dataKey="elderly" position="top" style={{ fontSize: '10px', fill: 'hsl(var(--muted-foreground))' }} />}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}