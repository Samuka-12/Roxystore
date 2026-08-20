import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";

import { brl, useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Carrinho | RoxyStore - Brasil" },
      {
        name: "description",
        content: "Revise os itens do seu carrinho e finalize a compra na RoxyStore - Brasil.",
      },
      { property: "og:title", content: "Carrinho | RoxyStore - Brasil" },
      {
        property: "og:description",
        content: "Revise os itens do seu carrinho e finalize a compra na RoxyStore - Brasil.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 lg:px-8">
      <h1 className="font-display text-4xl font-extrabold uppercase">Carrinho</h1>

      {items.length === 0 ? (
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
          <Link
            to="/"
            className="mt-6 inline-block bg-primary px-6 py-3 text-sm font-semibold uppercase text-primary-foreground"
          >
            Continuar comprando
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <ul className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <li key={`${item.handle}-${item.size}`} className="flex gap-4 py-5">
                <Link to="/products/$handle" params={{ handle: item.handle }}>
                  <img src={item.image} alt="" className="size-28 object-cover" />
                </Link>
                <div className="flex-1">
                  <Link
                    to="/products/$handle"
                    params={{ handle: item.handle }}
                    className="text-sm font-medium"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">Tamanho {item.size}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center border border-border">
                      <button
                        type="button"
                        aria-label="Diminuir"
                        className="px-2 py-1"
                        onClick={() => setQty(item.handle, item.size, item.qty - 1)}
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="px-3 text-sm">{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Aumentar"
                        className="px-2 py-1"
                        onClick={() => setQty(item.handle, item.size, item.qty + 1)}
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      aria-label="Remover"
                      onClick={() => remove(item.handle, item.size)}
                    >
                      <Trash2 className="size-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <span className="text-sm font-semibold">{brl(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>

          <aside className="h-fit border border-border p-5">
            <p className="eyebrow">Resumo</p>
            <div className="mt-4 flex justify-between text-sm">
              <span>Subtotal</span>
              <strong>{brl(subtotal)}</strong>
            </div>
            <div className="mt-2 flex justify-between text-sm text-pix">
              <span>No pix (5% off)</span>
              <strong>{brl(subtotal * 0.95)}</strong>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Frete calculado na finalização da compra.
            </p>
            <Link
              to="/checkout"
              className="mt-5 block w-full bg-primary px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-primary-foreground"
            >
              Finalizar compra
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
