// import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  loaderError,
  openLoader,
  signInSuccess,
} from "../redux/employee/employeeSlice";
import OAuth from "./components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.employee);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(openLoader());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      //only added for fetch method, as sometimes the error is returned inside data
      if (data.success == false) {
        dispatch(loaderError(data));
        return;
      }
      dispatch(signInSuccess(data));

      // const res = await axios.post("/api/auth/signup", formData);
      // console.log(res.data);
      navigate("/");
    } catch (error) {
      dispatch(loaderError(error));
    }
  }

  return (
    <div className="p-3  max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-500">Sign Up</span>{" "}
        </Link>
      </div>
      <p className="text-red-700 mt-3">
        {console.log(error)}
        {error && error.message}
        {/* : "Something went wrong!" */}
      </p>
    </div>
  );
}
