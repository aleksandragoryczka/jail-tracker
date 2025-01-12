import { Roles } from './enums/roles.enum';

export interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string,
    role?: Roles;
    supervisorId?: string;
  }