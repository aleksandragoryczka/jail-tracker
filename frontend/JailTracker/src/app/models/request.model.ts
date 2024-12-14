import { ApprovalState } from "./enums/approval-state.enum";
import { RequestType } from "./enums/request.enum";

export interface Request {
    id?: string;
    from: Date;
    to: Date;
    requestType: RequestType;
    userId?: string;
    userFirstName?: string;
    userLastName?: string;
    approvalState: ApprovalState;
    requestSupervisorId?: string;
    supervisorFirstName?: string;
    supervisorLastName?: string;
  }
  