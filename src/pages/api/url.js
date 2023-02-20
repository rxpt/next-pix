export default function handler(req, res) {
  res
    .status(404)
    .send(
      `You're here: ${req.headers["x-forwarded-proto"]}://${req.headers.host}${
        req.headers["x-matched-path"]
      }. Your IP is ${req.headers["x-real-ip"]} (${decodeURIComponent(
        req.headers["x-vercel-ip-city"]
      )}, ${req.headers["x-vercel-ip-country-region"]} - ${
        req.headers["x-vercel-ip-country"]
      }) (TimeZone: ${req.headers["x-vercel-ip-timezone"]})`
    );
}
