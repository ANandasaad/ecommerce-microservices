import axios from "axios";
import React, { useEffect, useState } from "react";

const index = () => {
  const [tickets, setTickets] = useState();
  console.log(tickets);
  const ticketList = tickets?.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>${ticket.price}</td>
      </tr>
    );
  });

  useEffect(async () => {
    try {
      const response = await axios.get("/api/ticket/get-tickets");

      setTickets(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};
export default index;
