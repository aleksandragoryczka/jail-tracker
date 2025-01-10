import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { RequestType } from 'src/app/models/enums/request-type.enum';
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

  // USED
  public getRequestsMonthly(from: Date, to: Date): Observable<Request[]> {
    return this.http.get<Request[]>(
      `${
        environment.apiUrl
      }/RequestsManagement/getAllAcceptedRequestsMonthly?from=${this.datePipe.transform(
        from,
        'yyyy-MM-dd'
      )}&to=${this.datePipe.transform(to, 'yyyy-MM-dd')}`
    );
  }

  // USED
  public getRequestsForUser(
    pageNumber = 0,
    pageSize = 10
  ): Observable<PaginatedResult<Request>> {
    return this.http
      .get<PaginatedResult<Request>>(
        `${this.env.apiUrl}/RequestsManagement/GetRequestsForUser?skip=${
          pageNumber * pageSize
        }&take=${pageSize}`
      )
      .pipe(
        map((response: PaginatedResult<Request>) => {
          response.data = response.data.map((request: Request) => ({
            ...request,
            fromDate: new Date(request.fromDate),
            toDate: new Date(request.toDate),
          }));

          return response;
        })
      );
  }

  // USED
  public updateRequest(updateAbsence: UpdateRequest): Observable<Request> {
    return this.http.put<Request>(
      `${this.env.apiUrl}/Requests/updateRequestForUser`,
      updateAbsence
    );
  }

  // USED
  public getYearAbsenceCountForUserInHours(
    requestType: RequestType
  ): Observable<number> {
    return this.http.get<number>(
      `${this.env.apiUrl}/RequestsManagement/getYearAbsenceCountForUserInHoursByRequestType/${requestType}`
    );
  }

  // USED
  public getRequestsByDateForUser(
    fromDate: Date,
    toDate: Date,
    type: RequestType,
    skip = 0,
    take = 10
  ): Observable<PaginatedResult<Request>> {
    const fromDateFormatted = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
    const toDateFormatted = this.datePipe.transform(toDate, 'yyyy-MM-dd');
    return this.http
      .get<PaginatedResult<Request>>(
        `${
          this.env.apiUrl
        }/RequestsManagement/GetRequestsByDateForUser?from=${fromDateFormatted}&to=${toDateFormatted}&type=${type}&skip=${
          skip * take
        }&take=${take}`
      )
      .pipe(
        map((response: PaginatedResult<Request>) => {
          response.data = response.data.map((request: Request) => ({
            ...request,
            fromDate: new Date(request.fromDate),
            toDate: new Date(request.toDate),
          }));

          return response;
        })
      );
  }

  // USED
  public getListOfRequests(
    skip = 0,
    take = 10
  ): Observable<PaginatedResult<Request>> {
    return this.http
      .get<PaginatedResult<Request>>(
        `${
          environment.apiUrl
        }/RequestsManagement/GetPendingVisitsAndPassesRequestsForSupervisor?&skip=${
          skip * take
        }&take=${take}`
      )
      .pipe(
        map((response: PaginatedResult<Request>) => {
          response.data = response.data.map((request: Request) => ({
            ...request,
            fromDate: new Date(request.fromDate),
            toDate: new Date(request.toDate),
          }));

          return response;
        })
      );
  }

  // USED
  public cancelRequest(id: string): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.env.apiUrl}/Requests/CancelRequestForUser/${id}`
    );
  }

  // USED
  public getListOfRequestsHistory(
    skip = 0,
    take = 10
  ): Observable<PaginatedResult<Request>> | Observable<undefined> {
    return this.http
      .get<PaginatedResult<Request>>(
        `${
          environment.apiUrl
        }/RequestsManagement/GetSupervisedVisitsAndPassesRequestsForSupervisor?skip=${
          skip * take
        }&take=${take}`
      )
      .pipe(
        map((response: PaginatedResult<Request>) => {
          response.data = response.data.map((request: Request) => ({
            ...request,
            fromDate: new Date(request.fromDate),
            toDate: new Date(request.toDate),
          }));

          return response;
        })
      );
  }
}
