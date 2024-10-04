export interface EventData {
  id: string;
  title: string;
  start: Date;
  end: Date;
  Event_Discription: string;
  type: string;
  hrId: string;
  isEnabled: boolean;
}

export interface RawEventData {
  _id: string;
  Event_Name: string;
  Event_Start: string;
  Event_End: string;
  Event_Discription: string;
  Event_Type: string;
  hrId: string;
  isEnabled: boolean;
}
