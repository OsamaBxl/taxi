import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SendEmailService {
  constructor(private http: HttpClient) {}

  sendEmail(EmailData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/send-message`, EmailData);
  }
}
