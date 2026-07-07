import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { OrdersList } from "./orders";

export const Route = createFileRoute("/orders/")({
  component: () => (
    <ClientOnly fallback={<div className="mx-auto max-w-4xl px-6 py-16 text-muted-foreground">Loading…</div>}>
      <OrdersList />
    </ClientOnly>
  ),
});
