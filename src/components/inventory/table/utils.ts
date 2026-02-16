import { Pill, Boxes, Droplets, PackageCheck } from "lucide-react";

export const getCategoryIcon = (category: string) => {
    switch (category) {
        case "أدوية": return Pill;
        case "مستلزمات": return Boxes;
        case "مضادات حيوية": return Droplets;
        default: return PackageCheck;
    }
};
