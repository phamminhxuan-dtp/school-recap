"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ScoreItem = {
  subject: string;
  hk1: number;
  hk2: number;
  avg: number;
};

type ScoreData = {
  student?: {
    name?: string;
    className?: string;
  };
  scores: ScoreItem[];
};

type FlipCardProps = {
  title: string;
  emoji: string;
  subtitle?: string;
  frontHint: string;
  children: React.ReactNode;
  flipped: boolean;
  onFlip: () => void;
  accentClassName?: string;
};

function FlipCard({
  title,
  emoji,
  subtitle,
  frontHint,
  children,
  flipped,
  onFlip,
  accentClassName = "from-pink-200 via-white to-sky-100",
}: FlipCardProps) {
  return (
    <motion.div
      className="relative h-[500px] w-full max-w-[420px]"
      style={{ perspective: 1400 }}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        className="relative h-full w-full cursor-pointer rounded-[2rem]"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.9 }}
        onClick={onFlip}
      >
        <div
          className={`absolute inset-0 rounded-[2rem] border border-white/60 bg-gradient-to-br ${accentClassName} p-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)]`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="flex h-full flex-col justify-between rounded-[1.5rem] bg-white/35 p-5 backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  {title}
                </p>
                <h2 className="mt-2 text-3xl font-black leading-tight text-gray-900">
                  {emoji} {title}
                </h2>
                {subtitle ? (
                  <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
                ) : null}
              </div>
              <div className="rounded-2xl bg-white/70 px-3 py-2 text-2xl shadow-sm">
                {emoji}
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center px-3">
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="mx-auto mb-4 inline-flex rounded-full bg-white/75 px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm"
                >
                  {frontHint}
                </motion.div>
                <p className="text-sm leading-6 text-gray-600">
                  Chạm vào thẻ để lật xem kết quả.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-gray-500">
              <span>Tap to flip</span>
              <span>Reveal</span>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-[2rem] border border-white/60 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="flex h-full flex-col rounded-[1.5rem] bg-gradient-to-br from-white to-slate-50 p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Kết quả
                </p>
                <h3 className="mt-2 text-2xl font-black text-gray-900">
                  {title}
                </h3>
              </div>
              <div className="rounded-2xl bg-pink-100 px-3 py-2 text-2xl shadow-sm">
                {emoji}
              </div>
            </div>

            <div className="flex-1">{children}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-100 px-4 py-3 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-slate-900">{value}</p>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/70 p-3 shadow-xl backdrop-blur-md sm:p-4"
    >
      <div className="pointer-events-none absolute -right-4 -top-4 text-4xl opacity-20">
        {icon}
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500 sm:text-[11px]">
        {label}
      </p>
      <p className="mt-2 text-lg font-black leading-tight text-gray-900 sm:mt-3 sm:text-xl">
        {value}
      </p>
    </motion.div>
  );
}

