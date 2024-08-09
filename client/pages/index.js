import axios from "axios";
import React from "react";

const index = ({ currentUser }) => {
  console.log(currentUser);
  return <div>Landing Page</div>;
};

index.getInitialProps = async ({ req }) => {
  if (typeof window === "undefined") {
    // // we on server
    // const response = await axios.get(
    //   "http://auth-srv.default.svc.cluster.local/api/users/current-user",
    //   {
    //     headers: {
    //       Host: "ticketing.dev",
    //     },
    //   }
    // );
    // return response.data.data;
  } else {
    // we on browser
    const response = await axios.get("/api/users/current-user");
    console.log(response);
    return response.data.data;
  }
  return {};
};

export default index;
