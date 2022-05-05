import { Publisher, Subjects, TicketUpdatedEvent } from '@bankuyotickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
