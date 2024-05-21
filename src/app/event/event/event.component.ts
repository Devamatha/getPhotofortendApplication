import { Component } from '@angular/core';
import { RegistrionAndLoginServiceService } from '../../Services/registrion-and-login-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EventServiceService } from '../../Services/event-service.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {

  eventForm!: FormGroup;
  isLoading = false;
  minDate?:string;

  constructor(
    private eventServiceService: EventServiceService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

    const today=new Date();
  this.minDate=today.toISOString().split('T')[0];
  }
  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      eventName: [null, Validators.required],
      eventAddress: [null, Validators.required],
      eventDate: [null, Validators.required],
      Id: [localStorage.getItem('photographer_Id')]
    });

  }
  onSubmit() {
    if (this.eventForm.valid) {
      Swal.fire({
        icon: 'success',
        title: 'Are you surely want to create  the Event ?',
        text: 'Are you surely want to create  the Event ?',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          this.isLoading = true;

          const formData: FormData = new FormData();

          formData.append('eventName', this.eventForm.get('eventName')?.getRawValue());

          formData.append(
            'eventDate',
            this.eventForm.get('eventDate')?.getRawValue()
          );
          formData.append(
            'eventAddress',
            this.eventForm.get('eventAddress')?.getRawValue()
          );
          const Id =this.eventForm.get('Id')?.getRawValue();

          this.eventServiceService
            .addEvent(Id,formData)
            .subscribe(
              (response) => {
                console.log(response);
                Swal.fire({
                  title: 'Event Created Successfully!',
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false,
                }).then(() => {
                  this.isLoading = false;
                  this.eventForm.reset();
                  // this.router.navigateByUrl("admin-homepage/listcandidates");
                });
              },
              (error) => {
                // Error callback
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

    for (let controlName in this.eventForm.controls) {
      let control = this.eventForm.get(controlName);
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