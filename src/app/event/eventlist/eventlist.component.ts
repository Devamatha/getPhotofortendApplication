import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EventServiceService } from '../../Services/event-service.service';
import { EventDetails } from '../event/event';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrionAndLoginServiceService } from '../../Services/registrion-and-login-service.service';

@Component({
  selector: 'app-eventlist',
  templateUrl: './eventlist.component.html',
  styleUrl: './eventlist.component.css',
})
export class EventlistComponent {
  selectedFile: File | null = null;
  isContentVisible: boolean = true;
  displayDialog: boolean = false;
  clickedRowIndex!: number;
  QrCodeVisible: boolean = true;
  getdata: EventDetails[] = [];
  viewDataOfphotographer: EventDetails[] = [];
  uploading: boolean = false;
  responseData: any;
  isLoading = false;
  searchText: string = '';
  selectAll: boolean = false;
  searcheventName: string = '';
  searcheventAddress: string = '';
  searhMobileNumber: string = '';
  searhPassword: string = '';
  searchDate: string = '';
  editForm!: FormGroup;
  uploadphotos!: FormGroup;
  expandedRows: { [key: number]: boolean } = {};
  showOptions: boolean = false;

  constructor(
    private eventServiceService: EventServiceService,
    private formBuilder: FormBuilder,
    private registrionAndLoginServiceService: RegistrionAndLoginServiceService,

    private router: Router
  ) {}
  ngOnInit(): void {
    this.getEventData();
    // this.getallPhotographerDetails();
this.getCount();
    this.editForm = this.formBuilder.group({
      eventName: [null],
      eventAddress: [null],
      eventDate: [null],
      event_Id: [null],
    });

    this.uploadphotos = this.formBuilder.group({
      image: [null, Validators.required],
      event_Id: [null],
    });
  }
  getCount() {
    this.registrionAndLoginServiceService
      .getPhotographerId(localStorage.getItem('photographer_Id'))
      .subscribe(
        (data: any) => {
          this.responseData = data;
          this.getEventData();
          console.log(data, 'success');
        },

        (error) => {
          console.log(error, 'failure');
        }
      );
  }
  getEventData() {
    this.eventServiceService
      .getalleventList(localStorage.getItem('photographer_Id'))
      .subscribe(
        (data: any) => {
          console.log(data);
          this.getdata = data.event.map((event: any) => ({
            eventDate: event.eventDate,
            eventAddress: event.eventAddress,
            eventName: event.eventName,
            event_Id: event.event_Id,
            selected: false,
            qrCode: event.qrCode,
            events: [],
          }));
          console.log(this.getdata, 'Hloo world');
          this.viewDataOfphotographer = this.getdata.reverse();
          console.log(this.viewDataOfphotographer + 'view all data');
          this.filtereventName();
        },
        (error) => {
          console.error(error, 'error message');
        }
      );
  }

  filtereventName() {
    this.viewDataOfphotographer = this.getdata.filter((getdata) =>
      getdata.eventName
        .toLowerCase()
        .includes(this.searcheventName.toLowerCase())
    );
  }
  filterDate() {
    this.viewDataOfphotographer = this.getdata.filter((getdata) =>
      getdata.eventDate
        .toString()
        .toLowerCase()
        .includes(this.searchDate.toLowerCase())
    );
  }
  filtereventAddress() {
    this.viewDataOfphotographer = this.getdata.filter((getdata) =>
      getdata.eventAddress
        .toLowerCase()
        .includes(this.searcheventAddress.toLowerCase())
    );
  }

  toggleSelectAll() {
    this.viewDataOfphotographer.forEach(
      (getdata) => (getdata.selected = this.selectAll)
    );
  }
  overAllSerach() {
    this.viewDataOfphotographer = this.getdata.filter(
      (getdata) =>
        getdata.eventName
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        getdata.eventAddress
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        getdata.eventDate
          .toString()
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
    );
  }

  onRowEditInit(viewDataOfphotographer: EventDetails) {
    console.log('Row edit initialized');
    this.editForm.patchValue({
      eventName: viewDataOfphotographer.eventName,
      eventAddress: viewDataOfphotographer.eventAddress,
      eventDate: viewDataOfphotographer.eventDate,

      // Patch other form controls as needed
    });
  }
  onRowEditCancel(book: EventDetails, id: number) {
    console.log('Row edit cancelled');
  }

