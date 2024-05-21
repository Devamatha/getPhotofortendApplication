import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { RegistrionAndLoginServiceService } from '../Services/registrion-and-login-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-whatsappotp',
  templateUrl: './whatsappotp.component.html',
  styleUrl: './whatsappotp.component.css',
})
export class WhatsappotpComponent {
  whatsauthetication!: FormGroup;
  eventId!: number;
  otp: boolean = false;
  verify: boolean = true;
  constructor(private router: Router, private http: HttpClient, private registrionAndLoginServiceService: RegistrionAndLoginServiceService, private formBuilder: FormBuilder, private route: ActivatedRoute,) {

  }

  ngOnInit(): void {
    this.whatsauthetication = this.formBuilder.group({
      number: [null, Validators.required],
      body: [null, Validators.required]

    });
    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
      console.log('eventId' + this.eventId);
      console.log('params: ', params);
    })
  }
  number: string = '';
  statusmessage: any;

  async verifyWhatsAppNumber(number: string) {
    const url =
      'https://whatsapp-number-validator3.p.rapidapi.com/WhatsappNumberHasItWithToken';
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'f5c2beb046msh8df3c25268b0868p15d9d9jsnb95e09cbeb5c',
      'X-RapidAPI-Host': 'whatsapp-number-validator3.p.rapidapi.com',
    });

    const body = { phone_number: this.whatsauthetication.get('number')?.value };

    try {
      const response = await this.http
        .post(url, body, { headers, responseType: 'text' })
        .toPromise();
      console.log(response, "response");
      const parsedResponse = response ? JSON.parse(response) : null;

      console.log(parsedResponse, "parsedResponse");

      if (parsedResponse && parsedResponse.status === 'valid') {
        // Swal.fire({
        //   title: 'Success!',
        //   text: 'Valid WhatsApp Number',
        //   icon: 'success'
        // });
        this.smsMethod()
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Invalid WhatsApp Number',
          icon: 'error'
        });
      }

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while verifying the WhatsApp number',
        icon: 'error'
      });
    }
  }

  onVerifyButtonClick(number: string) {
    this.verifyWhatsAppNumber(number);
  }

  smsMethod() {
    const number = this.whatsauthetication.get('number')?.value;
    const formattedNumber = number.startsWith('91') ? number.substring(2) : number;
    const formData: FormData = new FormData();
    formData.append('number', formattedNumber);

    console.log(formattedNumber + "formattedNumber");

    this.registrionAndLoginServiceService.smsSending(formattedNumber, this.eventId).subscribe(
      (response) => {
        console.log(response);
        Swal.fire({
          title: 'otp send succesfully  '+formattedNumber,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          this.otp = true;
          this.verify = false;
          //this.router.navigateByUrl('/camera');
        })
      },
      (error) => {
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while sending the request',
          icon: 'error',
        });
      }
    )
  }


  verifyOtp() {
    const formData: FormData = new FormData();
    const number = this.whatsauthetication.get('number')?.value;

    const formattedNumber = number.startsWith('91') ? number.substring(2) : number;
    formData.append('number', formattedNumber);

    formData.append(
      'body',
      this.whatsauthetication.get('body')?.getRawValue()
    );
    this.registrionAndLoginServiceService.validateOtp(this.eventId, formData).subscribe(
      (response) => {
        console.log(response);
        localStorage.setItem('userId',response.userId);
        
        Swal.fire({
          title: 'please enter your details',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {

          this.router.navigateByUrl('/camera');
        })
      },
      (error) => {
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while sending the request',
          icon: 'error',
        });
      }
    )
  }
}
