"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useRequest from "../../hooks/use-request";

const TicketShow = () => {
  const router = useRouter();
  const { ticketId } = router.query;

  const [ticketData, setTicketData] = useState(null);

  const getTicket = async () => {
    try {
      const response = await axios.get(`/api/ticket/get-ticket/${ticketId}`);
      setTicketData(response.data.data);
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  useEffect(() => {
    if (ticketId) {
      getTicket();
    }
  }, [ticketId]); // Only call getTicket when ticketId is defined

  const { doRequest, errors } = useRequest({
    url: "/api/orders/create-order",
    method: "post",
    body: {
      ticketId: ticketData?.id,
    },
    onSuccess: (order) =>
      router.push("/orders/[orderId]", `/orders/${order.data.id}`),
  });

  if (!ticketData) {
    return <div>Loading...</div>; // You can show a loading state while fetching the data
  }

  return (
    <div>
      <h1>Ticket Show</h1>
      <p>{ticketData.title}</p>
      <p>{ticketData.price}</p>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  );
};

export default TicketShow;
