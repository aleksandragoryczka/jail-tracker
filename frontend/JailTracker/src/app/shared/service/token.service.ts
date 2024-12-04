import { Injectable } from '@angular/core';
import { AuthenticatedResponse } from '../../models/authenticated-response.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private static tokenFieldName = 'access_token';

  public setToken(authResponse: AuthenticatedResponse): void {
    localStorage.setItem(TokenService.tokenFieldName, authResponse.token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TokenService.tokenFieldName);
  }

  public clearToken(): void {
    localStorage.removeItem(TokenService.tokenFieldName);
  }
}
