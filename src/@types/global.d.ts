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

    type ChoiceType = boolean;

    interface Choice {
        choiceType: ChoiceType;
    }

    interface Post {
        id: number;
        title: string;
        choice1: string;
        choice2: string;
        Category?: Category;
        choice1Url: string | null;
        choice2Url: string | null;
        uploaderId: string;
        createdAt: string;
        updatedAt: string;
        categoryId: number;
        Choices: Choice[]; // 모델
    }

    type Alert = "upload" | "complete";
}
