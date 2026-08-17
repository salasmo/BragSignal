"use client";

export default function StickyMobileCTA({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3 sm:hidden">
      <button
        onClick={onAdd}
        className="glass-strong shadow-glow flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-display text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.98]"
      >
        <span className="inline-block h-2 w-2 animate-blip rounded-full bg-signal-400" />
        Registrar un logro
      </button>
    </div>
  );
}
