"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

interface School {
  id?: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  image: string;
}

export default function EditSchoolPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/getSchool/${id}`).then((res) => {
      setForm(res.data);
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await axios.post("/api/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data && res.data.url) {
        setForm({ ...form, image: res.data.url });
      }
      toast.success("Image Upload Successfully");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Image Not Uploaded");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      try {
          e.preventDefault();
          await axios.put(`/api/updateSchool/${id}`, form);
          toast.success("Updated Successfully");
          router.push(`/profile/${id}`);
        } catch (error) {
        toast.error("Profile Update Failed");
        console.log(error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!form) return <div className="p-6 text-red-500">School not found</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Edit School</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block capitalize mb-1">image</label>
          <img
            src={
              form.image ||
              "https://img.freepik.com/premium-vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-web-site-mobile-app_87543-18055.jpg?w=1480"
            }
            alt="school"
            className="w-full h-40 object-cover rounded cursor-pointer"
            onClick={handleImageClick}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {Object.keys(form)
          .filter((k) => k !== "image")
          .map((key) => (
            <div key={key}>
              <label className="block capitalize mb-1">{key}</label>
              <input
                type="text"
                name={key}
                value={(form as any)[key]}
                onChange={handleChange}
                required
                disabled={key === "id"}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          ))}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
