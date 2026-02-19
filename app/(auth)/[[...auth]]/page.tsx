import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewPasswordForm } from "../_components/new-password-form";
import { RequestForm } from "../_components/request-form";
import { VerifyOTPForm } from "../_components/verify-otp-form";
import { LoginForm } from "../_components/login-form";
import { RegisterForm } from "../_components/register-form";

type Props = {
  params: Promise<{ auth?: string[] }>;
};

function resolveRoute(auth?: string[]) {
  if (!auth || auth.length === 0) {
    return notFound(); // default route
  }

  if (auth[0] === "login") return "login";
  if (auth[0] === "register") return "register";

  if (auth[0] === "password") {
    return auth[1]; // request | verify | new
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { auth } = await params;
  const route = resolveRoute(auth);

  const titles: Record<string, string> = {
    login: "Sign in to your account",
    register: "Create your account",
    request: "Recover your account",
    verify: "Enter verification code",
    new: "Set your new password",
  };

  return {
    title: route ? titles[route] : undefined,
  };
}

export default async function Page({ params }: Props) {
  const { auth } = await params;
  const route = resolveRoute(auth);

  switch (route) {
    case "login":
      return <LoginForm />;

    case "register":
      return <RegisterForm />; // change if you have RegisterForm

    case "request":
      return <RequestForm />;

    case "verify":
      return <VerifyOTPForm />;

    case "new":
      return <NewPasswordForm />;

    default:
      notFound();
  }
}
