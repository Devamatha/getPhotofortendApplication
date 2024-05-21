import { Component } from '@angular/core';
import { EventServiceService } from '../../Services/event-service.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eventsimgess',
  templateUrl: './eventsimgess.component.html',
  styleUrl: './eventsimgess.component.css',
})
export class EventsimgessComponent {
  images$: Observable<string[]> = new Observable<string[]>();
  imagesData: { id: any; imageUrl: string; showOptions: boolean }[] = [];

  constructor(
    private route: ActivatedRoute,
    private eventServiceService: EventServiceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const eventId = params['id'];
      this.getallImagesByEvent(eventId);
    });
  }

  getallImagesByEvent(id: any): void {
    this.eventServiceService.getallImagesByEvent(id).subscribe((response) => {
      this.imagesData = response.images.map((image: any) => ({
        id: image.id,
        imageUrl: `data:image/jpeg;base64,${image.image}`,
      }));
      console.log('imagesData', this.imagesData);
    });
  }

  toggleOptions(imageData: any): void {
    imageData.showOptions = !imageData.showOptions;
  }

  removeImage(id: any): void {
    this.eventServiceService.deleteimgaeList(id).subscribe((response) => {
      console.log(response,"Data deleted successfully")
      Swal.fire({
        title:'Data Deleted Successfully',
        icon:'success',
        timer:2000,
        showConfirmButton:true
      });
      console.log('Image removed successfully');
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
      });
    }
    );
  }
}
