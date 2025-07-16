import React, { useContext } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router"; // ✅ use 'react-router-dom'
import { AuthContext } from "../Context/AuthContext";
import { getAuth, updateProfile, GoogleAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const { createUser, loginUserWithGoogle } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const loginWithGoogle = () => {
    loginUserWithGoogle(googleProvider)
      .then((result) => {
        const user = result.user;
        setTimeout(() => {
          navigate(location.state?.from?.pathname || "/");
        }, 1000);
      })
      .catch((error) => {
        console.error("Google login error:", error);
        toast.error("Google login failed");
      });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const image = e.target.image.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const passRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passRegex.test(password)) {
      toast.error(
        "Password must be at least 6 characters and include uppercase and lowercase letters."
      );
      return;
    }

    try {
      const result = await createUser(email, password);
      const user = result.user;

      await updateProfile(user, {
        displayName: name,
        photoURL: image,
      });

      toast.success("Account created successfully!");
      setTimeout(() => {
        navigate(location.state?.from?.pathname || "/");
      }, 1000);
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Registration failed. Try again.");
    }
  };

  return (
    <div>
      <div className="hero w-[30rem] mx-auto my-20">
        <div className="hero-content flex-col">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-slate-900">Register now!</h1>
          </div>
          <div className="card bg-slate-800 w-96 shrink-0 rounded-4xl border">
            <div className="card-body">
              <form onSubmit={handleRegister} className="fieldset">
                <label className="label font-bold text-white">Name</label>
                <input type="text" name="name" className="input" placeholder="John Doe" required />

                <label className="label font-bold text-white">Image</label>
                <input type="text" name="image" className="input" placeholder="Your Image URL" required />

                <label className="label font-bold text-white">Email</label>
                <input type="email" name="email" className="input" placeholder="Email" required />

                <label className="label font-bold text-white">Password</label>
                <input type="password" className="input" name="password" placeholder="Password" required />

                <button type="submit" className="btn items-center w-80 mt-4">
                  Register
                </button>
              </form>

              <p className="text-white mt-4">
                Already have an account?
                <Link to="/login" className="link link-hover text-lg font-medium ml-1 text-white">
                  Login
                </Link>
              </p>

              <div className="divider text-white">OR</div>

              <button onClick={loginWithGoogle} className="btn items-center w-80">
                <FaGoogle className="mr-2" /> Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
