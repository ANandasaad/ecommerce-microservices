import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@akticketorg/commondir";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
