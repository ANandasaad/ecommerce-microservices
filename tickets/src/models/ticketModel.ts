import mongoose from "mongoose";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<any> {
  build(attrs: TicketAttrs): TicketDoc;
}
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

TicketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", TicketSchema);

export default Ticket;
