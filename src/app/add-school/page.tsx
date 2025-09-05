"use client";

import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddSchool() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();

  interface FormValues {
    name: string;
    address: string;
    city: string;
    state: string;
    contact: string;
    email_id: string;
    image?: FileList;
    [key: string]: any;
  }

  const isSubmittingRef = useRef<boolean>(false);

  const onSubmit = async (data: FormValues) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "image" && data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      } else if (key !== "image") {
        formData.append(key, data[key]);
      }
    });

    try {
      const res = await axios.post("/api/addSchool", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const successMessage = res.data.message || "School added";
      setMessage(successMessage);
      toast.success(successMessage);
      if (res.data.message) {
        reset();
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err.message || "Error";
      setMessage(errorMessage);
      toast.error("School Not Added");
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Add School</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name", { required: true })}
          placeholder="School Name"
          className="border p-2 w-full"
        />
        {errors.name && <p className="text-red-500">Name is required</p>}

        <input
          {...register("address", { required: true })}
          placeholder="Address"
          className="border p-2 w-full"
        />
        <input
          {...register("city", { required: true })}
          placeholder="City"
          className="border p-2 w-full"
        />
        <input
          {...register("state", { required: true })}
          placeholder="State"
          className="border p-2 w-full"
        />

        <input
          {...register("contact", {
            required: true,
            minLength: 10,
            maxLength: 16,
          })}
          type="number"
          placeholder="Contact"
          className="border p-2 w-full"
        />
        {errors.contact && (
          <p className="text-red-500">Valid contact required</p>
        )}

        <input
          {...register("email_id", { required: true, pattern: /^\S+@\S+$/i })}
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
        />
        {errors.email_id && (
          <p className="text-red-500">Valid email required</p>
        )}

        <input
          {...register("image")}
          type="file"
          accept="image/*"
          className="border p-2 w-full"
        />

        <div className="flex items-center justify-center gap-12">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-500 text-white px-4 py-2 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 cursor-pointer"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
