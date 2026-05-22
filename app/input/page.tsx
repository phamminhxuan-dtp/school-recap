"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InputPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [className, setClassName] = useState("");

  const handleContinue = () => {
    localStorage.setItem(
      "student",
      JSON.stringify({
        name,
        className,
      })
    );

    router.push("/upload");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 via-pink-100 to-yellow-50">

      <div className="bg-white/70 p-8 rounded-3xl shadow-xl text-center w-[350px]">
        <h1 className="text-2xl font-bold mb-4">
          Nhập thông tin ✨
        </h1>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên của bạn"
          className="w-full p-2 mb-3 rounded-xl border"
        />

        <input
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Lớp"
          className="w-full p-2 mb-3 rounded-xl border"
        />

        <button
          onClick={handleContinue}
          className="mt-4 bg-pink-300 hover:bg-pink-400 text-white px-4 py-2 rounded-xl w-full"
        >
          Tiếp tục ✨
        </button>

      </div>

    </main>
  );
}