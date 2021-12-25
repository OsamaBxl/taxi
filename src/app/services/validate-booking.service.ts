import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { BOOkingData } from '../interfaces/booking-data';

@Injectable({
  providedIn: 'root',
})
export class ValidateBookingService {
  constructor(private http: HttpClient) {}

  createBooking(newBooking: BOOkingData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/createBooking`, newBooking);
  }

  getplaces(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/getAllDestinations`);
  }

  getPrice(p1: string, p2: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/getPrice`, {
      pick_from: p1,
      pick_to: p2,
    });
  }

  checkout(price: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get-checkout-id/${price}`);
  }

  getDistance(from: string, to: string) {
    return this.http.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${from}&destinations=&{to}&units=imperial&key=${environment.GoogleapiKey}`
    );
  }
}
