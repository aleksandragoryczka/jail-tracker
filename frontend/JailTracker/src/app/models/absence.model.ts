import { AbsenceType } from './enums/absence-type.enum';
import { ApprovalState } from './enums/approval-state.enum';

export interface Absence {
  id?: string;
  fromDate: Date;
  toDate: Date;
  absenceType: AbsenceType;
  userId?: string;
  userFirstName?: string;
  userLastName?: string;
  approvalState: ApprovalState;
  timeOffSupervisorId?: string;
  supervisorFirstName?: string;
  supervisorLastName?: string;
}
