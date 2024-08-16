import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@akticketorg/commondir";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
