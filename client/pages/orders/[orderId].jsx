import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
const OrderShow = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const router = useRouter();
  const { orderId } = router.query;

  const [orderData, setOrderData] = useState(null);

  const { doRequest, errors } = useRequest({
    url: "/api/payment/create-payment",
    method: "post",
    body: {
      orderId: orderData?.id,
    },
    onSuccess: (payment) => console.log(payment),
  });
  const getOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/get-order/${orderId}`);
      setOrderData(response.data.data);
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  useEffect(() => {
    if (orderId) {
      getOrder();
    }
  }, [orderId]); // Only call getTicket when ticketId is defined

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(orderData?.expiresAt) - new Date();

      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timeId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timeId);
    };
  }, [orderData]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <h1>Expire time</h1>
      <p>Time left to pay: {timeLeft} seconds</p>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51PquTbLOBdt7EPlRBLWzLp9XCjUZEApdO7XvEScGlGz7Hrdvaln02ROQ9XHWJKbhJj4gVjb0mmXCBcU0h5ZSCt1D00849BwilP"
        amount={orderData?.ticket?.price * 100}
      />
    </div>
  );
};

export default OrderShow;
