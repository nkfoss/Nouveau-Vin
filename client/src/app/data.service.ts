import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators'
import { ErrorHandlerService } from './error.service';

export interface User {
  id: number;
  name: string;
  fav_color: string;
  isAdmin: boolean
}

@Injectable({
  providedIn: 'root'
})

export class DataService {

  user: User = {
    id: 1,
    name: 'Bandit',
    fav_color: 'green',
    isAdmin: true
  }

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  }

  onNavigate(target: string): Observable<User[]> {
    return this.http
      .get<User[]>("http://localhost:3000/", { responseType: "json" })
  }

  postUser(user: User): Observable<any> {
    return this.http
      .post<User>(`this.localhost:3000/createUser`, user, this.httpOptions)
  }
}
