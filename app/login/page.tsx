"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { Loader2, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

import { login } from "@/api/authService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";

type LoginFormState = {
  email: string;
  senha: string;
};

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

function LoginForm() {
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const setSession = useAuthStore((state) => state.setSession);
  const [formState, setFormState] = useState<LoginFormState>({
    email: "",
    senha: "",
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!recaptchaToken) {
      setErrorMessage("Confirme o reCAPTCHA antes de continuar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login({
        email: formState.email.trim(),
        senha: formState.senha,
        recaptchaToken,
      });

      setSession(response);
      router.replace("/");
    } catch (error) {
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      setErrorMessage(
        error instanceof Error ? error.message : "Não foi possível concluir o login."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-[color:rgba(255,255,255,0.7)] bg-[color:rgba(255,251,247,0.95)] shadow-[0_30px_80px_rgba(84,52,35,0.18)] backdrop-blur-xl">
      <CardHeader className="space-y-4">
        <Badge className="w-fit bg-[#EFE4DB] px-3 py-1 text-[#6C4732] hover:bg-[#EFE4DB]">
          <ShieldCheck className="size-3.5" />
          Proteção no navegador
        </Badge>
        <div className="space-y-2">
          <CardTitle className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
            Acesse sua conta
          </CardTitle>
          <CardDescription className="text-base leading-7 text-[var(--muted-ink)]">
            O token do reCAPTCHA é gerado no cliente e enviado junto com o email e a senha.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[var(--ink)]">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="voce@exemplo.com"
              value={formState.email}
              onChange={handleInputChange}
              required
              className="h-12 rounded-xl border-[#E8DDD3] bg-white px-4 text-[var(--ink)] shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="senha" className="text-sm font-medium text-[var(--ink)]">
              Senha
            </label>
            <Input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              value={formState.senha}
              onChange={handleInputChange}
              required
              className="h-12 rounded-xl border-[#E8DDD3] bg-white px-4 text-[var(--ink)] shadow-sm"
            />
          </div>

          <div className="rounded-2xl border border-[#E8DDD3] bg-white p-3 shadow-sm">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={recaptchaSiteKey ?? ""}
              onChange={(token) => {
                setRecaptchaToken(token);

                if (token) {
                  setErrorMessage(null);
                }
              }}
              onExpired={() => setRecaptchaToken(null)}
            />
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-[var(--primary)] text-white shadow-[0_18px_40px_rgba(108,71,50,0.22)] hover:bg-[var(--primary-dark)]"
            disabled={isSubmitting || !recaptchaToken}
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
            {isSubmitting ? "Validando acesso..." : "Entrar"}
          </Button>
        </form>

        {errorMessage ? (
          <p className="rounded-xl border border-[#F0B7B7] bg-[#FFF3F3] px-4 py-3 text-sm text-[#A63B3B]">
            {errorMessage}
          </p>
        ) : null}

        <div className="rounded-2xl bg-[#F8F5F0] p-4 text-sm leading-7 text-[var(--muted-ink)]">
          <p className="font-medium text-[var(--ink)]">Payload enviado ao backend</p>
          <p>email, senha e recaptchaToken</p>
        </div>
      </CardContent>
    </Card>
  );
}

function LoginHero() {
  const highlights = [
    "Desafio visual exibido no formulário",
    "Secret key permanece somente no backend",
    "Compatível com `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`",
  ];

  return (
    <div className="space-y-8 text-white">
      <div className="space-y-4">
        <Badge className="w-fit border border-white/20 bg-white/10 px-3 py-1 text-white hover:bg-white/10">
          <Sparkles className="size-3.5" />
          Login com reCAPTCHA visível
        </Badge>
        <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[0.95] sm:text-6xl">
          Proteção pensada para o fluxo real do cliente.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-white/78">
          A página só permite enviar o login após o desafio de validação humana no navegador,
          mantendo as credenciais sensíveis apenas no backend.
        </p>
      </div>

      <div className="grid gap-3">
        {highlights.map((item) => (
          <div key={item} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 backdrop-blur-sm">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function MissingSiteKeyState() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(108,71,50,0.18),_transparent_34%),linear-gradient(180deg,_#5f3d2b_0%,_#3d251a_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <LoginHero />

        <Card className="border-white/15 bg-[color:rgba(255,251,247,0.96)] shadow-[0_30px_80px_rgba(18,10,6,0.25)]">
          <CardHeader className="space-y-3">
            <CardTitle className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
              Configure o reCAPTCHA
            </CardTitle>
            <CardDescription className="text-base leading-7 text-[var(--muted-ink)]">
              Defina NEXT_PUBLIC_RECAPTCHA_SITE_KEY no .env.local para renderizar o formulário de login.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-[#E8DDD3] bg-[#F8F5F0] p-4 text-sm leading-7 text-[var(--muted-ink)]">
              <p className="font-medium text-[var(--ink)]">Variáveis esperadas no front</p>
              <p>NEXT_PUBLIC_API_URL</p>
              <p>NEXT_PUBLIC_RECAPTCHA_SITE_KEY</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function LoginPage() {
  if (!recaptchaSiteKey) {
    return <MissingSiteKeyState />;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(108,71,50,0.18),_transparent_34%),linear-gradient(180deg,_#5f3d2b_0%,_#3d251a_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <LoginHero />
        <LoginForm />
      </div>
    </main>
  );
}