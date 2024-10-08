import { useState } from "react";
import useRequest from "../../hooks/use-request";
import { useRouter } from "next/navigation";
const signUp = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const { doRequest, errors } = useRequest({
    url: "/api/users/signUp",
    method: "post",
    body: {
      email: userData.email,
      password: userData.password,
    },
    onSuccess: () => router.push("/"),
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
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
          <h1 className="">Sign Up</h1>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="form-control"
              value={userData?.email}
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
              value={userData?.password}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          {errors}
          <button className="btn btn-primary my-5" onClick={handleSubmit}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default signUp;
