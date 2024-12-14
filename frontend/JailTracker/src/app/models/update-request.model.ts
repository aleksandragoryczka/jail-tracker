import { RequestType } from "./enums/request.enum";

export interface UpdateRequest { 
    requestId?: string;
    newFromDate?: Date;
    newToDate?: Date;
    newRequestType?: RequestType;
    newRequestSupervisorId?: string;
}