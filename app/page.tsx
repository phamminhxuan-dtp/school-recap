"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 via-yellow-50 to-blue-100 relative overflow-hidden">
      
      {/* sticker nền giả */}
      <div className="absolute top-10 left-10 text-3xl">⭐</div>
      <div className="absolute bottom-10 right-10 text-3xl">📚</div>
      <div className="absolute top-1/3 right-1/4 text-3xl">☁️</div>

      {/* content */}
      <div className="text-center p-6 rounded-3xl bg-white/60 shadow-xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-gray-700">
          Nhìn lại một năm học ✨
        </h1>

        <p className="mt-3 text-gray-600">
          Cùng xem lại hành trình học tập của bạn nhé~
        </p>

        <button
        onClick={() => router.push("/input")}
        className="px-6 py-3 bg-pink-300 rounded-xl text-white"
      >
        ✨ Bắt đầu thôi
      </button>
      </div>

    </main>
  );
}