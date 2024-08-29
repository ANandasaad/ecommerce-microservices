import React, { useState } from "react";
import useRequest from "../../hooks/use-request";
import { useRouter } from "next/navigation";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const router = useRouter();

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };
  const { doRequest, errors } = useRequest({
    url: "/api/ticket/create-ticket",
    method: "post",
    body: {
      title: title,
      price: price,
    },
    onSuccess: () => router.push("/"),
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };
  return (
    <div>
      <h1>Create a Ticket</h1>
      <form>
        <div className="form-group">
          <label>Ticket</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            onBlur={onBlur}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        {errors}
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewTicket;
