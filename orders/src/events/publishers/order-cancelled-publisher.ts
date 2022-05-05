import { Publisher, OrderCancelledEvent, Subjects } from "@bankuyotickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}