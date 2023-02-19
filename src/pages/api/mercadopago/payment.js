import { Payment, calculatePayment } from "@/lib/api/payments";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const session = await getSession({ req });
    if (!session || session.user.name !== req.body.userName) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    try {
      const payment = calculatePayment(req.body.amount, 4.89);
      const paymentValue = req.body.coverFee
        ? payment.totalValue
        : payment.originalValue;
      const result = await Payment(req.body, paymentValue);
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
