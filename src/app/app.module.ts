import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration/registration.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login/login.component';
import { AboutusComponent } from './aboutus/aboutus/aboutus.component';
import { HomepageComponent } from './homepage/homepage/homepage.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar/navbar.component';
import { FooterComponent } from './footer/footer/footer.component';
import { EventComponent } from './event/event/event.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PhotographerDashboardComponent } from './photographerDashboard/photographer-dashboard/photographer-dashboard.component';
import { CreatePhotographerComponent } from './createPhotographer/create-photographer/create-photographer.component';
import { PlansComponent } from './plans/plans.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { ForgotComponent } from './forgot/forgot/forgot.component';
import { OtpComponent } from './otp/otp/otp.component';
import { ChangepasswordComponent } from './changepassword/changepassword/changepassword.component';
import { PhotographersListComponent } from './createPhotographer/photographers-list/photographers-list.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ChangePasswordPhotographerComponent } from './changepassword/change-password-photographer/change-password-photographer.component';
import { ToastModule } from 'primeng/toast';
import { EventlistComponent } from './event/eventlist/eventlist.component';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventsimgessComponent } from './event/eventsimgess/eventsimgess.component';
import { NgxMasonryModule } from 'ngx-masonry';
import { Base64ConverterPipe } from './base64-converter.pipe';
import { WhatsappotpComponent } from './whatsappotp/whatsappotp.component';
import { PhotographerPlansComponent } from './plans/photographer-plans/photographer-plans.component';
import { MessagesModule } from 'primeng/messages';
import { PlanRegistrationComponent } from './plans/plan-registration/plan-registration.component';
import { WebcamModule } from 'ngx-webcam';
import { CameraComponent } from './camera/camera.component';
import { IamgeViewComponent } from './iamge-view/iamge-view.component';
import { RegistredUsersComponent } from './event/registred-users/registred-users.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    HomepageComponent,
    AboutusComponent,
    NavbarComponent,
    FooterComponent,
    EventComponent,
    DashboardComponent,
    PhotographerDashboardComponent,
    EventComponent,
    CreatePhotographerComponent,
    PlansComponent,
    ContactUsComponent,
    ForgotComponent,
    OtpComponent,
    ChangepasswordComponent,
    PhotographersListComponent,
    ChangePasswordPhotographerComponent,
    EventlistComponent,
    EventsimgessComponent,
    Base64ConverterPipe,
    WhatsappotpComponent,
    PhotographerPlansComponent,
    PlanRegistrationComponent,
    CameraComponent,
    IamgeViewComponent,
    RegistredUsersComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
		NgxIntlTelInputModule,
    MessagesModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbCollapseModule,
    NgbModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    NgxMasonryModule,
    DialogModule,
    WebcamModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
