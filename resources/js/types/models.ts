export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    roles: Role[];
    permissions: string[];
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    slug: string;
    permissions: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    slug: string;
    description: string;
} 