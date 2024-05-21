import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RegistrionAndLoginServiceService } from '../../Services/registrion-and-login-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
declare var Razorpay: any;

@Component({
  selector: 'app-photographer-plans',
  templateUrl: './photographer-plans.component.html',
  styleUrl: './photographer-plans.component.css',
})
export class PhotographerPlansComponent {
  upgradePlan!: FormGroup;
  constructor(
    private http: HttpClient,
    private registrionAndLoginServiceService: RegistrionAndLoginServiceService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.getByIdSubsscrption();
    this.upgradePlan = this.formBuilder.group({
      totalImagesAllowed: [null],
      amount: [null],
      planType: [null],
    });
  }
  upgradePlans(subcriptionPlan: number, totalImages: number, planType: string) {
    if (!isNaN(subcriptionPlan) && !isNaN(totalImages)) {
      console.log('subcriptionPlan' + subcriptionPlan);
      console.log('totalImages' + totalImages);
      this.upgradePlan.patchValue({
        amount: subcriptionPlan,
        totalImagesAllowed: totalImages,
        planType: planType,
      });
      this.OnSubmit();
    } else {
      console.error('Invalid subscription plan or total images.');
    }
  }

  getByIdSubsscrption() {
    this.registrionAndLoginServiceService
      .getbyIdSubscription(localStorage.getItem('photographer_Id'))
      .subscribe((response) => {
        console.log(response, 'response');
        localStorage.setItem('subscriptionId', response);
      });
  }
  OnSubmit() {
    const formData: FormData = new FormData();
    formData.append(
      'totalImagesAllowed',
      this.upgradePlan.get('totalImagesAllowed')?.getRawValue()
    );
    formData.append(
      'amount',
      (this.upgradePlan.get('amount')?.getRawValue() || 0).toString()
    );

    formData.append(
      'planType',
      (this.upgradePlan.get('planType')?.getRawValue() || 0).toString()
    );
    this.registrionAndLoginServiceService
      .updatePlanDetails(localStorage.getItem('subscriptionId'), formData)
      .subscribe(
        (response) => {
          console.log('Data updated successfully', response);
          // Swal.fire({
          //   title: 'plan Updated  successfully!',
          //   icon: 'success',
          //   timer: 2000,
          //   showConfirmButton: false,
          // });

          this.payNow();
          localStorage.removeItem('subscriptionId');
        },
        (error) => {
          let errorMessage = 'An unknown error occurred!';

          if (error.message) {
            errorMessage = error.error;
          }
          Swal.fire({
            title: 'internal Server Error !',
            icon: 'error',
            text: errorMessage,
            timer: 2000,
            showConfirmButton: false,
          });
        }
      );
  }

  payNow() {
    const RozarpayOptions = {
      description: 'Sample Razorpay demo',
      currency: 'INR',
      amount: this.upgradePlan.get('amount')?.getRawValue() * 100,
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