  onRowEditSave(viewDataOfphotographer: EventDetails) {
    const formData: FormData = new FormData();
    formData.append('eventName', this.editForm.get('eventName')?.getRawValue());
    formData.append(
      'eventAddress',
      this.editForm.get('eventAddress')?.getRawValue()
    );
    formData.append('eventDate', this.editForm.get('eventDate')?.getRawValue());

    const id = viewDataOfphotographer.event_Id;

    this.eventServiceService.updateDetails(id, formData).subscribe(
      (response) => {
        console.log('Data updated successfully', response);
        this.getEventData();
        Swal.fire({
          title: 'Data Edited saved successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          this.getEventData();
        });
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
        }).then(() => {
          this.getEventData();
        });
      }
    );
  }
  toggleSubItems(viewDataOfphotographer: EventDetails) {
    this.expandedRows[viewDataOfphotographer.event_Id] =
      !this.expandedRows[viewDataOfphotographer.event_Id];
  }
  deletePhotographer(id: number) {
    this.eventServiceService.delete(id).subscribe(
      (data) => {
        Swal.fire({
          title: 'Photographer deleted successfully',
          icon: 'success',
          text: 'Photographer deleted successfully',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          this.getEventData();
        });
        console.log('Photographer deleted successfully');
      },
      (error) => {
        console.error('Error deleting photographer:', error);
        Swal.fire({
          title: 'internal Server Error !',
          icon: 'error',
          text: 'internal Server Error !',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          this.getEventData();
        });
      }
    );
  }

  // onFileSelected(event: any) {
  //   this.selectedFile = event.target.files[0];
  // }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const allowedTypes = ['.png', '.jpg', '.jpeg'];
      const fileExtension = file.name.slice(
        ((file.name.lastIndexOf('.') - 1) >>> 0) + 2
      );

      if (!allowedTypes.includes('.' + fileExtension)) {
        this.uploadphotos.get('image')?.setErrors({ invalidType: true });
        this.selectedFile = null; // reset the selected file
      } else {
        this.selectedFile = file;
        this.uploadphotos.get('image')?.setErrors(null);
        // Continue with your file processing logic (e.g., upload or read the file)
      }
    }
  }
  uploadPhotoss(id: number) {
    const formData: FormData = new FormData();
    console.log(this.selectedFile, 'Hlojdkfshjk');
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    const eventDetails = this.getdata.find(
      (event: EventDetails) => event.event_Id === id
    );
    if (!eventDetails) {
      console.error('Event with provided ID not found');
      return;
    }

    const eventId = eventDetails.event_Id;

    this.eventServiceService.UploadImges(eventId, formData).subscribe(
      (response) => {
        console.log('Data updated successfully', response);
        console.log(response, 'success response');
        Swal.fire({
          title: 'image is uploaded!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        this.getEventData();
        this.getCount();
      },
      (error) => {
        let errorMessage = 'An unknown error occurred!';
        console.log(error.error, 'error response');

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
  
  onClickUploadIcon(index: number) {
    this.clickedRowIndex = index;

    this.uploading = true;
    console.log('uploading method' + this.uploading);
  }

  


  toggleContentVisibility(): void {
    this.isContentVisible = !this.isContentVisible;
  }

  showDialog() {
    this.displayDialog = true;
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }
  downloadQr(id: number,imageSize: string) {
    this.eventServiceService.downloadQr(id,imageSize).subscribe(
      (response) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qrCode.png';
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        console.log('Data updated successfully', response);
        console.log(response, 'success response');
        this.QrCodeVisible=false;
        Swal.fire({
          title: 'QR downlaoded!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });

        this.displayDialog = false;
      },
      (error) => {
        let errorMessage = 'An unknown error occurred!';
        console.log(error.error, 'error response');

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

  finalSubmit(eventId:any){
    this.isLoading = true;

    this.registrionAndLoginServiceService
      .sendMessageTowhatsapp( eventId)
      .subscribe(
        (data) => {
          Swal.fire({
            title: 'Data saved successfully!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            this.isLoading = false;
          });
        },
        (error) => {
          let errorMessage = 'An unknown error occurred!';
          if (error.status === 404) {
            errorMessage = 'Resource not found!';
          } else if (error.status === 500) {
            errorMessage = 'Internal server error!';
          } else if (error.message) {
            errorMessage = error.message;
          }
          this.isLoading = false;
        }
      );
  }
 
}
