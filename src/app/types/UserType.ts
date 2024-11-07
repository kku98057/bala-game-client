export interface UserProps {
  email: string;
  id: string;
  nickname: string;
  provider: string;
  role: UserRole;
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}
