export interface User {
  _id: string;
  username: string;
  token: string;
  role: 'admin' | 'user';
  displayName: string;
  avatar: string;
}

export interface OnlineUser {
  userId: string;
  username: string;
  displayName: string;
  role: string;
  avatar?: string;
}

export interface RegisterMutation {
  username: string;
  password: string;
  displayName: string;
  avatar: File | null;
}

export interface LoginMutation {
  username: string;
  password: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      message: string;
      name: string;
    },
  },
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}