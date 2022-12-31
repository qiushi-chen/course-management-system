export type User = {
  email: string;
  password: string;
  role: string;
};

export type LoginResponse = {
  code: number;
  msg: string;
  data: {
    token: string;
    role: string;
    userId: number;
  };
};
