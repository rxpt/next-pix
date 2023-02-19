import { Notification } from "@/lib/api/payments";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const id = req.body?.data?.id || req.query?.id || req.query?.["data.id"];
      const type = req.body?.type || req.query?.topic;
      if (type === "payment" && !!id) {
        const notification = await Notification(id);
        console.log(notification);
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
