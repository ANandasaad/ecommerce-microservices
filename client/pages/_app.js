import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import Header from "../compontents/header";
import axios from "axios";
export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const getCurrentUser = async () => {
    try {
      const response = await axios.get("/api/users/current-user");
      setUser(response.data.data.currentUser);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <div className="container">
      <Header user={user} />
      <Component {...pageProps} />
    </div>
  );
}
