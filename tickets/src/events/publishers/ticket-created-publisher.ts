import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@akticketorg/commondir";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
