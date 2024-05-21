import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import intlTelInput from 'intl-tel-input';
import Swal from 'sweetalert2';
import { RegistrionAndLoginServiceService } from '../../Services/registrion-and-login-service.service';

@Component({
  selector: 'app-create-photographer',
  templateUrl: './create-photographer.component.html',
  styleUrl: './create-photographer.component.css',
})
export class CreatePhotographerComponent {
  application!: FormGroup;
  isLoading = false;
  subcriptionPlan: number = 0;
  totalImages: number = 0;
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
      Id: [localStorage.getItem('adminId')],
    });
    this.route.queryParams.subscribe((params) => {
      this.subcriptionPlan = params['subcriptionPlan'];
      this.totalImages = params['totalImages'];
    });
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
        const mobileNumber = iti.getNumber();
        this.application.get('mobileNumber')?.setValue(mobileNumber);
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
          const Id = this.application.get('Id')?.getRawValue();

          this.registrionAndLoginServiceService
            .addApplicationForm(Id, formData)
            .subscribe(
              (response) => {
                console.log(response,"success response");
                Swal.fire({
                  title: 'Data saved successfully!',
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false,
                }).then(() => {
                  this.isLoading = false;
                  this.application.reset();
                  // this.router.navigateByUrl("admin-homepage/listcandidates");
                });
              },
              (error) => {
                console.log('check the response' + error);
                let errorMessage = 'An unknown error occurred!';
                if (error.status === 404) {
                  errorMessage = 'Resource not found!';
                } else if (error.status === 500) {
                  errorMessage = 'Internal server error!';
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
}
