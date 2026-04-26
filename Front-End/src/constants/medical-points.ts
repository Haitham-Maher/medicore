export interface IMedicalPoint {
  id: string;
  name: string;
  location: string;
  manager: string;
  rating: number;
  doctorsCount: number;
  departmentsCount: number;
  status: "active" | "inactive" | "maintenance";
  image: string;
}

// ─── بيانات الأقسام للمدير ───────────────────────────────────────
export interface IDepartment {
  id: string;
  name: string;
  location: string;   // النقطة الطبية التابع لها
  manager: string;    // رئيس القسم
  rating: number;
  doctorsCount: number;
  departmentsCount: number; // عدد الغرف
  status: "active" | "inactive" | "maintenance";
  image: string;
}

export const managerDepartments: IDepartment[] = [
  {
    id: "1",
    name: "قسم القلبية",
    location: "نقطة الشفاء - الرياض",
    manager: "د. خالد منصور",
    rating: 4.8,
    doctorsCount: 8,
    departmentsCount: 5,
    status: "active",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    name: "قسم الأطفال",
    location: "مركز الأمل - جدة",
    manager: "د. مريم العلي",
    rating: 4.9,
    doctorsCount: 12,
    departmentsCount: 7,
    status: "active",
    image: "https://images.unsplash.com/photo-1519494144143-269638d9724b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    name: "قسم العظام",
    location: "عيادات النور - الدمام",
    manager: "د. فهد السعد",
    rating: 4.7,
    doctorsCount: 6,
    departmentsCount: 4,
    status: "active",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "4",
    name: "المختبر",
    location: "مجمع الرعاية - مكة",
    manager: "أ. منى التميمي",
    rating: 4.6,
    doctorsCount: 10,
    departmentsCount: 3,
    status: "maintenance",
    image: "https://images.unsplash.com/photo-1586773860418-d319a39855df?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "5",
    name: "الصيدلية",
    location: "مركز الغربية - جدة",
    manager: "ص. يحيى القحطاني",
    rating: 4.5,
    doctorsCount: 5,
    departmentsCount: 2,
    status: "active",
    image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "6",
    name: "الطوارئ",
    location: "مستوصف السلام - الرياض",
    manager: "د. سامي الحربي",
    rating: 4.8,
    doctorsCount: 15,
    departmentsCount: 8,
    status: "active",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
  },
];

// ─── بيانات النقاط الطبية للأدمن ─────────────────────────────────
export const medicalPoints: IMedicalPoint[] = [
  {
    id: "1",
    name: "نقطة الشفاء الطبية",
    location: "الرياض - حي النسيم",
    manager: "د. أحمد محمد",
    rating: 4.8,
    doctorsCount: 12,
    departmentsCount: 6,
    status: "active",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    name: "مركز الأمل الصحي",
    location: "جدة - حي الروضة",
    manager: "د. سارة علي",
    rating: 4.5,
    doctorsCount: 8,
    departmentsCount: 4,
    status: "active",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    name: "عيادات النور",
    location: "الدمام - حي الفيصلية",
    manager: "د. خالد عبدالله",
    rating: 4.9,
    doctorsCount: 15,
    departmentsCount: 8,
    status: "active",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "4",
    name: "مجمع الرعاية الطبي",
    location: "مكة - حي العزيزية",
    manager: "د. فاطمة أحمد",
    rating: 4.3,
    doctorsCount: 6,
    departmentsCount: 3,
    status: "maintenance",
    image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "5",
    name: "مركز الغربية الطبي",
    location: "جدة - حي الشاطئ",
    manager: "د. عمر فاروق",
    rating: 4.7,
    doctorsCount: 10,
    departmentsCount: 5,
    status: "active",
    image: "https://plus.unsplash.com/premium_photo-1664475450083-0c0eeefc528c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "6",
    name: "مستوصف السلام",
    location: "الرياض - حي الملز",
    manager: "د. يوسف العتيبي",
    rating: 4.2,
    doctorsCount: 5,
    departmentsCount: 2,
    status: "inactive",
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=800",
  },
];
