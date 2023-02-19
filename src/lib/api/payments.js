import { v4 as uuid } from "uuid";
import axios from "axios";
import mercadopago from "mercadopago";
import { decode } from "jsonwebtoken";

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const { channel } = decode(process.env.STREAMELEMENTS_TOKEN);

/**
 * Formats a numeric value into a specified currency format.
 * @param {number} value - The numeric value to be formatted.
 * @param {string} locale - The locale to be used for formatting (e.g. "pt-BR").
 * @param {string} currency - The currency to be used for formatting (e.g. "BRL").
 * @returns {string} - The value formatted as specified currency.
 */
export function formatCurrency(value, locale, currency) {
  return Number(value).toLocaleString(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Calculates payment information based on desired value and interest rate.
 * @param {number|string} desiredValue - The desired payment value. If a string is passed, removes non-numeric characters.
 * @param {number} interestRate - The interest rate in percentage (e.g. 10 for 10%).
 * @returns {object} - An object with the total value to be paid, the interest rate value, the payment value, and the value without interest rate coverage.
 */
export function calculatePayment(desiredValue, interestRate) {
  // checks if the desired value is a string and removes non-numeric characters
  if (typeof desiredValue === "string") {
    desiredValue = Number(desiredValue.replace(/\D/g, "")) / 100;
  } else {
    desiredValue = Number(desiredValue);
  }
  // converts the interest rate from percentage to decimal
  interestRate = interestRate / 100;
  // calculates the total value to be paid (desired value + interest rate)
  const totalValue = desiredValue / (1 - interestRate);
  // calculates the interest rate value
  const interestValue = totalValue - desiredValue;
  // calculates the value without interest rate coverage
  const noInterestValue = desiredValue / (interestRate * 100);
  // creates a JSON object with the information
  const result = {
    originalValue: Number(desiredValue.toFixed(2)),
    totalValue: Number(totalValue.toFixed(2)),
    interestValue: Number(interestValue.toFixed(2)),
    noInterestValue: Number(noInterestValue.toFixed(2)),
  };
  // returns the JSON object with the information
  return result;
}

export async function Payment(metadata, unit_price, notification_url) {
  try {
    /*
    metadata.userId
    metadata.userName
    metadata.message
    metadata.email
    metadata.amount
    */
    const reference_id = uuid();
    const {
      body: { init_point: redirectURI },
    } = await mercadopago.preferences.create({
      items: [
        {
          id: reference_id,
          title: "Mensagem",
          description: "Envie mensagem para o Streamer",
          category_id: "donations",
          currency_id: "BRL",
          unit_price,
          quantity: 1,
        },
      ],
      payer: {
        email: metadata.email,
      },
      notification_url,
      statement_descriptor: "TWITCHXOGUM",
      external_reference: `${metadata.userId}.${reference_id}`,
      metadata,
    });
    return redirectURI;
  } catch (err) {
    return err;
  }
}

export async function Notification(id) {
  try {
    return await mercadopago.payment.get(id).then(async ({ body }) => {
      if (!body) throw new Error("Non-existent data");
      const { status, metadata, currency_id } = body;
      if (status === "approved") {
        await axios.post(
          `https://api.streamelements.com/kappa/v2/tips/${channel}`,
          {
            user: {
              userId: metadata?.user_id || metadata?.userId,
              username: metadata?.user_name || metadata?.userName,
              email: metadata?.email,
            },
            provider: "MercadoPago",
            message: metadata?.message,
            amount: metadata?.amount,
            currency: String(currency_id).toUpperCase(),
            imported: true,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.STREAMELEMENTS_TOKEN}`,
            },
          }
        );
      }
      return body;
    });
  } catch (err) {
    return err;
  }
}
