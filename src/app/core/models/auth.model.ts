import { User } from "./user.model";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SessionInfo {
  isAuthenticated: boolean;
  user?: User;
}
