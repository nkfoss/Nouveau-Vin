import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ErrorHandlerService } from './error.service';
import { BrowseItem } from './shared/browseitem.model';
import { ReviewItem } from './shared/reviewitem.model';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  reviewSubject = new Subject<any>();

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

  fetchRandoms(): Observable<any> {
    return this.http.get(`http://localhost:3000/countReviews`, { responseType: 'json' })
  }

  searchReviews(searchTerm: string) {
    this.http.get<ReviewItem[]>(`http://localhost:3000/search/${searchTerm}`, { responseType: 'json' }).subscribe(
      (reviews: ReviewItem[]) => {
        this.reviewSubject.next({
          reviews: reviews,
          searchTerm: searchTerm
        });
      }
    )
  }

}
