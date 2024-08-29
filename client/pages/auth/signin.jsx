import React, { useState } from "react";
import useRequest from "../../hooks/use-request";
import { useRouter } from "next/navigation";
const signin = () => {
  const router = useRouter();
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const { doRequest, errors } = useRequest({
    url: "/api/users/signIn",
    method: "post",
    body: {
      email: signInData.email,
      password: signInData.password,
    },
    onSuccess: () => router.push("/"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignInData({
      ...signInData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <div className="flex justify-center items-center w-full mt-10">
      <div className="shadow-md rounded-md mx-4">
        <form className="mx-5">
          <h1 className="">Sign In</h1>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="form-control"
              value={signInData?.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={signInData?.password}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          {errors}
          <button className="btn btn-primary my-5" onClick={handleSubmit}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default signin;
