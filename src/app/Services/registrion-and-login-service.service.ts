import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { applicationForm } from '../registration/registration/applicationForm';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class RegistrionAndLoginServiceService {
  constructor(private http: HttpClient) {}
  //photographer Registration Method
  addApplicationForm(
    Id: any,
    candidate: FormData
  ): Observable<applicationForm> {
    return this.http.post<applicationForm>(
      `${environment.apiUrl}client/registration/${Id}`,
      candidate,
      { responseType: 'json' }
    );
  }
  // admin and Photographer login
  login(candidate: FormData): Observable<applicationForm> {
    return this.http.post<applicationForm>(
      `${environment.apiUrl}admin/login`,
      candidate,
      { responseType: 'json' }
    );
  }
  getallphotographerList(): Observable<any> {
    return this.http.get(`${environment.apiUrl}client/getall`);
  }
  //update photographer Details
  updateDetails(id: any, formData: FormData): Observable<any> {
    return this.http.put(`${environment.apiUrl}client/update/${id}`, formData);
  }

  updatePlanDetails(id: any, formData: FormData): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}client/UpgradeSubscriptionPlan/${id}`,
      formData
    );
  }

  //delete photographer Details
  deletePhotographer(id: any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}client/delete/${id}`, {
      responseType: 'text',
    });
  }

  //Change Password
  chnagePassword(id: any, formData: FormData): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}admin/changepassword/${id}`,
      formData
    );
  }

  faceCapturing(id: any, formData: FormData): Observable<any> {
    return this.http.put(`${environment.apiUrl}users/upload/${id}`, formData);
  }
  //forgot Password
  forgotPassword(formData: FormData): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}admin/forgotPassword`,
      formData
    );
  }
  //getId Method For Admin
  getbyId(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}admin/${id}`);
  }

  //getById MEthod For Phototgrapher
  getbyPhotographerId(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}client/get/${id}`);
  }
  getPhotographerId(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}client/image-count/${id}`);
  }

  smsSending(phoneNumber: string, eventId: any): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    const body = {
      number: phoneNumber,
    };

    return this.http.post(
      `${environment.apiUrl}users/envirollment/${eventId}`,
      body,
      { headers }
    );
  }
  validateOtp(id: any, formData: FormData): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}users/validating/${id}`,
      formData
    );
  }

  getallrigistredList(photographer_Id: any): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}event/listregisterUsers/${photographer_Id}`
    );
  }

  //send images to whatsapp number

  sendMessageTowhatsapp(eventId: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}images/compare/${eventId}`);
  }

  getbyIdSubscription(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}client/getById/${id}`);
  }
}
