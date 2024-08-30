import axios from "axios";
import React, { useEffect, useState } from "react";

const OrderIndex = () => {
  const [order, setOrder] = useState([]);
  const getOrders = async () => {
    try {
      const response = await axios("/api/orders/get-orders");
      console.log(response.data.data);
      setOrder(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);
  const list = order?.map((order) => {
    return (
      <li key={order.id}>
        {order.ticket.title}:{order.status}
      </li>
    );
  });

  return (
    <div>
      <h1 className=" tex-3xl font-bold my-3">Order List</h1>
      <ul>{list}</ul>
    </div>
  );
};

export default OrderIndex;
