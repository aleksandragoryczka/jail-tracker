import { ApprovalState } from './enums/approval-state.enum';

export interface Request {
  id?: string;
  fromDate: Date;
  toDate: Date;
  userId?: string;
  userFirstName?: string;
  userLastName?: string;
  approvalState: ApprovalState;
  timeOffSupervisorId?: string;
  supervisorFirstName?: string;
  supervisorLastName?: string;
}