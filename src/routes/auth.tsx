import { createFileRoute, Link, useNavigate, ClientOnly } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Atelier" },
      { name: "description", content: "Sign in or create an Atelier account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ClientOnly fallback={<div className="mx-auto max-w-md px-6 py-16 text-muted-foreground">Loading…</div>}>
      <AuthPage />
    </ClientOnly>
  ),
});

function AuthPage() {
  const { user, login, register, logout } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return (
      <section className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display text-3xl">Signed in as {user.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/account" className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">My account</Link>
          <button onClick={logout} className="rounded-full border border-border px-5 py-2 text-sm">Sign out</button>
        </div>
      </section>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = mode === "login" ? login(email, password) : register(email, name, password);
    if (!res.ok) return setError(res.error ?? "Something went wrong");
    nav({ to: "/account" });
  };

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-4xl">{mode === "login" ? "Welcome back" : "Create an account"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "login" ? "Sign in to view orders and wishlist." : "It takes a moment."}
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        {mode === "register" && (
          <Field label="Name" value={name} onChange={setName} type="text" />
        )}
        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field label="Password" value={password} onChange={setPassword} type="password" />
        {error && <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
        <button type="submit" className="w-full rounded-full bg-primary py-3 text-sm text-primary-foreground">
          {mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
      <button
        onClick={() => { setError(null); setMode(mode === "login" ? "register" : "login"); }}
        className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-foreground"
      >
        {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </section>
  );
}

function Field({ label, value, onChange, type }: { label: string; value: string; onChange: (v: string) => void; type: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}
