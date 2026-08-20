import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/ironpay/pwro7egi34")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        let payload: Record<string, unknown> = {};
        try {
          payload = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const token = request.headers.get("x-api-token") ?? new URL(request.url).searchParams.get("api_token");
        const expected = process.env["IRONPAY_API_TOKEN"];
        if (expected && token && token !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        console.log("IronPay postback", {
          hash: payload["transaction_hash"] ?? payload["hash"],
          status: payload["status"],
          amount: payload["amount"],
          method: payload["payment_method"],
        });

        return Response.json({ received: true });
      },
      GET: async () => Response.json({ ok: true }),
    },
  },
});
