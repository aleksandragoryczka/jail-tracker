import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Request } from 'src/app/models/request.model';
import { PaginatedResult } from 'src/app/models/paginatedResult.model';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { RequestType } from 'src/app/models/enums/request-type.enum';
@Injectable({
  providedIn: 'root',
})
export class RequestsManagementService {
  private env = environment;
  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  public getRequestsByPrisonId(
    fromDate: Date,
    toDate: Date,
    skip = 0,
    take = 10
  ): Observable<PaginatedResult<Request>> {
    console.log("something")
    const fromDateFormatted = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
    const toDateFormatted = this.datePipe.transform(toDate, 'yyyy-MM-dd');

    return this.http.get<PaginatedResult<Request>>(
      `${this.env.apiUrl}/RequestsManagement/GetRequestsByPrisonId?from=${fromDateFormatted}&to=${toDateFormatted}&skip=${skip}&take=${take}`
    );
  }

  public getListOfRequests(
    skip = 0,
    take = 10
  ): Observable<PaginatedResult<Request>> {
    return this.http.get<PaginatedResult<Request>>(
      `${
        environment.apiUrl
      }/RequestsManagement/GetPendingRequestsForSupervisor?&skip=${
        skip * take
      }&take=${take}`
    );
  }

  public getRequestsForUser(
    fromDate: Date,
    toDate: Date,
    type: RequestType,
    skip = 0,
    take = 10
  ): Observable<PaginatedResult<Request>> {
    const fromDateFormatted = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
    const toDateFormatted = this.datePipe.transform(toDate, 'yyyy-MM-dd');
    return this.http.get<PaginatedResult<Request>>(
      `${
        this.env.apiUrl
      }/RequestsManagement/GetRequestsByDateForUser?from=${fromDateFormatted}&to=${toDateFormatted}&type=${type}&skip=${
        skip * take
      }&take=${take}`
    );
  }
}
