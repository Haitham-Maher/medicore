export interface Medicine {
    name: string;
    type: string;
    dose: string;
    instructions: string;
}

export interface Prescription {
    prescription_number: string;
    prescription_id: number;
    doctor_name: string;
    created_at: string;
    medicines_count: number;
    medicines_details: Medicine[];
}
