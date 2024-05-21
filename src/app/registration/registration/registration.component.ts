import { Component } from '@angular/core';
import { RegistrionAndLoginServiceService } from '../../Services/registrion-and-login-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import intlTelInput from 'intl-tel-input';
import Swal from 'sweetalert2';
declare var Razorpay: any;
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  application!: FormGroup;
  isLoading = false;
  subcriptionPlan: number = 0;
  totalImages: number = 0;
  planType: string ='';
  constructor(
    private registrionAndLoginServiceService: RegistrionAndLoginServiceService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.application = this.formBuilder.group({
      fullName: [null, Validators.required],
      email: [null, Validators.required],
      mobileNumber: [null, Validators.required],
      Id: [1],
    });
    this.route.queryParams.subscribe((params) => {
      this.subcriptionPlan = params['subcriptionPlan'];
      this.totalImages = params['totalImages'];
      this.planType = params['planType'];
    });

    this.loadIntlTelInput();
  }

  loadIntlTelInput() {
    const inputElement = document.querySelector(
      '#mobileNumber'
    ) as HTMLInputElement;

    if (inputElement) {
      const iti = intlTelInput(inputElement, {
        initialCountry: 'in',
        separateDialCode: true,
        utilsScript:
          'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
      });

      inputElement.addEventListener('input', () => {
        this.application.get('mobileNumber')?.setValue(iti.getNumber());
      });
    }
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onSubmit() {
    if (this.application.valid) {
      Swal.fire({
        icon: 'success',
        title: 'Are you surely want to submit the Details ?',
        text: 'Are you surely want to submit the Details ?',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          this.isLoading = true;

          const formData: FormData = new FormData();

          formData.append(
            'fullName',
            this.application.get('fullName')?.getRawValue()
          );

          formData.append(
            'mobileNumber',
            this.application.get('mobileNumber')?.getRawValue()
          );
          formData.append(
            'email',
            this.application.get('email')?.getRawValue()
          );
          formData.append('subcriptionPlan', this.subcriptionPlan.toString());
          formData.append('totalImages', this.totalImages.toString());
          formData.append('planType', this.planType);

          const Id = this.application.get('Id')?.getRawValue();

          this.registrionAndLoginServiceService
            .addApplicationForm(1, formData)
            .subscribe(
              (response) => {
                this.isLoading = false;
                this.application.reset();

                console.log(response);
               this.payNow();
              },
              (error) => {
                let errorMessage = 'An unknown error occurred!';
                if (error.status === 400) {
                  errorMessage = 'Resource not found!';
                } else if (error.status === 500) {
                  errorMessage = 'please try again later..';
                } else if (error.message) {
                  errorMessage = error.message;
                }
                this.isLoading = false;
                Swal.fire({
                  title: 'Data saved successfully!',
                  icon: 'success',
                });
              }
            );
        } else if (result.isDenied) {
          this.isLoading = false;
        }
      });
    } else {
      this.showValidationError();
    }
  }

  showValidationError() {
    let missingFields = '';

    for (let controlName in this.application.controls) {
      let control = this.application.get(controlName);
      if (control?.invalid) {
        const fieldName =
          controlName.charAt(0).toUpperCase() + controlName.slice(1);
        missingFields += `<span style="color: red;">${fieldName}</span>, `;
      }
    }

    missingFields = missingFields.slice(0, -2);

    Swal.fire({
      icon: 'error',
      text: 'Missing Fields',
      html: `Please enter valid details for the following fields: ${missingFields}`,
    });
  }
  navigateToLogin() {
    this.router.navigate(['/login']);
  }



  payNow() {
    const RozarpayOptions = {
      description: 'Sample Razorpay demo',
      currency: 'INR',
      amount: this.subcriptionPlan * 100,
      name: 'Get Photo Application',
      key: 'rzp_test_r1edyBnIL541lX',
      image: 'https://i.imgur.com/FApqk3D.jpeg',
      prefill: {
        name: 'Gaurav Kumar',
        email: 'gaurav.kumar@example.com',
        contact: '+917416244195',
      },
      theme: {
        color: '#6466e3',
      },
      modal: {
        ondismiss: () => {
          console.log('dismissed');
        },
      },
    };

    const successCallback = (paymentid: any) => {
      console.log(paymentid);
    };

    const failureCallback = (e: any) => {
      console.log(e);
    };

    Razorpay.open(RozarpayOptions, successCallback, failureCallback);
  }
}
