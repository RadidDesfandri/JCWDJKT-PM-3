export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export type Register = Pick<User, "email" | "name" | "password">;
export type Login = Pick<User, "email" | "password">;
// export type UserUpdate = Partial<Login>;
