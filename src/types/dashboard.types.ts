export interface IUsers {
  id: string;
  name: string;
  email: string;
  role: string;
  isSelected?: boolean;
}

export interface IUsersMap {
  [id: string]: IUsers;
}

export type TRequestStatus = "idle" | "pending" | "fulfilled" | "rejected";
