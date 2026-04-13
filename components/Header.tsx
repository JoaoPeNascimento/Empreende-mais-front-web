"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/useAuthStore";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const Header = () => {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <Card className="h-fit bg-[#6C4732] border-none rounded-none py-2">
      <CardContent className="flex flex-row items-center justify-between px-2">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={40} height={10} />
        </Link>

        {session ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-white/20 bg-white/10 px-4 text-white hover:bg-white/20 hover:text-white"
            onClick={handleLogout}
          >
            Sair
          </Button>
        ) : (
          <Button
            asChild
            variant="outline"
            className="rounded-full border-white/20 bg-white/10 px-4 text-white hover:bg-white/20 hover:text-white"
          >
            <Link href="/login">Entrar</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Header;
