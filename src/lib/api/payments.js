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
 * Calculates payment information based on the desired original value and interest rate (fee).
 * @param {number|string} originalValue - The original value to be paid. If a string is passed, removes non-numeric characters.
 * @param {number} fee - The interest rate in percentage (e.g. 10 for 10%).
 * @returns {object} - An object with the total value to be paid (including all fees), the total value of the fees, the value with all fees and taxes included, the value of the fees only, the value without any fee coverage and the value with all fees and taxes included except the originalValue.
 */
export function calculatePayment(originalValue, fee) {
  // converte originalValue para número e remove caracteres não numéricos se necessário
  originalValue =
    typeof originalValue === "string"
      ? Number(originalValue.replace(/\D/g, "")) / 100
      : Number(originalValue);

  // converte a taxa de porcentagem para decimal
  fee /= 100;

  // calcula o valor da taxa sobre o valor original
  const feeValue = originalValue * fee;

  // calcula o valor sem a taxa
  const charged = originalValue - feeValue;

  // calcula o valor total a ser pago (valor original + taxa sobre o valor original + taxa sobre a taxa)
  const totalValue = originalValue + feeValue + feeValue * fee;

  // calcula o valor total da taxa
  const totalValueFee = totalValue - originalValue;

  // calcula o valor total sem a taxa
  const totalCharged = totalValue - totalValueFee;

  // cria um objeto JSON com as informações
  const result = {
    originalValue: Number(originalValue.toFixed(2)),
    totalValue: Number(totalValue.toFixed(2)),
    totalFee: Number(totalValueFee.toFixed(2)),
    fee: Number(feeValue.toFixed(2)),
    charged: Number(charged.toFixed(2)),
    totalCharged: Number(totalCharged.toFixed(2)),
  };

  // retorna o objeto JSON com as informações
  return result;
}

export async function CreateOrder(metadata, unit_price, notification_url) {
  try {
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

export async function MerchantOrder(id) {
  try {
    return await mercadopago.merchant_orders.get(id).then(({ body }) => {
      if (!body) throw new Error("Non-existent data");
      return body;
    });
  } catch (err) {
    return err;
  }
}

export async function Payment(id) {
  try {
    return await mercadopago.payment.get(id).then(async ({ body }) => {
      if (!body) throw new Error("Non-existent data");
      return body;
    });
  } catch (err) {
    return err;
  }
}

export async function SendAlertData(
  user = {},
  message = "",
  amount = 0,
  currency = "brl",
  isTest = false
) {
  return await axios.post(
    `https://api.streamelements.com/kappa/v2/tips/${channel}`,
    {
      imported: !isTest,
      provider: "MercadoPago",
      currency: String(currency).toUpperCase(),
      message,
      amount,
      user,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STREAMELEMENTS_TOKEN}`,
      },
    }
  );
}
