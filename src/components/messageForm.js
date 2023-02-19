import { useState, useRef } from "react";
import IntlCurrencyInput from "@/modules/currencyInput";
import TextareaAutosize from "react-textarea-autosize";
import { signIn } from "next-auth/react";

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

export default function MessageForm({ isAuthenticated, user, csrfToken }) {
  const [formData, setFormData] = useState({
    userId: user.id,
    userName: user.name,
    email: user.email,
    token: csrfToken,
  });
  const valueInputRef = useRef(null);
  const updateFormData = (key, value) => {
    formData[key] = value;
    setFormData(formData);
  };
  return (
    <form>
      <div className="mb-3">
        <label
          onClick={() => valueInputRef.current && valueInputRef.current.focus()}
          htmlFor="amount"
          className="block font-medium text-zinc-500 tracking-wide"
        >
          Valor
        </label>
        <IntlCurrencyInput
          required
          name="amount"
          placeholder="Valor"
          className="form-input p-2.5 rounded w-full bg-zinc-600 mb-1 font-semibold"
          max={999.99}
          autoFocus={true}
          currency="BRL"
          config={currencyConfig}
          onChange={({ value }) => {
            updateFormData("amount", value);
            console.log(formData);
          }}
          inputRef={valueInputRef}
        />
        <p className="text-xs font-thin text-rose-300">
          O valor mínimo é R$ 0,99
        </p>
      </div>
      <div className="mb-3">
        <label
          htmlFor="message"
          className="block font-medium text-zinc-500 tracking-wide"
        >
          Mensagem
        </label>
        <TextareaAutosize
          maxLength={200}
          className="form-textarea rounded p-2.5 w-full bg-zinc-600"
          onChange={({ target: { value } }) => {
            updateFormData("message", value);
          }}
          id="message"
        />
        <p className="text-xs font-thin text-rose-300">
          A mensagem pode conter até 200 caracteres
        </p>
      </div>
      <div>
        {isAuthenticated ? (
          <button
            onClick={() => payment()}
            className="transition-all ease-in-out duration-300 bg-violet-800 hover:bg-violet-700 p-3 rounded w-full uppercase tracking-wide font-semibold"
            type="button"
          >
            Continuar
          </button>
        ) : (
          <button
            onClick={() => signIn("twitch")}
            className="transition-all ease-in-out duration-300 bg-violet-800 hover:bg-violet-700 p-3 rounded w-full uppercase tracking-wide font-semibold"
            type="button"
          >
            Entrar com Twitch
          </button>
        )}
      </div>
    </form>
  );
}
