export interface Country {
    id: number;
    name: string;
    code: string | null;
    capital: string | null;
    continent: string | null;
    tags: string[]
}
