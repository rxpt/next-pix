import { Notification } from "@/lib/api/payments";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const id = req.query.data.id;
      const type = req.query.type;
      if (type === "payment" && !!id) {
        await Notification(id);
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
