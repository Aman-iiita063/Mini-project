"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import toast from "react-hot-toast";

// Replace with your actual illustration or SVG
import illustration from "../assets/icon3.jpg";

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    enrollment: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your registration logic here
    console.log("Form submitted:", formData);
    toast.success("Account created! You've successfully signed up.");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-gray-100">
      {/* Left Section (Illustration with Gradient) */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 p-8">
        <img
          src={illustration || "/placeholder.svg"}
          alt="Sign up illustration"
          className="object-contain max-h-[32rem] rounded-md shadow-lg"
        />
      </div>

      {/* Right Section (Sign Up Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="max-w-md w-full bg-white shadow-2xl rounded-lg p-8 transform transition-all duration-300 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Create an Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="col-span-1">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="col-span-1">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Enrollment Number */}
            <div>
              <Label htmlFor="enrollment">Enrollment Number</Label>
              <div className="relative">
                <Input
                  id="enrollment"
                  name="enrollment"
                  type="text"
                  placeholder="Enter your enrollment number"
                  value={formData.enrollment}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="johndoe@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          {/* Social Sign Up */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.2662 9.76453C6.19879 6.93863 8.85445 4.90909 12 4.90909c1.69091 0 3.21818.6 4.41818 1.58182L19.9091 3C17.7818 1.14545 15.0545 0 12 0 7.27007 0 3.19775 2.6983 1.24 6.65l4.02621 3.11453z"
                  />
                  <path
                    fill="#34A853"
                    d="M16.0407 18.0126c-1.08981.70371-2.47464 1.07832-4.04073 1.07832-3.13352 0-5.78089-2.01404-6.72303-4.82304L1.23746 17.335C3.19279 21.297 7.265 24 12 24c2.93284 0 5.73535-1.04261 7.83419-3.00042l-3.79346-2.98799z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M19.8342 20.99958c2.19498-2.04748 3.62-5.09591 3.62-8.9996 0-.70909-.10909-1.41818-.27273-2.09091H12v4.54545h6.43636c-.31759 1.55908-1.17006 2.76667-2.39563 3.55804L19.8342 21z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27698 14.26788c-.23866-.71155-.3679-1.47411-.3679-2.26788 0-.78172.12535-1.53319.35711-2.23547L1.23999 6.65C.43659 8.26043 0 10.07538 0 12c0 1.91955.44478 3.73017 1.23746 5.335z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#1877F2"
                    d="M23.9981 11.9991C23.9981 5.37216 18.626 0 11.9991 0C5.37216 0 0 5.37216 0 11.9991C0 17.9882 4.38789 22.9522 10.1242 23.8524V15.4676H7.07758V11.9991H10.1242V9.35553C10.1242 6.34826 11.9156 4.68714 14.6564 4.68714C15.9692 4.68714 17.3424 4.92149 17.3424 4.92149V7.87439H15.8294C14.3388 7.87439 13.8739 8.79933 13.8739 9.74824V11.9991H17.2018L16.6698 15.4676H13.8739V23.8524C19.6103 22.9522 23.9981 17.9882 23.9981 11.9991Z"
                  />
                </svg>
                Facebook
              </Button>
            </div>
          </div>

          {/* Already a member? Log in */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Render Toaster for notifications */}
      <Toaster />
    </div>
  );
};

export default SignUpPage;
