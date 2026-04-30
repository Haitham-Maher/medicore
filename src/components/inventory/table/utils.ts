import { Pill, Droplets, Syringe, FlaskConical, PackageCheck } from "lucide-react";

export const getCategoryIcon = (type: string) => {
    const normalizedType = type?.toLowerCase();
    
    switch (normalizedType) {
        case "tablet": 
            return Pill;
        case "syrup": 
            return Droplets;
        case "ointment": 
            return FlaskConical;
        case "capsule": 
            return Pill;
        case "injection": 
            return Syringe;
        default: 
            return PackageCheck;
    }
};
