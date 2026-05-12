import { StaffRole } from '../user-role.enum';

export class CreateStaffDto {
  fullName!: string;
  email!: string;
  password!: string;
  role!: StaffRole;
  employeeCode?: string;
  phone?: string;
  position?: string;
}
