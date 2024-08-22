import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@akticketorg/commondir";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
