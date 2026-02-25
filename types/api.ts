export type UserData = {
  id: string;
  username: string;
  email: string;
  role: string;
  containers: {
    used: number;
    max: number;
  };
  database: number;
  created_at: string;
  updated_at: string;
};
