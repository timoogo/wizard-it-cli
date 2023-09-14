export interface Question {
    type: string;
    name: string;
    message: string;
    default?: string;
    isVisible?: boolean;
}