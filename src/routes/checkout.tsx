import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Clipboard, LockKeyhole, QrCode, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import QRCode from "qrcode";

import { brl, useCart } from "@/lib/cart";
import { createPixCharge, type PixCharge } from "@/lib/checkout.functions";

const PIX_DISCOUNT = 0.95;

type CustomerForm = {
  name: string;
  email: string;
  phone: string;
  document: string;
  zip_code: string;
  street_name: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

const initialCustomer: CustomerForm = {
  name: "",
  email: "",
  phone: "",
  document: "",
  zip_code: "",
  street_name: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout seguro | RoxyStore - Brasil" },
      {
        name: "description",
        content: "Finalize sua compra com Pix de forma segura na RoxyStore - Brasil.",
      },
      { property: "og:title", content: "Checkout seguro | RoxyStore - Brasil" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [customer, setCustomer] = useState<CustomerForm>(initialCustomer);
  const [charge, setCharge] = useState<PixCharge | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pixTotal = useMemo(() => subtotal * PIX_DISCOUNT, [subtotal]);

  function updateCustomer(field: keyof CustomerForm, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setCharge(null);
    setCopied(false);

    if (items.length === 0) {
      setError("Seu carrinho está vazio. Adicione um produto antes de finalizar.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createPixCharge({
        data: {
          customer,
          items,
        },
      });
      setCharge(result);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Não foi possível gerar o Pix.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function copyPixCode() {
    if (!charge?.payload) return;
    await navigator.clipboard.writeText(charge.payload);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-[760px] px-4 py-16 text-center lg:px-8">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-muted">
          <QrCode className="size-7 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-extrabold uppercase">
          Seu carrinho está vazio
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Escolha seus produtos para continuar para o checkout.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-bold uppercase text-primary-foreground"
        >
          <ArrowLeft className="size-4" /> Voltar para a loja
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-muted/30 px-4 py-8 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow text-muted-foreground">RoxyStore - Brasil</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold uppercase md:text-4xl">
              Checkout seguro
            </h1>
            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <LockKeyhole className="size-3.5 text-pix" /> Dados protegidos e pagamento processado
              pela IronPay.
            </p>
          </div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm underline underline-offset-4"
          >
            <ArrowLeft className="size-4" /> Voltar ao carrinho
          </Link>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="border border-border bg-background p-5 md:p-7">
              <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
                <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  1
                </span>
                <div>
                  <h2 className="font-display text-xl font-extrabold uppercase">Dados pessoais</h2>
                  <p className="text-xs text-muted-foreground">
                    Usaremos estes dados para confirmar o pedido.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Nome completo"
                  value={customer.name}
                  onChange={(value) => updateCustomer("name", value)}
                  required
                  className="md:col-span-2"
                />
                <Field
                  label="E-mail"
                  type="email"
                  value={customer.email}
                  onChange={(value) => updateCustomer("email", value)}
                  required
                />
                <Field
                  label="WhatsApp"
                  value={customer.phone}
                  onChange={(value) => updateCustomer("phone", value)}
                  required
                />
                <Field
                  label="CPF"
                  value={customer.document}
                  onChange={(value) => updateCustomer("document", value)}
                  required
                  className="md:col-span-2"
                />
              </div>
            </section>

            <section className="border border-border bg-background p-5 md:p-7">
              <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
                <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  2
                </span>
                <div>
                  <h2 className="font-display text-xl font-extrabold uppercase">
                    Endereço de entrega
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Preencha o endereço que receberá o pedido.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="CEP"
                  value={customer.zip_code}
                  onChange={(value) => updateCustomer("zip_code", value)}
                  required
                />
                <Field
                  label="Número"
                  value={customer.number}
                  onChange={(value) => updateCustomer("number", value)}
                  required
                />
                <Field
                  label="Endereço"
                  value={customer.street_name}
                  onChange={(value) => updateCustomer("street_name", value)}
                  required
                  className="md:col-span-2"
                />
                <Field
                  label="Complemento (opcional)"
                  value={customer.complement}
                  onChange={(value) => updateCustomer("complement", value)}
                />
                <Field
                  label="Bairro"
                  value={customer.neighborhood}
                  onChange={(value) => updateCustomer("neighborhood", value)}
                  required
                />
                <Field
                  label="Cidade"
                  value={customer.city}
                  onChange={(value) => updateCustomer("city", value)}
                  required
                />
                <Field
                  label="UF"
                  maxLength={2}
                  value={customer.state}
                  onChange={(value) => updateCustomer("state", value.toUpperCase())}
                  required
                />
              </div>
            </section>

            <section className="border border-border bg-background p-5 md:p-7">
              <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
                <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  3
                </span>
                <div>
                  <h2 className="font-display text-xl font-extrabold uppercase">
                    Pagamento via Pix
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Receba o QR Code após confirmar seus dados.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 border border-pix/30 bg-pix/5 p-4">
                <QrCode className="mt-0.5 size-5 shrink-0 text-pix" />
                <div className="text-sm">
                  <p className="font-semibold">Pix com 5% de desconto</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    O QR Code é gerado pela IronPay e vinculado aos produtos abaixo.
                  </p>
                </div>
              </div>
              {error && (
                <p className="mt-4 border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-bold uppercase tracking-wide text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                <QrCode className="size-4" /> {submitting ? "Gerando Pix..." : "Gerar QR Code Pix"}
              </button>
            </section>

            {charge && (
              <section className="border border-pix/40 bg-background p-5 text-center md:p-7">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-pix text-pix-foreground">
                  <Check className="size-6" />
                </div>
                <h2 className="mt-4 font-display text-2xl font-extrabold uppercase">Pix gerado</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pague {brl(charge.amount / 100)} para confirmar seu pedido.
                </p>
                <div className="mx-auto mt-6 max-w-[280px] border border-border bg-white p-4">
                  <PixQrCode value={charge.payload} />
                </div>
                <button
                  type="button"
                  onClick={copyPixCode}
                  className="mx-auto mt-5 inline-flex items-center gap-2 border border-border px-4 py-3 text-xs font-bold uppercase"
                >
                  {copied ? (
                    <Check className="size-4 text-pix" />
                  ) : (
                    <Clipboard className="size-4" />
                  )}
                  {copied ? "Código copiado" : "Copiar código Pix"}
                </button>
                <p className="mt-4 break-all text-[11px] text-muted-foreground">{charge.payload}</p>
              </section>
            )}
          </form>

          <aside className="border border-border bg-background lg:sticky lg:top-28">
            <div className="border-b border-border p-5">
              <h2 className="font-display text-xl font-extrabold uppercase">Resumo do pedido</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {items.reduce((total, item) => total + item.qty, 0)} item(ns) no carrinho
              </p>
            </div>
            <ul className="divide-y divide-border px-5">
              {items.map((item) => (
                <li key={`${item.handle}-${item.size}`} className="flex gap-3 py-4">
                  <img src={item.image} alt="" className="size-20 shrink-0 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Tamanho {item.size} · Quantidade {item.qty}
                    </p>
                    <p className="mt-2 text-sm font-semibold">{brl(item.price * item.qty)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-border p-5 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong>{brl(subtotal)}</strong>
              </div>
              <div className="flex justify-between text-pix">
                <span>Pix (5% off)</span>
                <strong>{brl(pixTotal)}</strong>
              </div>
              <div className="flex justify-between border-t border-border pt-3 font-display text-xl font-extrabold">
                <span>Total no Pix</span>
                <strong>{brl(pixTotal)}</strong>
              </div>
              <p className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                <Truck className="size-4" /> Frete grátis acima de R$ 199
              </p>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4" /> Compra protegida
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  maxLength,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        maxLength={maxLength}
        className="w-full border border-border bg-background px-3 py-3 text-sm outline-none transition-colors focus:border-primary"
      />
    </label>
  );
}

function PixQrCode({ value }: { value: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSrc(null);
    QRCode.toDataURL(value, { width: 240, margin: 1, errorCorrectionLevel: "M" }).then(
      (dataUrl) => {
        if (!cancelled) setSrc(dataUrl);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [value]);

  if (!src)
    return (
      <div className="grid aspect-square place-items-center bg-muted text-xs text-muted-foreground">
        Gerando QR Code...
      </div>
    );
  return (
    <img src={src} alt="QR Code Pix para pagamento" className="mx-auto aspect-square w-full" />
  );
}

export default CheckoutPage;
