import { Component } from '@angular/core';
import { RegistrionAndLoginServiceService } from '../../Services/registrion-and-login-service.service';
import { PhotographerDetails } from '../PhotographerDetails';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-photographers-list',
  templateUrl: './photographers-list.component.html',
  styleUrl: './photographers-list.component.css',
})
export class PhotographersListComponent {
  getdata: PhotographerDetails[] = [];
  searchText: string = '';
  selectAll: boolean = false;
  searchFullName: string = '';
  searchEmail: string = '';
  searhMobileNumber:string='';
  searhPassword:string='';
  searchDate:string='';
  searchtotalImages:string='';
  searchsubcriptionPlan:string='';
  editForm!: FormGroup;
  expandedRows: { [key: number]: boolean } = {};


  viewDataOfphotographer: PhotographerDetails[] = [];

  constructor(
    private registrationAndLoginService: RegistrionAndLoginServiceService,private formBuilder :FormBuilder
  ) {}
  ngOnInit(): void {
    this.getallPhotographerDetails();
    this.editForm = this.formBuilder.group({
      fullName: [null],
      email: [null],
      mobileNumber:[null],
      password:[null],
      totalImages:[null],
      subcriptionPlan:[null],
      registrationDate:[null],
      photographer_Id:[null]
    });
  }
  getallPhotographerDetails() {
    this.registrationAndLoginService
      .getallphotographerList()
      .subscribe((data) => {
        this.getdata = data.reverse();
        this.viewDataOfphotographer = this.getdata;
        console.log(this.getdata, 'Heloo');
      });

    this.filterFullName();
  }

  filterFullName() {
    this.viewDataOfphotographer = this.getdata.filter((getdata) =>
      getdata.fullName.toLowerCase().includes(this.searchFullName.toLowerCase())
    );
  }

  filtertotalImages(){
    this.viewDataOfphotographer = this.getdata.filter((getdata) =>
    getdata.totalImages.toString().toLowerCase().includes(this.searchtotalImages.toLowerCase())
  );
  }

  filtersubcriptionPlan(){
    this.viewDataOfphotographer = this.getdata.filter((getdata) =>
    getdata.subcriptionPlan.toString().toLowerCase().includes(this.searchsubcriptionPlan.toLowerCase())
  );
  }
  filterDate() {
    this.viewDataOfphotographer = this.getdata.filter((getdata) =>
      getdata.registrationDate.toString().toLowerCase().includes(this.searchDate.toLowerCase())
    );
  }
  filterEmail() {
    this.viewDataOfphotographer = this.getdata.filter((getdata) =>
      getdata.email.toLowerCase().includes(this.searchEmail.toLowerCase())
    );
  }

  filterPassword() {
    this.viewDataOfphotographer = this.getdata.filter((getdata) =>
      getdata.password.toLowerCase().includes(this.searhPassword.toLowerCase())
    );
  }
  filterMobileNumber() {
    this.viewDataOfphotographer = this.getdata.filter((getdata) =>
      getdata.mobileNumber.toString().toLowerCase().includes(this.searhMobileNumber.toLowerCase())
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
        getdata.fullName
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        getdata.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
        getdata.mobileNumber
          .toString()
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        getdata.password
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
          
        getdata.role.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  onRowEditInit(viewDataOfphotographer: PhotographerDetails) {
    console.log('Row edit initialized');
    this.editForm.patchValue({
      fullName: viewDataOfphotographer.fullName,
      email: viewDataOfphotographer.email,
      mobileNumber:viewDataOfphotographer.mobileNumber,
      password:viewDataOfphotographer.password,
      registrationDate:viewDataOfphotographer.registrationDate,
      totalImages:viewDataOfphotographer.totalImages,
      subcriptionPlan:viewDataOfphotographer.subcriptionPlan

      // Patch other form controls as needed
    });
  }
  onRowEditCancel(book: PhotographerDetails, id: number) {
    console.log('Row edit cancelled');
  }

  onRowEditSave(viewDataOfphotographer: PhotographerDetails) {
    const formData: FormData = new FormData();
    formData.append('fullName', this.editForm.get("fullName")?.getRawValue());
    formData.append('email', this.editForm.get("email")?.getRawValue());
    formData.append('mobileNumber', this.editForm.get("mobileNumber")?.getRawValue());
    formData.append('password', this.editForm.get("password")?.getRawValue());
    formData.append('registrationDate', this.editForm.get("registrationDate")?.getRawValue());
    formData.append('subcriptionPlan', this.editForm.get("subcriptionPlan")?.getRawValue());
    formData.append('totalImages', this.editForm.get("totalImages")?.getRawValue());
    const id = viewDataOfphotographer.photographer_Id;

    this.registrationAndLoginService.updateDetails(id,formData)
    .subscribe(
      response => {
        console.log('Data updated successfully', response);
        this.getallPhotographerDetails();
        Swal.fire({
          title: 'Data Edited saved successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          this.getallPhotographerDetails();

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
          this.getallPhotographerDetails();

        });
      }
    );
  }
  toggleSubItems(viewDataOfphotographer: PhotographerDetails) {
    this.expandedRows[viewDataOfphotographer.photographer_Id] = !this.expandedRows[viewDataOfphotographer.photographer_Id];
  }
  deletePhotographer(id: number) {
    this.registrationAndLoginService.deletePhotographer(id).subscribe(
      data => {
        Swal.fire({
          title: 'Photographer deleted successfully',
          icon: 'success',
          text: 'Photographer deleted successfully',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          this.getallPhotographerDetails();

        });
        console.log('Photographer deleted successfully');
        // Perform any other actions after successful deletion
      },
      error => {
        console.error('Error deleting photographer:', error);
        Swal.fire({
          title: 'internal Server Error !',
          icon: 'error',
          text: 'internal Server Error !',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          this.getallPhotographerDetails();

        });      }
    );
  }
}
