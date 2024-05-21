export class EventDetails{
    eventDate!:Date;
    eventAddress!:string;
    eventName!:string;
    event_Id:any;
    qrCode:any;
    selected!: boolean;
    events: Event[];

  constructor() {
    this.events = [];
  }
  photographer_Id:any;
}
export interface Event {
    eventDate: Date;
    eventAddress: string;
    eventName: string;
    event_Id: any;
  }