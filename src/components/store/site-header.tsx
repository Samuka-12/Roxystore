import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

const logo = { url: "/assets/logo-roxysneakers.png" };
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export const NAV = [
  { handle: "lancamentos", title: "Lançamentos" },
  { handle: "mais-vendidos", title: "Mais vendidos" },
  { handle: "esportivos", title: "Esportivos" },
  { handle: "chuteiras-1", title: "Chuteiras" },
  { handle: "nike", title: "Nike" },
  { handle: "adidas", title: "Adidas" },
  { handle: "air-jordan", title: "Air Jordan" },
  { handle: "new-balance", title: "New Balance" },
  { handle: "asics", title: "Asics" },
  { handle: "on-running", title: "On Running" },
  { handle: "yeezy", title: "Yeezy" },
  { handle: "conjuntos", title: "Conjuntos" },
  { handle: "copa-do-mundo", title: "Copa do Mundo" },
];

export function Marquee() {
  const text = "Produtos exclusivos 🔥 RoxyStore - Brasil · Ofertas válidas por tempo limitado";
  return (
    <div className="overflow-hidden border-b border-border bg-primary py-2 text-primary-foreground">
      <div className="marquee-track">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="eyebrow whitespace-nowrap px-6">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState("");
  const { count, setOpen } = useCart();
  const navigate = useNavigate();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!term.trim()) return;
    setSearchOpen(false);
    navigate({ to: "/busca", search: { q: term.trim() } });
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur">
      <div className="hidden bg-primary py-2 text-center text-primary-foreground md:block">
        <span className="eyebrow">Parcele em 12x no cartão · Frete grátis acima de R$ 199</span>
      </div>
      <Marquee />
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 lg:px-8">
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="p-2 lg:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link to="/" className="flex shrink-0 items-center">
          <img src={logo.url} alt="RoxyStore - Brasil" className="h-28 w-auto md:h-40" />
        </Link>

        <nav className="mx-auto hidden max-w-3xl flex-wrap justify-center gap-x-5 gap-y-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.handle}
              to="/collections/$handle"
              params={{ handle: item.handle }}
              className="text-sm text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground underline underline-offset-4" }}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <button
            type="button"
            aria-label="Buscar"
            onClick={() => setSearchOpen((v) => !v)}
            className="p-2"
          >
            <Search className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Abrir carrinho"
            onClick={() => setOpen(true)}
            className="relative p-2"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-sale text-[10px] font-bold text-sale-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={submitSearch} className="border-t border-border bg-background px-4 py-3">
          <div className="mx-auto flex max-w-[1400px] items-center gap-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              autoFocus
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Buscar tênis, chuteiras, conjuntos..."
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </form>
      )}

      <nav
        className={cn(
          "border-t border-border bg-background lg:hidden",
          menuOpen ? "block" : "hidden",
        )}
      >
        <ul className="grid grid-cols-2 gap-px bg-border">
          {NAV.map((item) => (
            <li key={item.handle} className="bg-background">
              <Link
                to="/collections/$handle"
                params={{ handle: item.handle }}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
