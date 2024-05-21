import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { EventDetails } from '../event/event/event';

@Injectable({
  providedIn: 'root',
})
export class EventServiceService {
  constructor(private http: HttpClient) {}
  addEvent(Id: any, candidate: FormData): Observable<EventDetails> {
    return this.http.post<EventDetails>(
      `${environment.apiUrl}event/save/${Id}`,
      candidate,
      { responseType: 'json' }
    );
  }
  getalleventList(id: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}client/get/${id}`);
  }


  viewImagesSend(userId: any,eventId:any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}otp/compare/${userId}/${eventId}`);
  }
  updateDetails(id: any, formData: FormData): Observable<any> {
    return this.http.put(`${environment.apiUrl}event/update/${id}`, formData);
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}event/delete/${id}`, {
      responseType: 'text',
    });
  }

  UploadImges(Id: any, candidate: FormData): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}images/uploadAll/${Id}`,
      candidate,
      { responseType: 'json' }
    );
  }

  getallImagesByEvent(id: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}event/get/${id}`);
  }

  deleteimgaeList(id: any): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}images/delete/${id}`);
  }

  downloadQr(id: any,imageSize:any): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}event/${id}/qr-code/{imageSize}`, { responseType: 'blob' });
  }
}
