import { HeartPulse, Baby, LucideIcon } from "lucide-react";

export interface IDoctor {
  id: string;
  name: string;
  specialize: string;
  rating: number;
  patients: number;
  status: "available" | "busy" | "off-duty";
  bio: string;
  phone: string;
}

export interface IReport {
  id: number;
  text: string;
  date: string;
  managerName: string;
}

export interface IDepartmentDetail {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  image: string;
  head: {
    name: string;
    email: string;
    phone: string;
    rating: number;
    specialization: string;
    image: string;
  };
  stats: {
    patients: number;
    doctors: number;
    avgRating: number;
    prescriptions: number;
  };
  accentColor: string;
  doctors: IDoctor[];
  reports: IReport[];
}

export const departmentData: Record<string, IDepartmentDetail> = {
  "1": {
    id: "1",
    name: "قسم القلبية",
    icon: HeartPulse,
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    image:
      "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=1200",
    head: {
      name: "د. خالد منصور",
      email: "khalid.mansour@clinic.com",
      phone: "+966 50 123 4567",
      rating: 4.8,
      specialization: "أمراض القلب والأوعية الدموية",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200",
    },
    stats: {
      patients: 342,
      doctors: 5,
      avgRating: 4.6,
      prescriptions: 890,
    },
    accentColor: "#14b8a6",
    doctors: [
      {
        id: "1",
        name: "د. أحمد السالم",
        specialize: "قلب تداخلي",
        rating: 4.7,
        patients: 45,
        status: "available",
        bio: "طبيب قلب تداخلي بخبرة 10 سنوات في القسطرة القلبية",
        phone: "+966 50 111 2222",
      },
      {
        id: "2",
        name: "د. فاطمة الزهراني",
        specialize: "قلب أطفال",
        rating: 4.9,
        patients: 38,
        status: "busy",
        bio: "متخصصة في أمراض القلب الخلقية عند الأطفال",
        phone: "+966 50 333 4444",
      },
      {
        id: "3",
        name: "د. محمد العتيبي",
        specialize: "فسيولوجيا القلب",
        rating: 4.5,
        patients: 52,
        status: "available",
        bio: "متخصص في الفحوصات الفسيولوجية للقلب",
        phone: "+966 50 555 6666",
      },
      {
        id: "4",
        name: "د. نورة القحطاني",
        specialize: "جراحة القلب",
        rating: 4.8,
        patients: 41,
        status: "off-duty",
        bio: "جراحة قلب مفتوح وعمليات الصمامات",
        phone: "+966 50 777 8888",
      },
      {
        id: "5",
        name: "د. عبدالله الدوسري",
        specialize: "قلب عام",
        rating: 4.6,
        patients: 47,
        status: "available",
        bio: "طب القلب العام والفحوصات الدورية",
        phone: "+966 50 999 0000",
      },
    ],
    reports: [
      {
        id: 1,
        text: "تم استقبال 45 حالة طوارئ قلبية خلال الأسبوع الماضي، وتم تحويل 3 حالات للعناية المركزة. الأداء العام للقسم جيد مع ملاحظة الحاجة لزيادة الكادر في فترة المساء.",
        date: "2026-02-18",
        managerName: "د. خالد منصور",
      },
      {
        id: 2,
        text: "تقرير شهري عن حالة الأجهزة الطبية في القسم: جميع أجهزة تخطيط القلب تعمل بشكل سليم، يُطلب صيانة دورية لجهاز الإيكو رقم 3.",
        date: "2026-02-10",
        managerName: "د. خالد منصور",
      },
      {
        id: 3,
        text: "تم إجراء 12 عملية قسطرة قلبية ناجحة هذا الشهر بنسبة نجاح 100%. لا توجد مضاعفات مسجلة.",
        date: "2026-02-01",
        managerName: "د. خالد منصور",
      },
    ],
  },
  "2": {
    id: "2",
    name: "قسم الأطفال",
    icon: Baby,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    image:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=1200",
    head: {
      name: "د. مريم العلي",
      email: "maryam.ali@clinic.com",
      phone: "+966 50 234 5678",
      rating: 4.9,
      specialization: "طب الأطفال العام",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?auto=format&fit=crop&q=80&w=200",
    },
    stats: {
      patients: 521,
      doctors: 3,
      avgRating: 4.7,
      prescriptions: 1240,
    },
    accentColor: "#3b82f6",
    doctors: [
      {
        id: "1",
        name: "د. سارة الشمري",
        specialize: "حديثي الولادة",
        rating: 4.8,
        patients: 62,
        status: "available",
        bio: "متخصصة في رعاية حديثي الولادة والخداج",
        phone: "+966 50 222 3333",
      },
      {
        id: "2",
        name: "د. يوسف المطيري",
        specialize: "أطفال عام",
        rating: 4.6,
        patients: 55,
        status: "busy",
        bio: "طب أطفال عام وتطعيمات",
        phone: "+966 50 444 5555",
      },
      {
        id: "3",
        name: "د. هند الغامدي",
        specialize: "طوارئ أطفال",
        rating: 4.9,
        patients: 48,
        status: "available",
        bio: "طوارئ أطفال والحالات الحرجة",
        phone: "+966 50 666 7777",
      },
    ],
    reports: [
      {
        id: 1,
        text: "ارتفاع ملحوظ في حالات الأنفلونزا الموسمية عند الأطفال. تم تخصيص عيادة إضافية للتعامل مع الضغط. يُنصح بتوفير كميات إضافية من لقاح الأنفلونزا.",
        date: "2026-02-17",
        managerName: "د. مريم العلي",
      },
      {
        id: 2,
        text: "تقرير حملة التطعيمات الشهرية: تم تطعيم 180 طفل هذا الشهر، بنسبة تغطية 92% من المستهدف.",
        date: "2026-02-05",
        managerName: "د. مريم العلي",
      },
    ],
  },
};
