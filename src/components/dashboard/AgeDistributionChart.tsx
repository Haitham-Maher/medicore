"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const data = [
    { name: "السبت", children: 45, adults: 80, elderly: 35 },
    { name: "الأحد", children: 55, adults: 75, elderly: 40 },
    { name: "الاثنين", children: 30, adults: 60, elderly: 55 },
    { name: "الثلاثاء", children: 70, adults: 65, elderly: 45 },
    { name: "الأربعاء", children: 40, adults: 90, elderly: 30 },
    { name: "الخميس", children: 50, adults: 55, elderly: 60 },
    { name: "الجمعة", children: 20, adults: 40, elderly: 25 },
];

export default function AgeDistributionChart() {
    return (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm h-full">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-foreground">
                        التوزيع العمري للمراجعين
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        تحليل الفئات العمرية لتوجيه صرف الأدوية
                    </p>
                </div>
            </div>

            <div className="h-[350px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                        barSize={10} // حجم العمود (رفيع وأنيق ليناسب 3 أعمدة)
                        barGap={4}   // المسافة بين الأعمدة في نفس اليوم
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E5E7EB"
                            strokeOpacity={0.6}
                        />

                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6B7280", fontSize: 12 }}
                            dy={10}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6B7280", fontSize: 12 }}
                        />

                        <Tooltip
                            cursor={{ fill: "transparent" }}
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                borderRadius: "12px",
                                border: "1px solid hsl(var(--border))",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                color: "hsl(var(--foreground))",
                            }}
                            labelStyle={{ fontWeight: "bold", marginBottom: "5px" }}
                        />

                        <Legend
                            wrapperStyle={{ paddingTop: "25px" }}
                            iconType="circle"
                            iconSize={10}
                        />

                        {/* 1. الأطفال - لون تركواز ناعم (أدوية خفيفة) */}
                        <Bar
                            name="أطفال (<12)"
                            dataKey="children"
                            fill="#2dd4bf" // Teal-400
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                        />

                        {/* 2. البالغين - لون أزرق رسمي (الفئة الأكبر) */}
                        <Bar
                            name="بالغين (18-60)"
                            dataKey="adults"
                            fill="#3b82f6" // Blue-500
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                        />

                        {/* 3. كبار السن - لون نيلي/بنفسجي (أدوية مزمنة) */}
                        <Bar
                            name="كبار السن (60+)"
                            dataKey="elderly"
                            fill="#6366f1" // Indigo-500
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                        />

                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}