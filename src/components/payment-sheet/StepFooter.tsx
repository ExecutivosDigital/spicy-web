"use client";

export function StepFooter({
  stepIndex,
  totalSteps,
}: {
  stepIndex: number;
  totalSteps: number;
}) {
  // simples barra de progresso
  const pct = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <footer className="px-5 pt-2 pb-4">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gradient-to-br from-[#FF0080] to-[#7928CA] transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </footer>
  );
}
