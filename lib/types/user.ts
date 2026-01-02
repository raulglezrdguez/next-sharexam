export interface User {
  id: string;
  name: string;
  email: string;
  role: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  diagrams: User[];
}
