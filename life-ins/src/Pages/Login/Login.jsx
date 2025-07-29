import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
// import { AuthContext } from "../../Context/AuthProvider";
import UseAxios from "../../Hooks/UseAxios";
import { AuthContext } from "../../Context/AuthProvider";

const Login = () => {
   const { register, handleSubmit, formState: { errors } } = useForm();
  const { SignIn, GoogleSignIn } = useContext(AuthContext);
//   const location = useLocation();

  const location = useLocation();

  const axiosPublic = UseAxios();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log('submitted Data', data);
    const { email, password } = data;
    SignIn(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Swal.fire({
          title: "Welcome Back, Logged In Successfully!",
          icon: "success",
          draggable: true
        });
        navigate(`${location.state ? location.state : '/'}`);
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

 const handleGoogleLogin = () => {
  GoogleSignIn()
    .then(async (result) => {
      const user = result.user;

      const userInfo = {
        email: user.email,
        role: 'customer',
        created_at: new Date().toISOString(),
        last_log_at: new Date().toISOString()
      };

      try {
        await axiosPublic.post('/users', userInfo);
        console.log("User inserted");
      } catch (error) {
        if (error.response?.status === 409) {
          console.log("User already exists. Skipping insert.");
        } else {
          console.error("Insert error", error);
        }
      }

      Swal.fire({
        title: "Logged In Successfully!",
        icon: "success",
        draggable: true
      });

      navigate(`${location.state ? location.state : '/'}`);
    })
    .catch((error) => {
      console.log(error);
    });
};

  

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-6">
      <h2 className="text-3xl font-extrabold text-center text-primary">Login to Your Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="input input-bordered w-full"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="input input-bordered w-full"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <hr className="flex-1 border-gray-300" />
        <span className="text-gray-400 text-sm">or</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
      >
        <FcGoogle className="text-xl" />
        <span className="font-medium">Continue with Google</span>
      </button>

      {/* Redirect to Register */}
      <p className="text-sm text-gray-600 text-center mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary font-medium hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
