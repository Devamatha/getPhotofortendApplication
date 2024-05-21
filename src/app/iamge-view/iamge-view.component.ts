import { Component } from '@angular/core';
import { EventServiceService } from '../Services/event-service.service';
interface ImageObject {
  facePrintName: string;
  base64Image: string;
}
@Component({
  selector: 'app-iamge-view',
  templateUrl: './iamge-view.component.html',
  styleUrl: './iamge-view.component.css',
})
export class IamgeViewComponent {
  images: ImageObject[] = [];
  constructor(private eventServiceService: EventServiceService) {}
  ngOnInit() {
    this.getAllImages();
  }
  getAllImages() {
    this.eventServiceService.viewImagesSend(1, 1).subscribe(
      (data: any[]) => {
        console.log(data);
        // Parse the JSON string and extract image objects
        this.images = data.flatMap((item: string) => { // Specify the type of 'item' as string
          try {
            const parsedItem = JSON.parse(item) as ImageObject[]; // Cast the parsed item to ImageObject array
            return parsedItem.map((img: ImageObject) => ({ // Specify the type of 'img' as ImageObject
              facePrintName: img.facePrintName,
              base64Image: img.base64Image
            }));
          } catch (error) {
            console.error('Error parsing JSON:', error);
            return [];
          }
        });
        console.log('Images:', this.images);
      },
      (error) => {
        console.error('Error fetching images:', error);
      }
    );
  }
}

