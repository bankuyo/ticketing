import { Publisher, OrderCreatedEvent, Subjects } from '@bankuyotickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}