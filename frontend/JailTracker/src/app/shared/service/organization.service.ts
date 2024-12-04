import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { OrganizationModel } from 'src/app/models/organization.model';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private organization = new BehaviorSubject<OrganizationModel | null>(null);
  public organization$ = this.organization.asObservable();

  constructor(private http: HttpClient) {}

  public initOrganization(user: User): void {
    if (!user?.organizationId) return;

    this.getOrganizationById(user.organizationId).subscribe(res => {
      this.setOrganization(res);
    });
  }

  public getOrSetOrganizationByUrlName(urlName: string) {
    if (this.organization.value?.urlName == urlName) return this.organization$;

    return this.getOrganizationByUrlName(urlName).pipe(
      map(x => {
        this.organization.next(x);
        return x;
      }),
      catchError(() => {
        this.clearOrganization();
        return of(null);
      })
    );
  }

  public clearOrganization() {
    this.organization.next(null);
  }

  private getOrganizationById(orgId: string) {
    return this.http
      .get<OrganizationModel>(
        `${environment.apiUrl}/organization?organizationId=${orgId}`
      )
      .pipe(map((res: OrganizationModel) => res));
  }

  private getOrganizationByUrlName(
    urlName: string
  ): Observable<OrganizationModel> {
    return this.http.get<OrganizationModel>(
      `${environment.apiUrl}/organization/getOrganizationByUrlName?urlName=${urlName}`
    );
  }

  private setOrganization(organization: OrganizationModel) {
    this.organization.next(organization);
  }
}
