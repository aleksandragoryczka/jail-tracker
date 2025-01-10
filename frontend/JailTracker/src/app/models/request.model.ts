import { ApprovalState } from "./enums/approval-state.enum";
import { RequestType } from "./enums/request.enum";

export interface Request {
    id?: string;
    fromDate: Date;
    toDate: Date;
    requestType: RequestType;
    userId?: string;
    userFirstName?: string;
    userLastName?: string;
    approvalState: ApprovalState;
    requestSupervisorId?: string;
    supervisorFirstName?: string;
    supervisorLastName?: string;
  }
  