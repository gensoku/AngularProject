import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
    private SERVER_URL = environment.apiUrl;
    constructor(private http: HttpClient) { }

    register(user: User) {
        return this.http.post(`${this.SERVER_URL}/account/register`, user);
    }

    delete(id: String) {
        return this.http.delete(`${this.SERVER_URL}/account/${id}`);
    }
}