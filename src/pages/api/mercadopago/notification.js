import { MerchantOrder, Payment } from "@/lib/api/payments";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const id = req.body?.data?.id || req.query?.id || req.query?.["data.id"];
      const type = req.body?.type || req.query?.topic;
      if (type === "payment" && !!id) {
        const payment = await Payment(id);
        console.log("Payment:", payment);
      }
      if (type === "merchant_order" && !!id) {
        const order = await MerchantOrder(id);
        console.log("MerchantOrder:", order);
      }
      return res.status(200).send("ok");
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
