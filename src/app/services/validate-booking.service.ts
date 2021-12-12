import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ValidateBookingService {
  constructor(private http: HttpClient) {}

  validateBooking(reqBody: any): Observable<any> {
    return this.http.post('localhost:8000/api/createBooking', reqBody);
  }
}
