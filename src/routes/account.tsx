import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { useState } from "react";
import { useAddresses, useAuth } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — Atelier" },
      { name: "description", content: "Manage your profile and shipping addresses." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ClientOnly fallback={<div className="mx-auto max-w-4xl px-6 py-16 text-muted-foreground">Loading…</div>}>
      <Account />
    </ClientOnly>
  ),
});

function Account() {
  const { user, logout } = useAuth();
  const { addresses, add, remove } = useAddresses();
  const [form, setForm] = useState({ label: "Home", name: user?.name ?? "", line1: "", city: "", zip: "", country: "" });

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display text-3xl">Sign in required</h1>
        <Link to="/auth" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Sign in</Link>
      </section>
    );
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.line1 || !form.city || !form.zip || !form.country) return;
    add(form);
    setForm({ label: "Home", name: user.name, line1: "", city: "", zip: "", country: "" });
  };

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl">Hi, {user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/orders" className="rounded-full border border-border px-4 py-2 text-sm">Orders</Link>
          <button onClick={logout} className="rounded-full border border-border px-4 py-2 text-sm">Sign out</button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-2xl">Saved addresses</h2>
        {addresses.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No addresses yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {addresses.map((a) => (
              <li key={a.id} className="flex items-start justify-between rounded-lg border border-border p-4">
                <div className="text-sm">
                  <div className="font-medium">{a.label} — {a.name}</div>
                  <div className="text-muted-foreground">{a.line1}, {a.city} {a.zip}, {a.country}</div>
                </div>
                <button onClick={() => remove(a.id)} className="text-xs text-muted-foreground hover:text-destructive">Delete</button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={save} className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-6">
          <div className="col-span-2 font-medium">Add a new address</div>
          {(["label","name","line1","city","zip","country"] as const).map((k) => (
            <label key={k} className={`block ${k === "line1" || k === "country" ? "col-span-2" : ""}`}>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{k}</span>
              <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent" />
            </label>
          ))}
          <button type="submit" className="col-span-2 mt-2 rounded-full bg-primary py-2.5 text-sm text-primary-foreground">Save address</button>
        </form>
      </div>
    </section>
  );
}
