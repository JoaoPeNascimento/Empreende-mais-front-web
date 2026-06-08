"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, MessageCircle, ShoppingBag } from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";

import { Button } from "./ui/button";

const Header = () => {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-white/86 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-[var(--highlight)] ring-1 ring-[var(--line)]">
            <Image src="/logo.svg" alt="Donna Glamour" width={26} height={26} />
          </span>
          <span className="leading-none">
            <span className="block font-[family-name:var(--font-display)] text-xl text-[var(--primary)]">
              Donna Glamour
            </span>
            <span className="hidden text-xs uppercase tracking-[0.22em] text-[var(--muted-ink)] sm:block">
              Moda feminina
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="size-10 rounded-full border-[var(--line-strong)] bg-white text-[var(--primary)] hover:bg-[var(--highlight)]"
            aria-label="Carrinho"
          >
            <Link href="/checkout">
              <ShoppingBag className="size-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="hidden h-10 rounded-full border-[var(--line-strong)] bg-white px-4 text-[var(--primary)] hover:bg-[var(--highlight)] sm:inline-flex"
          >
            <a href="https://wa.me/558199025395" target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
          </Button>

          {session ? (
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-full border-[var(--line-strong)] bg-white px-4 text-[var(--primary)] hover:bg-[var(--highlight)]"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              Sair
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-full border-[var(--line-strong)] bg-white px-4 text-[var(--primary)] hover:bg-[var(--highlight)]"
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Entrar
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
