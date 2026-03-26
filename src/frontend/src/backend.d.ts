import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductInput {
    amazonLink: string;
    amazonPrice: number;
    name: string;
    description: string;
    imageUrl: string;
    flipkartPrice: number;
    category: string;
    flipkartLink: string;
}
export type ProductId = bigint;
export interface UserProfile {
    name: string;
}
export interface Product {
    id: ProductId;
    amazonLink: string;
    amazonPrice: number;
    name: string;
    createdAt: bigint;
    description: string;
    imageUrl: string;
    flipkartPrice: number;
    category: string;
    flipkartLink: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(input: ProductInput): Promise<Product>;
    deleteProduct(id: ProductId): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(id: ProductId): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listCategories(): Promise<Array<string>>;
    listProducts(category: string | null): Promise<Array<Product>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(searchTerm: string): Promise<Array<Product>>;
    updateProduct(id: ProductId, input: ProductInput): Promise<Product>;
}
