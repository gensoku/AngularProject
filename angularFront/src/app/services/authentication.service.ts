import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    // Ugly auth, server has to check for an existing user on each request and compare
    // further more without other auth strat, server will have to compare it twice on sensible endpoints
    login(username: string, password: string) {
      const authdata = window.btoa(username + ':' + password);
      return this.http.get<any>(`${environment.apiUrl}/login`, { headers: new HttpHeaders({'Authorization': 'basic ' + authdata})})
                .pipe(map(user => {
              user.authdata = authdata;
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
              return user;
          }));
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        //location.reload(true);
    }
}