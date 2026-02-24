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
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400",
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
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400",
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
    image:
      "https://images.unsplash.com/photo-1504813184591-01592fd03cfd?auto=format&fit=crop&q=80&w=400",
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
    image:
      "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=400",
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
    image:
      "https://images.unsplash.com/photo-1587351021759-3e566b9af922?auto=format&fit=crop&q=80&w=400",
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
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=400",
  },
];
