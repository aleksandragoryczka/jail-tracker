import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApprovalState } from 'src/app/models/enums/approval-state.enum';
import { RequestType } from 'src/app/models/enums/request.enum';
import { PaginatedResult } from 'src/app/models/paginatedResult.model';
import { Request } from 'src/app/models/request.model';
import { UpdateRequest } from 'src/app/models/update-request.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestsManagementService {
  private request = new BehaviorSubject<Request | null>(null);
  public request$ = this.request.asObservable();
  env = environment;

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  public getEventsMonthly(from: Date, to: Date): Observable<Request[]> {
    const mockRequests: Request[] = [
      {
        id: '1',
        from: new Date('2024-12-01T10:00:00.000Z'),
        to: new Date('2024-12-01T11:00:00.000Z'),
        requestType: RequestType.Pass,
        userId: 'user1',
        userFirstName: 'John',
        userLastName: 'Doe',
        approvalState: ApprovalState.Pending,
        requestSupervisorId: 'supervisor1',
        supervisorFirstName: 'Alice',
        supervisorLastName: 'Smith',
      },
      {
        id: '2',
        from: new Date('2024-12-05T09:00:00.000Z'),
        to: new Date('2024-12-05T17:00:00.000Z'),
        requestType: RequestType.Visit,
        userId: 'user2',
        userFirstName: 'Jane',
        userLastName: 'Doe',
        approvalState: ApprovalState.Approved,
        requestSupervisorId: 'supervisor2',
        supervisorFirstName: 'Bob',
        supervisorLastName: 'Johnson',
      },
      {
        id: '3',
        from: new Date('2024-12-10T13:00:00.000Z'),
        to: new Date('2024-12-10T14:00:00.000Z'),
        requestType: RequestType.Visit,
        userId: 'user3',
        userFirstName: 'Sara',
        userLastName: 'Connor',
        approvalState: ApprovalState.Rejected,
        requestSupervisorId: 'supervisor3',
        supervisorFirstName: 'Eve',
        supervisorLastName: 'Williams',
      },
    ];

    // Filter requests by date range (if needed)
    const filteredRequests = mockRequests.filter((request) => {
      return request.from >= from && request.to <= to;
    });

    return of(filteredRequests);

    /*return this.http.get<Request[]>(
      `${
        environment.apiUrl
      }/Calendar/GetCalendarAbsencesForUser?from=${this.datePipe.transform(
        from,
        'yyyy-MM-dd'
      )}&to=${this.datePipe.transform(to, 'yyyy-MM-dd')}`
    );*/
  }

  public getRequestsForUser(
    pageNumber = 0,
    pageSize = 10
  ): Observable<PaginatedResult<Request>> {
    /*return this.http.get<PaginatedResult<Request>>(
      `${this.env.apiUrl}/RequestsManagement/GetRequestsForUser?skip=${
        pageNumber * pageSize
      }&take=${pageSize}`
    );*/

    // Create mock data to simulate the response
    const mockData: PaginatedResult<Request> = {
      data: [
        {
          id: '1',
          from: new Date('2024-12-14T10:00:00.000Z'),
          to: new Date('2024-12-14T11:00:00.000Z'),
          requestType: RequestType.Pass,
          userId: 'user1',
          userFirstName: 'John',
          userLastName: 'Doe',
          approvalState: ApprovalState.Approved,
          requestSupervisorId: 'supervisor1',
          supervisorFirstName: 'Alice',
          supervisorLastName: 'Smith',
        },
        {
          id: '2',
          from: new Date('2024-12-15T10:00:00.000Z'),
          to: new Date('2024-12-15T11:00:00.000Z'),
          requestType: RequestType.Visit,
          userId: 'user2',
          userFirstName: 'Jane',
          userLastName: 'Doe',
          approvalState: ApprovalState.Pending,
          requestSupervisorId: 'supervisor2',
          supervisorFirstName: 'Bob',
          supervisorLastName: 'Johnson',
        },
      ],
      count: 50,
      page: pageNumber + 1,
    };

    return of(mockData);
  }

  // TODO: implement BE for cancelling
  public cancelRequest(id: string): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.env.apiUrl}/Requests/CancelRequestForUser/${id}`
    );
  }

  // TODO: implement BE for updating
  public updateRequest(updateAbsence: UpdateRequest): Observable<Request> {
    return this.http.put<Request>(
      `${this.env.apiUrl}/Requests/updateRequestForUser`,
      updateAbsence
    );
  }

  public getYearAbsenceCountForUserInHours(): Observable<number> {
    const mockResponse: number = 123;

    return of(mockResponse);


    /*return this.http.get<number>(
      `${this.env.apiUrl}/RequestsManagement/getYearAbsenceCountForUserInHours`
    );*/
  }

  public getRequestsByDateForUser(
    fromDate: Date,
    toDate: Date,
    type: RequestType,
    skip = 0,
    take = 10
  ): Observable<PaginatedResult<Request>> {

    // Create mock data to simulate the response
    const mockData: PaginatedResult<Request> = {
      data: [
        {
          id: '1',
          from: new Date('2024-12-14T10:00:00.000Z'),
          to: new Date('2024-12-14T11:00:00.000Z'),
          requestType: RequestType.Pass,
          userId: 'user1',
          userFirstName: 'John',
          userLastName: 'Doe',
          approvalState: ApprovalState.Approved,
          requestSupervisorId: 'supervisor1',
          supervisorFirstName: 'Alice',
          supervisorLastName: 'Smith',
        },
        {
          id: '2',
          from: new Date('2024-12-15T10:00:00.000Z'),
          to: new Date('2024-12-15T11:00:00.000Z'),
          requestType: RequestType.Visit,
          userId: 'user2',
          userFirstName: 'Jane',
          userLastName: 'Doe',
          approvalState: ApprovalState.Pending,
          requestSupervisorId: 'supervisor2',
          supervisorFirstName: 'Bob',
          supervisorLastName: 'Johnson',
        },
      ],
      count: 50,
      page: 1,
    };

    return of(mockData);


    // const fromDateFormatted = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
    // const toDateFormatted = this.datePipe.transform(toDate, 'yyyy-MM-dd');
    // return this.http.get<PaginatedResult<Request>>(
    //   `${
    //     this.env.apiUrl
    //   }/RequestsManagement/GetRequestsByDateForUser?from=${fromDateFormatted}&to=${toDateFormatted}&type=${type}&skip=${
    //     skip * take
    //   }&take=${take}`
    // );
  }

  public getListOfRequests(
    skip = 0,
    take = 10
  ): Observable<PaginatedResult<Request>> {

    // Create mock data to simulate the response
    const mockData: PaginatedResult<Request> = {
      data: [
        {
          id: '1',
          from: new Date('2024-12-14T10:00:00.000Z'),
          to: new Date('2024-12-14T11:00:00.000Z'),
          requestType: RequestType.Pass,
          userId: 'user1',
          userFirstName: 'John',
          userLastName: 'Doe',
          approvalState: ApprovalState.Approved,
          requestSupervisorId: 'supervisor1',
          supervisorFirstName: 'Alice',
          supervisorLastName: 'Smith',
        },
        {
          id: '2',
          from: new Date('2024-12-15T10:00:00.000Z'),
          to: new Date('2024-12-15T11:00:00.000Z'),
          requestType: RequestType.Visit,
          userId: 'user2',
          userFirstName: 'Jane',
          userLastName: 'Doe',
          approvalState: ApprovalState.Pending,
          requestSupervisorId: 'supervisor2',
          supervisorFirstName: 'Bob',
          supervisorLastName: 'Johnson',
        },
      ],
      count: 50,
      page: 1,
    };

    return of(mockData);

    // return this.http.get<PaginatedResult<Request>>(
    //   `${
    //     environment.apiUrl
    //   }/RequestsManagement/GetPendingRequestsForSupervisor?&skip=${
    //     skip * take
    //   }&take=${take}`
    // );
  }
}
