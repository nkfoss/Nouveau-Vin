import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  /**
   * 
   * @param operation - The operation that failed.
   * @param result - What type ought to be returned in the case of a failed operation. For example,
   * if we are fetching a User[] from the server, and fail, it's probably better to return an
   * empty User-array instead of an Error object or something else. 
   * 
   */
  // handleError<T>(operation = "operation", result?: T) {
  //   return (error: any): Observable<T> => {
  //     console.log(`${operation} failed: ${error.message}`)
  //     return of(result as T);
  //   };
  // }


}
