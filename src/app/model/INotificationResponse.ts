export interface INotificationResponse {
  messageType: string;
  message: string;
  receiverEmail: string;
  //additionalInfo: any;
  senderEmail: string;
  patientCaseId: number;
  roomName: string;
  patientId: string;
  callingEnvironment: string;
}
