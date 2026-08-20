import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const itemSchema = z.object({
  handle: z.string().min(1),
  title: z.string().min(1),
  image: z.string().optional(),
  price: z.number().nonnegative(),
  size: z.string(),
  qty: z.number().int().min(1).max(20),
});

const inputSchema = z.object({
  customer: z.object({
    name: z.string().min(3).max(120),
    email: z.string().email(),
    phone: z.string().min(10).max(20),
    document: z.string().min(11).max(18),
    zip_code: z.string().min(8).max(9),
    street_name: z.string().min(2).max(160),
    number: z.string().min(1).max(20),
    complement: z.string().max(80).optional(),
    neighborhood: z.string().min(2).max(80),
    city: z.string().min(2).max(80),
    state: z.string().min(2).max(2),
  }),
  items: z.array(itemSchema).min(1).max(30),
});

export type PixCharge = {
  hash: string;
  amount: number;
  payload: string;
  expires_at: string | null;
};

const digits = (v: string) => v.replace(/\D/g, "");

export const createPixCharge = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<PixCharge> => {
    const token = process.env["IRONPAY_API_TOKEN"];
    const offerHash = process.env["IRONPAY_OFFER_HASH"];
    if (!token) throw new Error("Pagamento indisponível: token da IronPay não configurado.");

    // 5% de desconto no Pix, valores em centavos
    const amount = Math.round(
      data.items.reduce((sum, i) => sum + i.price * i.qty, 0) * 0.95 * 100,
    );

    const body = {
      amount,
      ...(offerHash ? { offer_hash: offerHash } : {}),
      payment_method: "pix",
      customer: {
        name: data.customer.name,
        email: data.customer.email,
        phone_number: digits(data.customer.phone),
        document: digits(data.customer.document),
        street_name: data.customer.street_name,
        number: data.customer.number,
        complement: data.customer.complement ?? "",
        neighborhood: data.customer.neighborhood,
        city: data.customer.city,
        state: data.customer.state.toUpperCase(),
        zip_code: digits(data.customer.zip_code),
      },
      cart: data.items.map((i) => ({
        product_hash: i.handle.slice(0, 32),
        title: `${i.title} - Tam ${i.size}`,
        cover: i.image ?? null,
        price: Math.round(i.price * 0.95 * 100),
        quantity: i.qty,
        operation_type: 1,
        tangible: true,
      })),
      expire_in_days: 1,
      transaction_origin: "api",
      postback_url: `${process.env["PUBLIC_SITE_URL"] ?? "https://roxy-brasil-rebrand.lovable.app"}/api/public/ironpay/pwro7egi34`,
    };

    const res = await fetch(
      `https://api.ironpayapp.com.br/api/public/v1/transactions?api_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      },
    );

    const text = await res.text();
    if (!res.ok) {
      console.error(`IronPay transaction failed [${res.status}]: ${text}`);
      throw new Error(`Falha ao gerar o Pix (${res.status}). Tente novamente.`);
    }

    const json = JSON.parse(text) as Record<string, any>;
    const tx = json.data ?? json.transaction ?? json;
    const pix = tx.pix ?? tx.pix_information ?? {};
    const payload: string =
      pix.pix_qr_code ?? pix.qr_code ?? pix.payload ?? pix.emv ?? tx.qr_code ?? "";

    if (!payload) {
      console.error(`IronPay response without pix payload: ${text}`);
      throw new Error("A IronPay não retornou o código Pix.");
    }

    return {
      hash: String(tx.hash ?? tx.transaction_hash ?? ""),
      amount,
      payload,
      expires_at: pix.pix_expiration_date ?? tx.expires_at ?? null,
    };
  });
