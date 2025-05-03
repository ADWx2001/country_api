import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Something went wrong");

            navigate("/sign-in");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pb-20 bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-[600px] mt-24">
                <div className="flex justify-center">
                    <img src="https://s.tmimgcdn.com/scr/800x500/347300/finance-business-graphic-logo-vector-template-v7_347341-original.jpg" alt="Logo" className="mb-4 w-36" />
                </div>
                <h2 className="text-2xl font-bold font-sans text-center mb-1 text-purple-700">Get Started</h2>
                <p className="text-center text-gray-500 mb-5">Welcome to Filianta - Let’s create your account</p>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Username Input */}
                    <div>
                        <label className="text-gray-600">Username</label>
                        <input
                            type="text"
                            {...register("username", { required: "Username is required" })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                    </div>

                    {/* First Name Input */}
                    <div>
                        <label className="text-gray-600">First Name</label>
                        <input
                            type="text"
                            {...register("firstName", { required: "First name is required" })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                    </div>

                    {/* Last Name Input */}
                    <div>
                        <label className="text-gray-600">Last Name</label>
                        <input
                            type="text"
                            {...register("lastName", { required: "Last name is required" })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="text-gray-600">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Mobile Input */}
                    <div>
                        <label className="text-gray-600">Mobile</label>
                        <input
                            type="text"
                            {...register("mobile")}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="text-gray-600">Password</label>
                        <input
                            type="password"
                            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters long" } })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-800 to-purple-500 text-white py-2 rounded-lg transition hover:opacity-90"
                    >
                        {loading ? "Signing up..." : "Sign up"}
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-4">
                    Already have an account? <a href="/sign-in" className="text-purple-600 font-semibold">Log in</a>
                </p>
            </div>
        </div>
    );
}
