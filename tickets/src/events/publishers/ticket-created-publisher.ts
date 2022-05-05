import { Publisher, Subjects, TicketCreatedEvent } from '@bankuyotickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}