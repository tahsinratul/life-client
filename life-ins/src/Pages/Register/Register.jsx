import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useState, useContext } from "react";
import axios from "axios";
import UseAxios from "../../Hooks/UseAxios";
import { AuthContext } from "../../Context/AuthProvider";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createUser, UpdatedInfo } = useContext(AuthContext);
  const axiosPublic = UseAxios();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    const { email, password, name } = data;

    try {
      // Step 1: Upload Image to ImgBB
      let uploadedPhotoURL = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const imageUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Key}`;
        const res = await axios.post(imageUrl, formData);
        uploadedPhotoURL = res.data.data.url;
      }

      // Step 2: Create User in Firebase
      const userCredential = await createUser(email, password);
      const user = userCredential.user;

      // Step 3: Update Firebase Profile
      await UpdatedInfo({
        displayName: name,
        photoURL: uploadedPhotoURL,
      });

      // Step 4: Save user info to DB
      const userInfo = {
        email,
        name,
        photo: uploadedPhotoURL,
        role: "customer",
        created_at: new Date().toISOString(),
        last_log_at: new Date().toISOString(),
      };

      await axiosPublic.post("/users", userInfo);

      // Step 5: Success alert and redirect
      Swal.fire({
        title: "Account Created Successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      navigate("/");
    } catch (error) {
      console.error("Registration Error:", error);
      Swal.fire({
        title: "Registration Failed",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 mx-auto p-6">
      <h2 className="text-3xl font-extrabold text-center text-primary">Create an Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="input input-bordered w-full"
            placeholder="Your Full Name"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>

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
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message: "Must include uppercase, lowercase, and number",
              },
            })}
            className="input input-bordered w-full"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>


        {/* Register Button */}
        <button type="submit" className="btn btn-primary w-full text-white">
          Register
        </button>
      </form>

      {/* Redirect to Login */}
      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
