export default function handler(req, res) {
  res
    .status(200)
    .send(
      `Você está em ${req.headers["x-forwarded-proto"]}://${req.headers.host}${
        req.headers["x-matched-path"]
      }, seu IP é ${req.headers["x-real-ip"]} (${decodeURIComponent(
        req.headers["x-vercel-ip-city"]
      )}, ${req.headers["x-vercel-ip-country-region"]} - ${
        req.headers["x-vercel-ip-country"]
      }) (TimeZone: ${req.headers["x-vercel-ip-timezone"]})`
    );
}
