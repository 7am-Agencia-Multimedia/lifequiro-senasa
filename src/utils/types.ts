export type CreateReportTypes = {
    code: string,
    affiliate_id: string,
    affiliate_name: string,
    social_security_number: string,
    age: number,
    phone: string,
    study_center: string,
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
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    variants: Variant[];
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

// types.ts

export interface Disease {
    id: number;
    name: string;
}

export interface DiseaseVariant {
    id: number;
    name: string;
    description: string;
    treatment: string;
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
    center_id: number;
    disease_id: number;
    disease_variant_id: number;
    status: number;
    created_at: string;
    updated_at: string;
    disease: Disease;
    disease_variant: DiseaseVariant;
    pathological_antecedent: string,
    doctor_name: string,
}

export interface VariantsTypes {
    id: number,
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