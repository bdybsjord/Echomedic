import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { useAuth } from "../context/useAuth";

type LoginErrors = {
  email?: string;
  password?: string;
};

const LAST_USER_KEY = "echomedic-last-user";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(() => {
    // Lazy init: kjøres kun ved første render
    if (typeof window === "undefined") {
      return "leder@echomedic.no";
    }
    const last = localStorage.getItem(LAST_USER_KEY);
    return last ?? "leder@echomedic.no";
  });

  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const validate = (): LoginErrors => {
    const next: LoginErrors = {};
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    if (!emailTrimmed) {
      next.email = "E-postadresse må fylles ut.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailTrimmed)) {
      next.email = "Oppgi en gyldig e-postadresse.";
    }

    if (!passwordTrimmed) {
      next.password = "Passord må fylles ut.";
    } else if (passwordTrimmed.length < 6) {
      next.password = "Passord bør være minst 6 tegn.";
    }

    return next;
  };

  const isFormValid = () => {
    const validation = validate();
    return !validation.email && !validation.password;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const validation = validate();
    setErrors(validation);

    // Fokus på første feilfelt
    if (validation.email && emailRef.current) {
      emailRef.current.focus();
      return;
    }
    if (validation.password && passwordRef.current) {
      passwordRef.current.focus();
      return;
    }

    setIsSubmitting(true);

    // Fake “backend”-delay
    await new Promise((resolve) => setTimeout(resolve, 700));

    const emailNormalized = email.trim().toLowerCase();
    if (emailNormalized !== "leder@echomedic.no") {
      setFormError(
        "Innlogging feilet. Sjekk e-post og passord (mock-feil for demo)."
      );
      setIsSubmitting(false);
      return;
    }

    login(emailNormalized);

    if (remember) {
      // I senere sprint kan vi lagre JWT/token i secure storage.
      localStorage.setItem(LAST_USER_KEY, emailNormalized);
    }

    setIsSubmitting(false);
    navigate("/", { replace: true });
  };

  const disableSubmit = !isFormValid() || isSubmitting;

  return (
    <div className="min-h-screen echomedic-gradient flex items-center justify-center px-4 py-10">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* Venstre side – kontekst */}
        <div className="hidden lg:flex flex-col justify-between text-slate-100">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              Echomedic
              <span className="ml-2 bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                Risikoportal
              </span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-slate-300">
              Logg inn for å få oversikt over sikkerhetsrisikoer, tiltak og
              modenhet på tvers av Echomedic sine løsninger. Denne portalen er
              en intern prototype utviklet i PRO203 Smidig prosjekt.
            </p>
          </div>

          <div className="mt-10 space-y-4 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/40">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              </div>
              <div>
                <p className="font-semibold text-slate-100">
                  Sanntidsoversikt over risiko
                </p>
                <p className="text-slate-400">
                  Dashboardet prioriterer røde risikoer og forslag til tiltak
                  for ledelsen.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/40">
                <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.9)]" />
              </div>
              <div>
                <p className="font-semibold text-slate-100">
                  Bygget for Normen & ISO 27001
                </p>
                <p className="text-slate-400">
                  Designet for å støtte systematisk risikostyring og
                  dokumentasjon for revisjon.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Høyre side – login-kort */}
        <Card className="max-w-md w-full mx-auto">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">
              Sikker lederinnlogging
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-50">
              Logg inn til risiko-dashboard
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Bruk demo-bruker{" "}
              <span className="font-mono text-cyan-300">
                leder@echomedic.no
              </span>{" "}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              ref={emailRef}
              label="E-post"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <Input
              ref={passwordRef}
              label="Passord"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex cursor-pointer items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-400 focus:ring-cyan-400"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Husk meg på denne enheten</span>
              </label>
              <button
                type="button"
                className="text-xs font-medium text-sky-400 hover:text-sky-300"
              >
                Glemt passord?
              </button>
            </div>

            {/* Form-feil – annonsert for skjermlesere */}
            {formError && (
              <div
                className="rounded-lg border border-rose-500/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-100"
                role="alert"
                aria-live="polite"
              >
                {formError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              loading={isSubmitting}
              disabled={disableSubmit}
            >
              {isSubmitting ? "Logger inn..." : "Logg inn som leder"}
            </Button>
          </form>

          <p className="mt-6 text-[11px] leading-relaxed text-slate-500">
            Ved å logge inn bekrefter du at du er autorisert til å se
            sikkerhetsinformasjon for Echomedic. Denne portalen er kun en
            studie-prototype og skal ikke brukes til behandling av ekte
            pasientdata.
          </p>
        </Card>
      </div>
    </div>
  );
}
