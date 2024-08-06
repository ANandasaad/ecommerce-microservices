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
    <div className="w-full">
      <form>
        <h1>Sign Up</h1>
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
        <button className="btn btn-primary" onClick={handleSubmit}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default signUp;
