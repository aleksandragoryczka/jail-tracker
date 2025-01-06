import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Absence } from 'src/app/models/absence.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaginatedResult } from 'src/app/models/paginatedResult.model';
import { DatePipe } from '@angular/common';
import { UpdateAbsence } from 'src/app/models/update-absence.model';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private absence = new BehaviorSubject<Absence | null>(null);
  public absence$ = this.absence.asObservable();
  env = environment;

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  public createAbsenceRequest(absence: Absence): Observable<Absence> {
    return this.http.post<Absence>(
      `${environment.apiUrl}/Absence/CreateAbsenceRequestForUser`,
      absence
    );
  }

  public cancelRequest(id: string): Observable<boolean> {
    return this.http.delete<boolean>(
      `${environment.apiUrl}/Absence/CancelRequestForUser/${id}`
    );
  }

  public getAbsencesForUser(
    pageNumber = 0,
    pageSize = 10
  ): Observable<PaginatedResult<Absence>> {
    return this.http.get<PaginatedResult<Absence>>(
      `${environment.apiUrl}/Absences/GetAbsencesForUser?skip=${
        pageNumber * pageSize
      }&take=${pageSize}`
    );
  }

  public getAbsencesMonthly(from: Date, to: Date): Observable<Absence[]> {
    return this.http.get<Absence[]>(
      `${
        environment.apiUrl
      }/Calendar/GetCalendarAbsencesForUser?from=${this.datePipe.transform(
        from,
        'yyyy-MM-dd'
      )}&to=${this.datePipe.transform(to, 'yyyy-MM-dd')}`
    );
  }

  public getYearAbsenceCountForUser(): Observable<number> {
    return this.http.get<number>(
      `${environment.apiUrl}/Absences/getYearAbsenceCountForUser`
    );
  }

  public updateAbsence(updateAbsence: UpdateAbsence): Observable<Absence> {
    return this.http.put<Absence>(
      `${this.env.apiUrl}/absence/updateAbsenceForUser`,
      updateAbsence
    );
  }
}
