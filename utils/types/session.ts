import { UserInfo } from "@/app/(app)/(root)/user-info";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  info: UserInfo | null;
}

export interface SessionState {
  user: null | User;
  isLoading: boolean;
  isSignIn: boolean;
}
