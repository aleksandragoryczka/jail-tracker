import { AbsenceType } from './enums/absence-type.enum';

export interface UpdateAbsence {
  absenceId?: string;
  newFromDate?: Date;
  newToDate?: Date;
  newAbsenceType?: AbsenceType;
  newTimeoffSupervisorId?: string;
}