function formatScore(value: number) {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

function toYearRangeLabel() {
  const currentYear = new Date().getFullYear();
  return `${currentYear - 1} → ${currentYear}`;
}

export default function AnalyzePage() {
  const [data, setData] = useState<ScoreData | null>(null);
  const [currentCard, setCurrentCard] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [flipped, setFlipped] = useState<Record<1 | 2 | 3 | 4 | 5, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("scoreData");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as ScoreData;
      setData(parsed);
    } catch {
      setData(null);
    }
  }, []);

  const scores = data?.scores ?? [];
  const schoolYearLabel = useMemo(() => toYearRangeLabel(), []);

  const randomQuote = useMemo(() => {
    const quotes = [
      "Mọi nỗ lực rồi sẽ nở hoa, chỉ là sớm hay muộn thôi 🌸",
      "Chúc cho phiên bản tiếp theo của bạn còn rực rỡ hơn nữa 🌟",
      "Bạn không cần hoàn hảo. Chỉ cần đã cố gắng là đủ tuyệt rồi 🌷",
      "Khép lại một năm học với thật nhiều kỷ niệm đẹp ✨",
      "Mỗi bài kiểm tra đã qua đều là dấu vết của sự trưởng thành 📚",
      "Cảm ơn bản thân vì đã chăm chỉ suốt một năm dài 📖",
    ];

    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  const analysis = useMemo(() => {
    const safeScores = scores.filter(
      (s) =>
        typeof s.hk1 === "number" &&
        typeof s.hk2 === "number" &&
        typeof s.avg === "number"
    );

    const hk1Avg = safeScores.length
      ? safeScores.reduce((sum, item) => sum + item.hk1, 0) / 9
      : 0;

    const hk2Avg = safeScores.length
      ? safeScores.reduce((sum, item) => sum + item.hk2, 0) / 9
      : 0;

    const yearAvg = safeScores.length
      ? safeScores.reduce((sum, item) => sum + item.avg, 0) / 9
      : 0;

    const bestSubject = safeScores.reduce<ScoreItem | null>((best, item) => {
      if (!best) return item;
      return item.avg > best.avg ? item : best;
    }, null);

    const improvedList = safeScores
      .map((item) => ({
        ...item,
        diff: Number((item.hk2 - item.hk1).toFixed(2)),
      }))
      .sort((a, b) => b.diff - a.diff);

    const mostImproved = improvedList[0] ?? null;
    const hasImprovement = mostImproved ? mostImproved.diff > 0 : false;

    const over90 = safeScores.filter((s) => s.avg >= 9.0).length;
    const over80 = safeScores.filter((s) => s.avg >= 8.0).length;
    const over65 = safeScores.filter((s) => s.avg >= 6.5).length;

    let title = "Chưa có danh hiệu";
    let subtitle = "Tiếp tục cố gắng thêm chút nữa nha";

    if (over90 >= 6 && over65 >= 9) {
      title = "Học sinh xuất sắc";
      subtitle = "Quá đỉnh luôn, năm nay bạn đã làm rất tốt!";
    } else if (over80 >= 6 && over65 >= 9) {
      title = "Học sinh giỏi";
      subtitle = "Một năm học rất đáng tự hào.";
    }

    return {
      hk1Avg,
      hk2Avg,
      yearAvg,
      bestSubject,
      mostImproved: hasImprovement ? mostImproved : null,
      title,
      subtitle,
    };
  }, [scores]);

  if (!data) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-pink-100 via-yellow-50 to-sky-100 px-4 py-10">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center justify-center rounded-[2rem] bg-white/70 p-8 text-center shadow-xl backdrop-blur-md">
          <div>
            <div className="mb-4 text-5xl">📭</div>
            <h1 className="text-2xl font-black text-gray-900">Không có dữ liệu</h1>
            <p className="mt-2 text-sm text-gray-600">
              Hãy quay lại trang upload và phân tích bảng điểm trước nhé.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (showFinal) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-fuchsia-100 via-pink-50 to-sky-100 px-4 py-6 sm:py-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div animate={{ y: [0, -10, 0], x: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute left-2 top-8 text-4xl opacity-70">✨</motion.div>
          <motion.div animate={{ y: [0, 12, 0], x: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute right-4 top-24 text-4xl opacity-60">🌸</motion.div>
          <motion.div animate={{ y: [0, -8, 0], x: [0, 8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-20 left-8 text-4xl opacity-60">📚</motion.div>
          <motion.div animate={{ y: [0, 8, 0], x: [0, -6, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-28 right-6 text-4xl opacity-60">🌟</motion.div>
          <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-pink-300/25 blur-3xl" />
          <div className="absolute -right-24 top-52 h-72 w-72 rounded-full bg-sky-300/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-200/25 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:p-6"
        >
          <div className="absolute inset-x-8 top-0 h-24 rounded-full bg-white/50 blur-3xl" />

          <div className="relative rounded-[2rem] bg-gradient-to-br from-white/80 via-pink-50/80 to-sky-50/80 p-5 sm:p-7">
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.45em] text-pink-500 sm:text-sm">
                ✨ SCHOOL WRAPPED ✨
              </p>

              <h1 className="mt-3 bg-gradient-to-r from-fuchsia-600 via-pink-500 to-sky-500 bg-clip-text text-3xl font-black uppercase tracking-[0.08em] text-transparent drop-shadow-sm sm:text-4xl md:text-5xl">
                {data.student?.name?.toUpperCase() || "HỌC SINH"}
              </h1>

              <p className="mt-2 text-lg font-bold uppercase tracking-[0.22em] text-gray-700 sm:text-xl">
                Lớp {data.student?.className?.toUpperCase() || "CHƯA CÓ LỚP"}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                <span>📅</span>
                <span>{schoolYearLabel}</span>
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:mt-6 sm:grid-cols-2 sm:gap-3">
              <SummaryCard
                icon="📚"
                label="Kết quả học tập"
                value={`CN: ${formatScore(analysis.yearAvg)}`}
              />
              <SummaryCard
                icon="🏆"
                label="Môn sở trường"
                value={`${analysis.bestSubject?.subject ?? "Chưa có dữ liệu"} • ${formatScore(analysis.bestSubject?.avg ?? 0)}`}
              />
              <SummaryCard
                icon="📈"
                label="Tiến bộ nhiều nhất"
                value={analysis.mostImproved ? `${analysis.mostImproved.subject} (+${analysis.mostImproved.diff.toFixed(2)})` : "Không có"}
              />
              <SummaryCard
                icon="🎓"
                label="Danh hiệu đạt được"
                value={analysis.title}
              />
            </div>

            <div className="mt-4 rounded-[2rem] bg-gradient-to-br from-gray-950 via-gray-900 to-slate-800 p-5 text-white shadow-2xl sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                    Lời nhắn cuối năm
                  </p>
                  <p className="mt-3 text-xl font-bold leading-8 sm:text-2xl sm:leading-9">
                    “{randomQuote}”
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 px-3 py-2 text-2xl shadow-sm backdrop-blur">
                  🌈
                </div>
              </div>
              <p className="mt-5 text-center text-[10px] font-medium tracking-[0.2em] text-white/40">
                CODED BY CHATGPT AND PHAM MINH XUAN
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-pink-100 via-yellow-50 to-sky-100 px-4 py-8">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full rounded-[2rem] bg-white/60 px-5 py-4 text-center shadow-lg backdrop-blur-md"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink-500">
            Analyze result
          </p>
          <h1 className="mt-2 text-2xl font-black text-gray-900">
            {data.student?.name ? `${data.student.name} ơi, xem nè ✨` : "Xem kết quả nè ✨"}
          </h1>
          {data.student?.className ? (
            <p className="mt-1 text-sm text-gray-600">{data.student.className}</p>
          ) : null}
        </motion.div>

        <AnimatePresence mode="wait">
          {currentCard === 1 ? (
            <FlipCard
              key="card-1"
              title="Kết quả học tập"
              emoji="📚"
              subtitle="Điểm trung bình cả năm được tính bằng tổng các môn chia cho 9."
              frontHint="Tổng kết cả năm học"
              flipped={flipped[1]}
              onFlip={() => setFlipped((prev) => ({ ...prev, 1: !prev[1] }))}
              accentClassName="from-yellow-200 via-white to-pink-100"
            >
              <div className="grid gap-3">
                <StatPill label="Điểm trung bình học kì 1" value={formatScore(analysis.hk1Avg)} />
                <StatPill label="Điểm trung bình học kì 2" value={formatScore(analysis.hk2Avg)} />
                <StatPill label="Điểm trung bình cả năm" value={formatScore(analysis.yearAvg)} />
              </div>
            </FlipCard>
          ) : currentCard === 2 ? (
            <FlipCard
              key="card-2"
              title="Môn sở trường của bạn..."
              emoji="🏆"
              subtitle="Môn có điểm trung bình cả năm cao nhất."
              frontHint="Bấm để xem môn mạnh nhất"
              flipped={flipped[2]}
              onFlip={() => setFlipped((prev) => ({ ...prev, 2: !prev[2] }))}
              accentClassName="from-sky-200 via-white to-emerald-100"
            >
              <div className="flex h-full flex-col justify-center gap-4 text-center">
                <motion.div
                  initial={{ scale: 0.94, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-[1.75rem] bg-gradient-to-br from-pink-50 to-yellow-50 p-6 shadow-sm"
                >
                  <p className="text-sm font-semibold text-gray-500">Môn mạnh nhất</p>
                  <p className="mt-3 text-3xl font-black text-gray-900">
                    {analysis.bestSubject?.subject ?? "Chưa có dữ liệu"}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Điểm trung bình cả năm: {formatScore(analysis.bestSubject?.avg ?? 0)}
                  </p>
                </motion.div>
                <div className="flex justify-center gap-2 text-2xl">
                  <span>⭐</span>
                  <span>✨</span>
                  <span>👑</span>
                </div>
              </div>
            </FlipCard>
          ) : currentCard === 3 ? (
            <FlipCard
              key="card-3"
              title="Môn bạn tiến bộ nhiều nhất!"
              emoji="📈"
              subtitle="So sánh học kì 2 với học kì 1 để tìm môn tăng tốt nhất."
              frontHint="Môn nào tăng mạnh nhất?"
              flipped={flipped[3]}
              onFlip={() => setFlipped((prev) => ({ ...prev, 3: !prev[3] }))}
              accentClassName="from-emerald-200 via-white to-cyan-100"
            >
              <div className="flex h-full flex-col justify-center gap-4 text-center">
                <motion.div
                  initial={{ scale: 0.94, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-[1.75rem] bg-gradient-to-br from-cyan-50 to-emerald-50 p-6 shadow-sm"
                >
                  <p className="text-sm font-semibold text-gray-500">Môn tiến bộ nhất</p>
                  <p className="mt-3 text-3xl font-black text-gray-900">
                    {analysis.mostImproved ? analysis.mostImproved.subject : "Không có"}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {analysis.mostImproved
                      ? `Tăng ${analysis.mostImproved.diff.toFixed(2)} điểm so với học kì 1`
                      : "Không có môn nào tăng hơn học kì 1."}
                  </p>
                </motion.div>
                <div className="flex justify-center gap-2 text-2xl">
                  <span>🚀</span>
                  <span>🌱</span>
                  <span>📊</span>
                </div>
              </div>
            </FlipCard>
          ) : currentCard === 4 ? (
            <FlipCard
              key="card-4"
              title="Danh hiệu đạt được"
              emoji="🎓"
              subtitle="Dựa trên số môn đạt mốc điểm trung bình."
              frontHint="Bạn có đạt danh hiệu nào không?"
              flipped={flipped[4]}
              onFlip={() => setFlipped((prev) => ({ ...prev, 4: !prev[4] }))}
              accentClassName="from-fuchsia-200 via-white to-yellow-100"
            >
              <div className="flex h-full flex-col items-center justify-center text-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-[1.75rem] bg-gradient-to-br from-yellow-100 to-pink-100 px-6 py-8 shadow-sm"
                >
                  <p className="text-sm font-semibold text-gray-500">Danh hiệu</p>
                  <p className="mt-3 text-3xl font-black text-gray-900">
                    {analysis.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-gray-700">{analysis.subtitle}</p>
                </motion.div>
                <div className="mt-4 flex justify-center gap-2 text-2xl">
                  <span>🥇</span>
                  <span>🌟</span>
                  <span>🎉</span>
                </div>
              </div>
            </FlipCard>
          ) : (
            <FlipCard
              key="card-5"
              title="Lời kết"
              emoji="☀️"
              subtitle="Kết thúc năm học bằng một chút ấm áp nhé."
              frontHint="Bật thẻ để xem lời nhắn"
              flipped={flipped[5]}
              onFlip={() => setFlipped((prev) => ({ ...prev, 5: !prev[5] }))}
              accentClassName="from-orange-200 via-white to-sky-100"
            >
              <div className="flex h-full flex-col justify-between gap-4">
                <div className="rounded-[1.75rem] bg-gradient-to-br from-orange-50 to-pink-50 p-5 shadow-sm">
                  <p className="text-lg font-bold leading-8 text-gray-900">
                    Năm học đã kết thúc. Bạn đã phấn đấu miệt mài cả năm rồi, giờ là lúc để nghỉ ngơi thôi~
                  </p>
                  <p className="mt-4 text-base font-medium leading-7 text-gray-700">
                    Chúc bạn có một mùa hè thật vui vẻ ☀️ Hẹn gặp lại ở năm học tiếp theo nhé~
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 text-2xl">
                  <span>🌸</span>
                  <span>☁️</span>
                  <span>✨</span>
                  <span>🌈</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFinal(true)}
                  className="rounded-2xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white shadow-lg active:scale-[0.99]"
                >
                  Tổng kết →
                </button>
              </div>
            </FlipCard>
          )}
        </AnimatePresence>

        <div className="grid w-full grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((card) => (
            <button
              key={card}
              type="button"
              onClick={() => setCurrentCard(card as 1 | 2 | 3 | 4 | 5)}
              className={`rounded-2xl px-2 py-3 text-sm font-semibold shadow-lg transition ${
                currentCard === card
                  ? "bg-gray-950 text-white"
                  : "bg-white/70 text-gray-700"
              }`}
            >
              {card}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
