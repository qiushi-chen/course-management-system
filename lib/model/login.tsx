import { Role } from './role';

export interface LoginFormValue {
  role: Role;
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterFormValue {
  email: string;
  password: string;
  role: string;
}

export type LoginRequest = LoginFormValue;
export type SignUpRequest = RegisterFormValue;

export interface LoginResponse {
  role: Role;
  token: string;
  userId: number;
}
