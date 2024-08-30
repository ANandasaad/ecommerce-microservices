import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
const index = () => {
  const [tickets, setTickets] = useState([]);
  console.log(tickets);
  const ticketList = tickets?.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>${ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            View
          </Link>
        </td>
      </tr>
    );
  });

  const getTicket = async () => {
    try {
      const response = await axios.get("/api/ticket/get-tickets");

      setTickets(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      getTicket();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="my-5">
      <h1 className="text-3xl">Tickets</h1>
      <table className="table my-2">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};
export default index;
