import { Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";

import { brl, useCart } from "@/lib/cart";

const FREE_SHIPPING = 199;

export function CartDrawer() {
  const { items, open, setOpen, subtotal, setQty, remove } = useCart();
  if (!open) return null;
  const missing = Math.max(0, FREE_SHIPPING - subtotal);

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        aria-label="Fechar carrinho"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-foreground/40"
      />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="eyebrow">Carrinho ({items.length})</h2>
          <button type="button" aria-label="Fechar" onClick={() => setOpen(false)}>
            <X className="size-5" />
          </button>
        </div>

        <div className="border-b border-border px-5 py-3 text-xs">
          {missing > 0 ? (
            <>
              Faltam <strong>{brl(missing)}</strong> para ganhar frete grátis!
            </>
          ) : (
            <span className="text-pix font-semibold">Você ganhou frete grátis 🎉</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <p className="py-10 text-sm text-muted-foreground">Seu carrinho está vazio.</p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={`${item.handle}-${item.size}`} className="flex gap-3 py-4">
                  <img src={item.image} alt="" className="size-20 object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-snug">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Tamanho {item.size}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          aria-label="Diminuir"
                          className="px-2 py-1"
                          onClick={() => setQty(item.handle, item.size, item.qty - 1)}
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="px-2 text-sm">{item.qty}</span>
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
                        className="text-xs text-muted-foreground underline"
                        onClick={() => remove(item.handle, item.size)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{brl(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border px-5 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="eyebrow">Subtotal</span>
            <strong className="font-display text-lg">{brl(subtotal)}</strong>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Impostos e frete calculados no checkout
          </p>
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="mt-4 block bg-primary px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-primary-foreground"
          >
            Ver carrinho
          </Link>
        </div>
      </aside>
    </div>
  );
}
