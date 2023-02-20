import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import IntlCurrencyInput from "@/modules/currencyInput";
import TextareaAutosize from "react-textarea-autosize";
import { signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import {
  FaTwitch,
  FaArrowRight,
  FaExclamationCircle,
  FaRocket,
} from "react-icons/fa";
import Tooltip from "./tooltip";

const currencyConfig = {
  locale: "pt-BR",
  formats: {
    number: {
      BRL: {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

const cookies = Cookies.withConverter({
  read: function (value, name) {
    try {
      return JSON.parse(value);
    } catch {
      return Cookies.converter.read(value, name);
    }
  },
  write: function (value, name) {
    try {
      return JSON.stringify(value);
    } catch {
      return Cookies.converter.write(value, name);
    }
  },
});

const cookieName = "__Form-pix.data";

export default function MessageForm({ isAuthenticated, user, csrfToken }) {
  const valueInputRef = useRef(null);
  const defaultData = {
    message: "",
    amount: 0,
    coverFee: false,
    userId: user.id,
    userName: user.name,
    email: user.email,
    token: csrfToken,
  };
  const [formData, setFormData] = useState(defaultData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  useEffect(() => {
    const cookieData = cookies.get(cookieName);
    if (cookieData) setFormData(cookieData);
  }, []);
  useEffect(() => {
    if (isAuthenticated)
      setSubmitDisabled(formData.amount < 0.99 || formData.amount > 999.99);
  }, [formData]);
  const updateFormData = (key, value) => {
    setFormData((oldData) => {
      const newData = { ...oldData, [key]: value };
      cookies.set(cookieName, newData, { expires: 7, path: "" });
      return newData;
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitDisabled(true);
    try {
      if (formData.amount < 0.99 || formData.amount > 999.99) {
        valueInputRef.current && valueInputRef.current.focus();
        throw new Error("Este valor não é válido!");
      }
      setIsSubmitting(true);
      const JSONdata = JSON.stringify(formData);
      const endpoint = "/api/mercadopago/payment";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONdata,
      };
      const response = await fetch(endpoint, options);
      const result = await response.json();
      if (result.hasOwnProperty("payment_url")) {
        cookies.remove(cookieName, { path: "" });
        return (window.location.href = result.payment_url);
      }
      throw new Error("Tente novamente mais tarde.");
    } catch (err) {
      toast.error(err.message);
      setIsSubmitting(false);
      setSubmitDisabled(false);
    }
  };
  return (
    <>
      <Toaster position="bottom-center" />
      <form onSubmit={handleSubmit}>
        <div className="relative flex w-full flex-wrap items-stretch mb-3">
          <label
            onClick={() =>
              valueInputRef.current && valueInputRef.current.focus()
            }
            htmlFor="amount"
            className="block font-medium text-zinc-500 tracking-wide"
          >
            Valor
          </label>
          <IntlCurrencyInput
            required
            name="amount"
            placeholder="Valor"
            className="form-input p-2.5 rounded w-full bg-zinc-600 focus:shadow-xl focus:font-semibold focus:border-violet-500 focus:outline-none focus:ring-violet-500 focus:text-violet-300"
            max={999.99}
            autoFocus={true}
            currency="BRL"
            config={currencyConfig}
            onChange={({ value }) => {
              updateFormData("amount", value);
            }}
            defaultValue={formData.amount}
            inputRef={valueInputRef}
          />
          <p className="text-xs font-thin text-rose-300">
            O valor mínimo é R$ 0,99
          </p>
        </div>
        <div className="relative flex w-full flex-wrap items-stretch mb-3">
          <label className="block font-medium text-sm text-zinc-500 tracking-wide">
            <input
              name="coverFee"
              className="form-checkbox rounded bg-zinc-600 mb-1 text-violet-600 focus:ring-violet-500"
              onChange={({ target: { checked } }) => {
                updateFormData("coverFee", checked);
              }}
              type={"checkbox"}
              defaultChecked={formData.coverFee}
            />{" "}
            Cobrir taxa?
          </label>
        </div>
        <div className="relative flex w-full flex-wrap items-stretch mb-3">
          <label
            htmlFor="message"
            className="block font-medium text-zinc-500 tracking-wide"
          >
            Mensagem
          </label>
          <TextareaAutosize
            maxLength={200}
            placeholder="Digite sua mensagem"
            className="form-textarea rounded p-2.5 w-full bg-zinc-600 focus:shadow-xl focus:font-semibold focus:border-violet-500 focus:outline-none focus:ring-violet-500 focus:text-violet-300 placeholder:text-white focus:placeholder:text-violet-300"
            onChange={({ target: { value } }) => {
              updateFormData("message", value);
            }}
            name="message"
            defaultValue={formData.message}
          />
          <p className="text-xs font-thin text-rose-300">
            A mensagem pode conter até 200 caracteres
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => (!isAuthenticated ? signIn("twitch") : void 0)}
            className="tracking-wide w-full bg-violet-500 text-white active:bg-violet-600 font-bold uppercase text-base px-8 py-3 rounded shadow-md hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-zinc-500 disabled:text-zinc-300 disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={submitDisabled}
            type={isAuthenticated ? "submit" : "button"}
          >
            {isAuthenticated ? (
              <>
                Continuar{" "}
                {submitDisabled ? (
                  isSubmitting ? (
                    <FaRocket />
                  ) : (
                    <Tooltip message="Valor mínimo: R$ 0,99" position="left">
                      <FaExclamationCircle
                        className="tooltip-error"
                        data-tooltip-variant="error"
                      />
                    </Tooltip>
                  )
                ) : (
                  <FaArrowRight />
                )}
              </>
            ) : (
              <>
                <FaTwitch /> Entrar com Twitch
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
