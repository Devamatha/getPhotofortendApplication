import { Component } from '@angular/core';
import { RegistrionAndLoginServiceService } from '../../Services/registrion-and-login-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.css',
})
export class ChangepasswordComponent {
  getallData: any;
  changePasswordForm!: FormGroup;
  constructor(
    private registrionAndLoginServiceService: RegistrionAndLoginServiceService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.changePassword();
    this.changePasswordForm = this.formBuilder.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
      Id: [null],
    });
  }

  
  
  changePassword() {
    
    this.registrionAndLoginServiceService
      .getbyId(localStorage.getItem('adminId'))
      .subscribe((response) => {
        this.getallData = response;
        console.log(this.getallData.password);
        this.changePasswordForm.patchValue({
          password: this.getallData.password,
        });
      });
  }
  submit() {
    if (this.changePasswordForm.valid) {
      Swal.fire({
        title: 'Are you surely want to change the password',
        text: 'Are you surely want to change the password',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          const formData: FormData = new FormData();
          formData.append(
            'password',
            this.changePasswordForm.get('password')?.getRawValue()
          );
          formData.append(
            'confirmPassword',
            this.changePasswordForm.get('confirmPassword')?.getRawValue()
          );
          let adminId = localStorage.getItem('adminId');
          this.changePasswordForm.get('Id')?.setValue(adminId);

          this.registrionAndLoginServiceService
            .chnagePassword(adminId, formData)
            .subscribe((result) => {
              Swal.fire({
                title: 'Password updated  successfully!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
              })

            },
            (error) => {
              Swal.fire({
                title: 'internal Server Error!',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
              })
            }
            );
        } else if (result.isDenied) {
          console.log('result is denied');
        }
      });
    } else {
      this.showValidationError();
    }
  }
  showValidationError() {
    let missingFields = '';

    for (let controlName in this.changePasswordForm.controls) {
      let control = this.changePasswordForm.get(controlName);
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
