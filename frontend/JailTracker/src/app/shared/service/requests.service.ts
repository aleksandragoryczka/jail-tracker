import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApprovalState } from 'src/app/models/enums/approval-state.enum';
import { RequestType } from 'src/app/models/enums/request.enum';
import { PaginatedResult } from 'src/app/models/paginatedResult.model';
import { RequestApprovalState } from 'src/app/models/request-approval.state.model';
import { Request } from 'src/app/models/request.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  constructor(private http: HttpClient) {}

  public getListOfRequests(
    skip = 0,
    take = 10
  ): Observable<PaginatedResult<Request>> {
    const mockData: PaginatedResult<Request> = {
      data: [
        {
          id: '1',
          from: new Date('2024-12-14T10:00:00.000Z'),
          to: new Date('2024-12-14T10:00:00.000Z'),
          requestType: RequestType.Pass,
          userId: 'user1',
          userFirstName: 'FirstName 1',
          userLastName: 'LastName 1',
          approvalState: ApprovalState.Pending,
          requestSupervisorId: 'supervisor1',
          supervisorFirstName: 'SupervisorFirstName 1',
          supervisorLastName: 'SupervisorLastName 1',
        },
        {
          id: '2',
          from: new Date('2024-12-14T10:00:00.000Z'),
          to: new Date('2024-12-14T10:00:00.000Z'),
          requestType: RequestType.Visit,
          userId: 'user2',
          userFirstName: 'FirstName 2',
          userLastName: 'LastName 2',
          approvalState: ApprovalState.Approved,
          requestSupervisorId: 'supervisor2',
          supervisorFirstName: 'SupervisorFirstName 2',
          supervisorLastName: 'SupervisorLastName 2',
        },
      ],
      count: 50,
      page: 1,
    };

    return of(mockData);

    /*return this.http.get<PaginatedResult<Request>>(
      `${
        environment.apiUrl
      }/requestsManagement/GetPendingRequestsForSupervisor?skip=${
        skip * take
      }&take=${take}`
    );*/
  }

  public approveRequest(requestId: string, approvalState: ApprovalState) {
    const data: RequestApprovalState = {
      requestId: requestId,
      approvalState: approvalState,
    };
    return this.http.post<Request>(
      `${environment.apiUrl}/requests/SetApprovalStateForRequest`,
      data
    );
  }

  public getListOfRequestsHistory(
    skip = 0,
    take = 10
  ): Observable<PaginatedResult<Request>> | Observable<undefined> {
    const mockData: PaginatedResult<Request> = {
        data: [
          {
            id: '1',
            from: new Date('2024-12-14T10:00:00.000Z'),
            to: new Date('2024-12-14T10:00:00.000Z'),
            requestType: RequestType.Pass,
            userId: 'user1',
            userFirstName: 'FirstName 1',
            userLastName: 'LastName 1',
            approvalState: ApprovalState.Pending,
            requestSupervisorId: 'supervisor1',
            supervisorFirstName: 'SupervisorFirstName 1',
            supervisorLastName: 'SupervisorLastName 1',
          },
          {
            id: '2',
            from: new Date('2024-12-14T10:00:00.000Z'),
            to: new Date('2024-12-14T10:00:00.000Z'),
            requestType: RequestType.Visit,
            userId: 'user2',
            userFirstName: 'FirstName 2',
            userLastName: 'LastName 2',
            approvalState: ApprovalState.Approved,
            requestSupervisorId: 'supervisor2',
            supervisorFirstName: 'SupervisorFirstName 2',
            supervisorLastName: 'SupervisorLastName 2',
          },
        ],
        count: 50,
        page: 1,
      };
  
      return of(mockData);

    /*return this.http.get<PaginatedResult<Request>>(
      `${
        environment.apiUrl
      }/requestsManagement/GetSupervisedAbsencesRequestsForSupervisor?skip=${
        skip * take
      }&take=${take}`
    );*/
  }
}
