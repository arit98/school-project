"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";

interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  image: string;
}

export default function ShowSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/getSchools")
      .then((res) => setSchools(res.data))
      .catch((err) => console.error("Error fetching schools:", err));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/deleteSchool/${id}`);
      setSchools((prev) => prev.filter((s) => s.id !== id));
      toast.success("Deleted Successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Profile Can't Be Delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Schools</h1>
        <button
          onClick={() => router.push("/add-school")}
          className="px-4 py-2 border-2 rounded-lg text-2xl cursor-pointer"
        >
          +
        </button>
      </div>
      {schools.length <= 0 ? (
        <div className="text-center py-8 text-gray-500">No schools found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {schools.map((school) => (
            <div
              key={school.id}
              className="border border-amber-500 p-4 rounded shadow"
            >
              <Link href={`/profile/${school.id}`} className="block">
                <img
                  src={
                    school.image ||
                    "https://img.freepik.com/premium-vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-web-site-mobile-app_87543-18055.jpg?w=1480"
                  }
                  alt={school.name}
                  className="w-full h-60 object-cover rounded"
                />
                <h2 className="text-lg font-semibold mt-2">{school.name}</h2>
                <p className="text-sm">
                  {school.address}, {school.city}
                </p>
              </Link>

              {deletingId === school.id ? (
                <div className="flex mt-8 justify-center w-full">
                  <button
                    onClick={() => handleDelete(school.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-l hover:bg-red-600 cursor-pointer"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="bg-gray-300 px-4 py-2 rounded-r hover:bg-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div
                  className="w-full bg-red-500 flex items-center justify-center rounded-sm py-2 mt-8 cursor-pointer text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setDeletingId(school.id);
                  }}
                >
                  Delete
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
