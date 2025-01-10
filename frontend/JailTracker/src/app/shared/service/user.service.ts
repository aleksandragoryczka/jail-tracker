import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../../models/user.model';
import { TokenService } from './token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginModel } from '../../models/login.model';
import { AuthenticatedResponse } from '../../models/authenticated-response.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PermissionTypes } from 'src/app/models/enums/permission-types.enum';
import { Roles } from 'src/app/models/enums/roles.enum';
import { throwError as _throwError } from 'rxjs';
import { UpdateUserDto } from 'src/app/models/update-user.model';

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

  // USED
  public getUser(id: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/User/${id}`);
  }

  // USED
  public login(loginModel: LoginModel): Observable<boolean> {
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

  // USED
  public updateUser(updateUserDto: UpdateUserDto) {
    return this.http.put<boolean>(
      `${environment.apiUrl}/User/UpdateUserForUser`,
      updateUserDto
    );
  }

  public hasPermission(permission: PermissionTypes): boolean {
    if (!this.isUserAuthenticated) return false;
    return this.user.value?.permissions?.includes(permission) || false;
  }

  public isUser(): boolean {
    if (!this.isUserAuthenticated) return false;
    return this.user.value?.role == Roles.User;
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
      permissions: this.getPermissions(decodeToken['permissions']),
      role: this.getRole(decodeToken),
    };
    this.user.next(user);
    if (decodeToken['admin'] == 'true') {
      this.isAdmin.next(true);
    }
  }

  private getPermissions(
    roles: string | string[] | undefined
  ): PermissionTypes[] {
    if (typeof roles === 'undefined') return [];
    if (typeof roles === 'string')
      return [PermissionTypes[roles as keyof typeof PermissionTypes]];
    return roles.map((x) => PermissionTypes[x as keyof typeof PermissionTypes]);
  }

  private getRole(decodeToken: any): Roles {
    if (decodeToken['guard'] == 'true') return Roles.Guard;
    if (decodeToken['admin'] == 'true') return Roles.PrisonAdmin;
    return Roles.User;
  }

  private clearUser() {
    this.user.next(null);
    this.isAdmin.next(false);
  }
}
