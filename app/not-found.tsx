import Link from "next/link";
import PulseLine from "@/components/PulseLine";

export const metadata = {
  title: "404 — sin señal",
  description: "Esta página no existe. Vuelve al inicio de Brag Signal.",
};

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400">
        línea plana · 404
      </p>
      <h1 className="mt-3 font-display text-6xl font-bold text-white sm:text-8xl">404</h1>
      <p className="mx-auto mt-4 max-w-sm text-sm text-white/55">
        No hay latido en esta ruta. La página que buscas no existe o se movió.
      </p>

      <PulseLine className="my-8 h-12 w-64 opacity-70" />

      <Link
        href="/"
        className="shadow-glow rounded-2xl bg-vital-500 px-6 py-3 font-display text-sm font-semibold text-graphite-950 transition-transform duration-150 hover:bg-vital-400 hover:-translate-y-0.5 active:scale-[0.98]"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
