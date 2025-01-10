import { RequestType } from "./enums/request-type.enum";


export interface UpdateRequest { 
    requestId?: string;
    newFromDate?: Date;
    newToDate?: Date;
    newRequestType?: RequestType;
}