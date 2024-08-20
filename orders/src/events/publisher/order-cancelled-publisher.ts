import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@akticketorg/commondir";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
