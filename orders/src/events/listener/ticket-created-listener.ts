import { Listener, Subjects, TicketCreatedEvent } from "@akticketorg/commondir";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import Ticket from "../../models/ticket.model";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price, id } = data;

    const ticket = Ticket.build({
      title,
      price,
      id,
    });

    await ticket.save();

    msg.ack();
  }
}
