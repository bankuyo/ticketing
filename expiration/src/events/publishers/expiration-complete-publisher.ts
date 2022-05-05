import { Subjects, Publisher, ExpirationCompleteEvent } from "@bankuyotickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpiratioinComplete = Subjects.ExpiratioinComplete
}