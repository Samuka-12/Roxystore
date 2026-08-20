import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, ShieldCheck, Truck, CreditCard } from "lucide-react";

const logo = { url: "/assets/logo-roxysneakers.png" };
import { NAV } from "./site-header";

export function TrustBar() {
  const items = [
    { icon: Truck, title: "Frete grátis", text: "Em compras acima de R$ 199" },
    { icon: CreditCard, title: "Parcele em 12x", text: "Ou 5% off no pix" },
    { icon: ShieldCheck, title: "Compra segura", text: "Troca em até 30 dias" },
  ];
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-8 sm:grid-cols-3 lg:px-8">
        {items.map((i) => (
          <div key={i.title} className="flex items-center gap-3">
            <i.icon className="size-6 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="eyebrow">{i.title}</p>
              <p className="text-xs text-muted-foreground">{i.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <img src={logo.url} alt="RoxyStore - Brasil" className="h-16 w-auto" />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            RoxyStore - Brasil reúne os lançamentos mais desejados de tênis, chuteiras e streetwear
            com envio para todo o Brasil.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="https://instagram.com" aria-label="Instagram" className="p-2">
              <Instagram className="size-5" />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="p-2">
              <Facebook className="size-5" />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow">Coleções</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {NAV.slice(0, 7).map((item) => (
              <li key={item.handle}>
                <Link to="/collections/$handle" params={{ handle: item.handle }}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Atendimento</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Trocas e devoluções</li>
            <li>Prazo de entrega</li>
            <li>Formas de pagamento</li>
            <li>Fale conosco</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} RoxyStore - Brasil. Todos os direitos reservados.
      </div>
    </footer>
  );
}
