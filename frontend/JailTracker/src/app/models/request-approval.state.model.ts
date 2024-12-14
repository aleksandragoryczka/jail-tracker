import { ApprovalState } from "./enums/approval-state.enum";

export interface RequestApprovalState{
    requestId: string;
    approvalState: ApprovalState;
}