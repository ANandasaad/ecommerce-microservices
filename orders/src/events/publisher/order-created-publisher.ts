import { OrderCreatedEvent, Publisher, Subjects } from "@akticketorg/commondir";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
