export type CreateReportTypes = {
    code: string,
    affiliate_id: string,
    affiliate_name: string,
    social_security_number: string,
    age: number,
    phone: string,
    study_center: string,
    diseases: string,
    variants_names:string,
    procedure_center: string,
    traffic_accident: boolean,
    procedure_names: string,
    current_disease_history: string,
    pathological_antecedent: string,
    doctor_name: string,
}

export type userData = {
    id: number,
    firstname: string,
    lastname: string,
    phone: string,
    mobile: string,
    office_id: number,
    birthday: string,
    gender: string,
    document_no: string,
    social_id: string,
    age: number
}

export interface Disease {
    id: number | string;
    name: string;
    created_at?: string;
    updated_at?: string;
    variants: NewVariant[];
}

export interface Variant {
    id: number;
    disease_id: number;
    name: string;
    description: string;
    treatment: string;
    created_at: string;
    updated_at: string;
}

export interface NewVariant {
    id: number | string;
    disease_id: number | string;
    name: string;
    description: string;
    treatment: {
        [key: number]: string;
    };
    created_at?: string;
    updated_at?: string;
}

// types.ts

export interface AddDisease {
    id: number | string;
    name: string; 
    variant?: { id: string | number, name: string, description?: string, treatment?: string[] }
}

export interface DiseaseVariant {
    id: number;
    name: string;
    description: string;
    treatment: string;
}

export interface VariantsTypes {
    id: number | string,
    name: string,
    description: string,
    treatment: {
        [key: number]: string;
    };
}

export interface PaginationTypes {
    limit: number,
    total: number,
    totalPages: number
}

// Definir el tipo para el tratamiento
interface Treatment {
    [key: string]: string;
}

interface VariantTypes {
    id: number;
    name: string;
    description: string;
    treatment: string;
}

export interface DiseaseTypes {
    id: number;
    name: string;
    variant: VariantTypes;
}

interface Doctor {
    name: string;
    specialty: string;
}

interface Affiliate {
    id: number;
    firstname: string;
    lastname: string;
    phone: string;
    mobile: string;
    office_id: number;
    birthday: string;
    gender: string;
    document_no: string;
    social_id: string;
    age: number;
}

export interface ReportUser {
    id: number;
    code: string;
    affiliate_id: string;
    affiliate_name: string;
    social_security_number: string;
    age: number;
    phone: string;
    study_center: string;
    procedure_center: string;
    traffic_accident: boolean;
    procedure_names: string;
    current_disease_history: string;
    pathological_antecedent: string;
    doctor_name: string;
    center_id: number;
    status: number;
    created_at: string;
    updated_at: string;
    diseases: DiseaseTypes[];
    center: string;
    centercode: number;
    doctors: Doctor[];
    affiliate: Affiliate;
}