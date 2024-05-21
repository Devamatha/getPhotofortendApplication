import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject, timestamp } from 'rxjs';
import Swal from 'sweetalert2';
import { RegistrionAndLoginServiceService } from '../Services/registrion-and-login-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css',
})
export class CameraComponent {
  faceCapturing!: FormGroup;
  
  stream: any = null;
  status: any = null;
  trigger: Subject<void> = new Subject();
  previewImage: string = '';
  btnLabel: string = 'Capture image';
  eventId!: number;

  get $trigger(): Observable<void> {
    return this.trigger.asObservable();
  }
  constructor(private formBuilder: FormBuilder, private registrionAndLoginServiceService: RegistrionAndLoginServiceService, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.faceCapturing = this.formBuilder.group({
      fullName: [null, Validators.required],
      image: [null, Validators.required],
      userId:[ localStorage.getItem('userId')]
    });
  
  }
  snapshot(event: WebcamImage) {
    console.log(event);
    this.previewImage = event.imageAsDataUrl;
    this.btnLabel = 'Re capture image'
  }
  // checkPermissions() {
  //   navigator.mediaDevices
  //     .getUserMedia({
  //       video: {
  //         width: 500,
  //         height: 500,
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res,"response");
  //       this.stream=res;
  //       this.status = 'My camera is accessing';
  //       this.btnLabel = 'Capture image';
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       if(err?.message === 'Permission denied') {
  //         console.log("hello world")
  //         this.status = 'Permission denied please try again by approving the access';
  //       } else {
  //         this.status = 'You may not having camera system, Please try again ...';
  //       }

  //     });
  // }
  captureImage() {
    this.trigger.next();
  }

  proceed() {
    console.log(this.previewImage);
  }
  onSubmit() {
this. captureImage();
    const formData: FormData = new FormData();
    formData.append('fullName', this.faceCapturing.get('fullName')?.getRawValue());

    const dataURLtoBlob = (dataURL: string) => {
      const byteString = atob(dataURL.split(',')[1]);
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
  };

  // Convert data URL to Blob
  const imageBlob = dataURLtoBlob(this.previewImage);

  // Create a File object from Blob
  const imageFile = new File([imageBlob], 'image.jpeg', { type: 'image/jpeg' });

  // Append the image file to the FormData
  formData.append('image', imageFile);
    //formData.append('image', this.previewImage);
    const Id =this.faceCapturing.get('userId')?.getRawValue();

    this.registrionAndLoginServiceService.faceCapturing(Id, formData).subscribe(
      (response) => {
        console.log(response);
        Swal.fire({
          title: 'Data saved successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
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
