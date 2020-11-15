import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ApiService } from 'src/app/api/api.service';
import { catchError, tap } from 'rxjs/operators';
import {environment} from '../../../environments/environment';

const JWT_LOCALSTORE_KEY = 'jwt';
const USER_LOCALSTORE_KEY = 'user';
const API_HOST_USER = environment.apiHostUser;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  constructor( private api: ApiService ) {
    this.initToken();
  }

  initToken() {
    const token = localStorage.getItem(JWT_LOCALSTORE_KEY);
    const user = <User> JSON.parse(localStorage.getItem(USER_LOCALSTORE_KEY));
    if (token && user) {
      this.setTokenAndUser(token, user);
    }
  }

  setTokenAndUser(token: string, user: User) {
    localStorage.setItem(JWT_LOCALSTORE_KEY, token);
    localStorage.setItem(USER_LOCALSTORE_KEY, JSON.stringify(user));
    this.api.setAuthToken(token);
    this.currentUser$.next(user);
  }

  async login(email: string, password: string): Promise<any> {
    const url = `${API_HOST_USER}/users/auth/login`;
    return this.api.post(url,
              {email: email, password: password})
              .then((res) => {
                this.setTokenAndUser(res.token, res.user);
                return res;
              })
              .catch((e) => { throw e; });
      // return user !== undefined;
  }

  logout(): boolean {
    this.setTokenAndUser(null, null);
    return true;
  }

  register(user: User, password: string): Promise<any> {
    const url = `${API_HOST_USER}/users/auth/`;
    return this.api.post(url,
              {email: user.email, password: password})
              .then((res) => {
                this.setTokenAndUser(res.token, res.user);
                return res;
              })
              .catch((e) => { throw e; });
  }
}
