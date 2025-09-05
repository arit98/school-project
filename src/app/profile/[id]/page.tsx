"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  image: string;
}

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [school, setSchool] = useState<School | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/getSchool/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setSchool(data);
      })
      .catch(() => setError("Failed to fetch school"));
  }, [id]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!school) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <img
        src={school.image || "https://img.freepik.com/premium-vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-web-site-mobile-app_87543-18055.jpg?w=1480"}
        alt={school.name}
        className="w-full h-[340px] object-cover rounded-lg shadow"
      />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mt-4">{school.name}</h1>
        <button
          onClick={() => router.push(`/profile/${id}/edit`)}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Edit
        </button>
      </div>

      <p className="mt-2 text-gray-700">
        <strong>Address:</strong> {school.address}, {school.city}, {school.state}
      </p>
      <p className="mt-2 text-gray-700">
        <strong>Contact:</strong> {school.contact}
      </p>
      <p className="mt-2 text-gray-700">
        <strong>Email:</strong> {school.email_id}
      </p>
    </div>
  );
}
