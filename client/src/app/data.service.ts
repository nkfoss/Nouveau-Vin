import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators'
import { ErrorHandlerService } from './error.service';

export interface BrowseItem {
  value: string;
  numReviews?: number;
}

export interface ReviewItem {
  country: string;
  description: string;
  points: number;
  price: number;
  province: string;
  region: string;
  title: string;
  variety: string;
}

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  }

  fetchBrowseItems(browsingCriteria: string): Observable<BrowseItem[]> {
    return this.http
      .get<BrowseItem[]>(`http://localhost:3000/${browsingCriteria}`, { responseType: "json" })
  }

  fetchReviewItems(browsingCriteria: string, selectedCritera: string): Observable<any> {
    return this.http
      .get(`http://localhost:3000/${browsingCriteria}/${selectedCritera}`, { responseType: 'json' })
  }

  fetchAllVarieties(): Observable<BrowseItem[]> {
    return this.http
      .get<BrowseItem[]>(`http://localhost:3000/variety/all`, { responseType: 'json' })
  }

}
