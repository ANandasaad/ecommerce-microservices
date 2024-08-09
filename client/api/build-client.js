import axios from "axios";

import React from "react";

const buildClient = ({ req }) => {
  //   if (typeof window === "undefined") {
  //     return axios.create({
  //       baseURL: "http://10-1-0-238.ingress-nginx.pod.cluster.local",
  //       headers: req.headers,
  //     });
  //   } else {
  //     return axios.create({
  //       baseURL: "/",
  //     });
  //   }
};

export default buildClient;
