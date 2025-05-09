import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  singInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuthenticate from "../components/OAuth.jsx";
import { Eye, EyeClosed } from "lucide-react";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log("API Response:", result);

      if (!result.token) {
        console.log("Sign-in failed:", result.message);
        throw new Error(result.message || "Something went wrong");
      }

      localStorage.setItem("token", result.token);
      console.log("Token stored:", localStorage.getItem("token"));

      dispatch(signInSuccess(result));
      console.log("User state updated successfully");
      navigate("/");
    } catch (err) {
      console.log("Error:", err.message);
      setError(err.message);
      dispatch(signInFailure(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-[500px]">
        <div className="flex justify-center">
          <img
            src={
              "https://cliply.co/wp-content/uploads/2021/02/392102850_EARTH_EMOJI_400px.gif"
            }
            className="w-12 md:w-16"
            alt="Finova Logo"
          />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-1">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-5">
          Sign in to your account
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="text-gray-600">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="text-gray-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-purple-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-800 to-purple-500 text-white py-2 rounded-lg transition hover:opacity-90"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* OAuth Component */}
          <OAuthenticate />
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-purple-600 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
