export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface SessionState {
  user: null | User;
  isLoading: boolean;
}
