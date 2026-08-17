"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PulseLine from "@/components/PulseLine";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos."
          : error.message);
        setLoading(false);
        return;
      }
      router.push(nextPath);
      router.refresh();
    } else {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data.session) {
        router.push(nextPath);
        router.refresh();
        return;
      }
      setNotice("Cuenta creada. Revisa tu correo para confirmar antes de entrar.");
      setLoading(false);
    }
  }

  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
      <div className="mb-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-vital-400">
          brag signal
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">
          {mode === "signin" ? "Bienvenido de vuelta" : "Crea tu cuenta"}
        </h1>
        <PulseLine className="mx-auto mt-4 h-8 w-48 opacity-70" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-strong shadow-glass w-full max-w-sm rounded-3xl p-6 sm:p-8"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-xs text-white/50" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-vital-500/50"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-white/50" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-vital-500/50"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}
        {notice && (
          <p className="mt-4 rounded-lg border border-signal-500/30 bg-signal-500/10 px-3 py-2 text-xs text-signal-300">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="shadow-glow mt-6 w-full rounded-xl bg-vital-500 px-4 py-2.5 text-sm font-semibold text-graphite-950 transition-transform duration-150 hover:bg-vital-400 active:scale-[0.98] disabled:opacity-60"
        >
          {loading
            ? "Un momento…"
            : mode === "signin"
              ? "Entrar"
              : "Crear cuenta"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setNotice(null);
          }}
          className="mt-4 w-full text-center text-xs text-white/50 transition-colors hover:text-white/80"
        >
          {mode === "signin"
            ? "¿No tienes cuenta? Créala aquí"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
