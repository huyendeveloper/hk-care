import { Role } from "./common";
export interface UserInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  image: string | null;
  userName: string;
  userRole: UserRole;

}
export interface UserRole {
  id: number;
  name: string;
  code: Role;
}
