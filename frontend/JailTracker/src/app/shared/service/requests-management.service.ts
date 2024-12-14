import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApprovalState } from 'src/app/models/enums/approval-state.enum';
import { RequestType } from 'src/app/models/enums/request.enum';
import { Request } from 'src/app/models/request.model';
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
}
