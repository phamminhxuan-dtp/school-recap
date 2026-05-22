"use client";

import { useEffect, useState } from "react";
import { readScoreImage } from "@/lib/gemini";

export default function UploadPage() {
  const [student, setStudent] = useState<any>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("student");

    if (data) {
      setStudent(JSON.parse(data));
    }
  }, []);

  const handleAnalyze = async () => {
    if (!preview) {
      alert("Chọn ảnh bảng điểm đã nè 😤");
      return;
    }

    try {
      setLoading(true);
      setAnalyzed(false);
      setText("Đang đọc bảng điểm... 📊");

      const base64 = preview.split(",")[1];

      if (!base64) {
        setText("Ảnh không hợp lệ 😢");
        setLoading(false);
        return;
      }

      const result = await readScoreImage(base64);

      console.log("RAW GEMINI OUTPUT:", result);

      try {
        const cleaned = result
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const data = JSON.parse(cleaned);

        sessionStorage.setItem(
          "scoreData",
          JSON.stringify({
            student,
            scores: data,
          })
        );

        setText(JSON.stringify(data, null, 2));
        setAnalyzed(true);

      } catch (err) {
        console.error("Parse error:", err);
        setText(result);
      }

    } catch (err: any) {
      console.error("FULL ERROR:", err);
      setText(String(err?.message || err));

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-100 via-pink-100 to-blue-100">
      <div className="bg-white/70 p-8 rounded-3xl shadow-xl text-center w-[420px]">

        <h1 className="text-2xl font-bold mb-2">
          Upload bảng điểm 📄
        </h1>

        {student && (
          <p className="text-gray-600 mb-4">
            Xin chào {student.name} - {student.className}
          </p>
        )}

        {/* INPUT FILE */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              setImage(file);
              setAnalyzed(false);

              const reader = new FileReader();

              reader.onload = () => {
                setPreview(reader.result as string);
              };

              reader.readAsDataURL(file);
            }
          }}
          className="mb-4"
        />

        {/* PREVIEW IMAGE */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full rounded-xl mb-4 border"
          />
        )}

        {/* BUTTON */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-blue-300 hover:bg-blue-400 disabled:opacity-50 text-white px-4 py-2 rounded-xl w-full"
        >
          {loading ? "Đang phân tích..." : "Phân tích ✨"}
        </button>

        {/* RESULT */}
        {text && (
          <div className="mt-4 text-left bg-white p-3 rounded-xl max-h-[250px] overflow-auto text-sm">
            <h2 className="font-bold mb-2">
              Kết quả :
            </h2>

            <pre className="whitespace-pre-wrap">
              {text}
            </pre>
          </div>
        )}


{/* CONTINUE BUTTON */}
{analyzed && (
  <button
    onClick={() => {
      window.location.href = "/analyze";
    }}
    className="mt-3 bg-pink-300 hover:bg-pink-400 text-white px-4 py-2 rounded-xl w-full"
  >
    Tiếp tục →
  </button>
)}


      </div>
    </main>
  );
}