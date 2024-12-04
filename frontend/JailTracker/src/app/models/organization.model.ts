import { User } from './user.model';

export interface OrganizationModel {
  id?: string;
  name: string;
  urlName: string;
  users?: User[];
}
