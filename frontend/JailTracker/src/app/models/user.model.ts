import { PermissionTypes } from './enums/permission-types.enum';
import { Roles } from './enums/roles.enum';

export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: Blob;
  isActive?: string;
  role?: Roles;
  organizationId?: string;
  currentTimeOffSupervisorId?: string;
  roles?: string[];
  permissions?: PermissionTypes[];
}
