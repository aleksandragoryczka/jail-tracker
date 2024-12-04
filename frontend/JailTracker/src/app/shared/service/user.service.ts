import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../../models/user.model';
import { TokenService } from './token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginModel } from '../../models/login.model';
import { AuthenticatedResponse } from '../../models/authenticated-response.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { OrganizationService } from './organization.service';
import { PermissionTypes } from 'src/app/models/enums/permission-types.enum';
import { Roles } from 'src/app/models/enums/roles.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = new BehaviorSubject<User | null>(null);
  public user$ = this.user.asObservable();
  private isAdmin = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdmin.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private jwtHelper: JwtHelperService,
    private organizationService: OrganizationService
  ) {
    const token = this.tokenService.getToken();
    if (!!token && !this.jwtHelper.isTokenExpired(token))
      this.setUser({ token: token } as AuthenticatedResponse);
    else this.tokenService.clearToken();
  }

  public get isUserAuthenticated(): boolean {
    const token = this.tokenService.getToken();
    if (!!token && !this.jwtHelper.isTokenExpired(token)) return true;
    return false;
  }

  public getUser(id: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/User/${id}`);
  }

  public login(loginModel: LoginModel): Observable<boolean> {
    console.log(`${loginModel.email} :: ${loginModel.password}`)
    // TODO connect with backend
    return this.http
      .post<AuthenticatedResponse>(`${environment.apiUrl}/token`, loginModel)
      .pipe(
        map((res: AuthenticatedResponse) => {
          if (!res) return false;
          this.tokenService.setToken(res);
          this.setUser(res);
          return true;
        })
      );
  }

  public logout(): void {
    this.tokenService.clearToken();
    this.clearUser();
  }

  private setUser(auth: AuthenticatedResponse | null): void {
    if (!auth) return;
    const decodeToken = this.jwtHelper.decodeToken(auth.token);
    const user: User = {
      id: decodeToken['userId'],
      organizationId: decodeToken['organizationId'],
      permissions: this.getPermissions(decodeToken['permissions']),
      role: this.getRole(decodeToken),
    };
    this.user.next(user);
    if (decodeToken['admin']) this.isAdmin.next(true);
  }

  private getPermissions(
    roles: string | string[] | undefined
  ): PermissionTypes[] {
    if (typeof roles === 'undefined') return [];
    if (typeof roles === 'string')
      return [PermissionTypes[roles as keyof typeof PermissionTypes]];
    return roles.map(x => PermissionTypes[x as keyof typeof PermissionTypes]);
  }

  private getRole(decodeToken: any): Roles {
    if (decodeToken['admin'] == 'true') return Roles.PageAdmin;
    if (decodeToken['owner'] == 'true') return Roles.OrganizationOwner;
    return Roles.User;
  }

  private clearUser() {
    this.user.next(null);
    this.isAdmin.next(false);
    this.organizationService.clearOrganization();
  }
}
