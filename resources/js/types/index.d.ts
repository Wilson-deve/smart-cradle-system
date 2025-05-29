export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    permissions: string[];
}

export interface PageProps {
    auth: {
        user: User | null;
    };
    flash?: {
        message?: string;
        error?: string;
    };
}
