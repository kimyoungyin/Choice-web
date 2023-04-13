declare module global {
    interface User {
        displayName: string;
        uid: string;
        email: string;
        photoUrl: string;
    }

    interface Category {
        id: number;
        name: string;
    }

    type Alert = "upload" | "complete";
}
