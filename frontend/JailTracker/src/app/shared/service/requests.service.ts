import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApprovalState } from 'src/app/models/enums/approval-state.enum';
import { RequestApprovalState } from 'src/app/models/request-approval.state.model';
import { Request } from 'src/app/models/request.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  constructor(private http: HttpClient) {}

  // USED
  public approveRequest(requestId: string, approvalState: ApprovalState) {
    const data: RequestApprovalState = {
      requestId: requestId,
      approvalState: approvalState,
    };
    return this.http.put<Request>(
      `${environment.apiUrl}/Requests/SetApprovalStateForRequest`,
      data
    );
  }

  // USED
  public createRequest(request: Request): Observable<Request> {
    return this.http.post<Request>(
      `${environment.apiUrl}/Requests/CreateRequest`, request
    );
  }

}
