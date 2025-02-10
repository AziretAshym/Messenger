import {Model} from "mongoose";

export interface UserFields {
    username: string;
    password: string;
    token: string;
    role: 'user' | 'admin';
    displayName: string;
    googleID: string;
    avatar: string;
}

export interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;
