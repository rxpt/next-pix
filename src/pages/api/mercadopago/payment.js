import { CreateOrder, calculatePayment } from "@/lib/api/payments";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    try {
      const payment = calculatePayment(req.body.amount, 4.89);
      const paymentValue = req.body.coverFee
        ? payment.totalValue
        : payment.originalValue;
      const result = await CreateOrder(
        req.body,
        paymentValue,
        `https://${
          req.headers.host || process.env.SITE_BASEURL_URL
        }/api/mercadopago/notification`
      );
      return res.status(200).json({ payment_url: result });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: err.toString(),
      });
    }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
