"use client";

import Link from "next/link";
import { ArrowLeft, MessageCircle, ShoppingBag, Sparkles, Trash2 } from "lucide-react";

import CheckoutProductCard from "@/components/CheckoutProductCard";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const buildCheckoutMessage = (
  items: { name: string; price: number; color?: string; size?: string }[]
) => {
  const itemLines = items
    .map((item) => {
      const details = [item.color ? `cor: ${item.color}` : null, item.size ? `tamanho: ${item.size}` : null]
        .filter(Boolean)
        .join(", ");

      return `- ${item.name} (${formatPrice(item.price)})${details ? ` - ${details}` : ""}`;
    })
    .join("\n");
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return `Oi! Quero finalizar meu pedido na Donna Glamour:\n${itemLines}\n\nTotal: ${formatPrice(total)}`;
};

const Checkout = () => {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const checkoutLink = `https://wa.me/558199025395?text=${encodeURIComponent(
    buildCheckoutMessage(cart)
  )}`;

  return (
    <div className="min-h-screen bg-[var(--bg-soft)] text-[var(--ink)]">
      <Header />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/#catalogo"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted-ink)] transition hover:text-[var(--primary)]"
        >
          <ArrowLeft className="size-4" />
          Voltar ao catálogo
        </Link>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-3">
              <Badge className="rounded-full bg-[var(--highlight)] px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
                Sua seleção
              </Badge>
              <h1 className="font-[family-name:var(--font-display)] text-4xl leading-none text-[var(--primary)] sm:text-5xl">
                Carrinho de compras
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted-ink)]">
                Revise as peças escolhidas e envie o pedido para a loja continuar o atendimento.
              </p>
            </div>

            {cart.length > 0 ? (
              <div className="space-y-3">
                {cart.map((item) => (
                  <CheckoutProductCard
                    key={item.cartItemId}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    imageUrl={item.imageUrl}
                    color={item.color}
                    size={item.size}
                    onRemove={() => removeFromCart(item.cartItemId)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--line-strong)] bg-white px-6 py-12 text-center shadow-sm">
                <ShoppingBag className="mx-auto size-10 text-[var(--accent)]" />
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--primary)]">
                  Seu carrinho está vazio.
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--muted-ink)]">
                  Escolha uma peça no catálogo e ela aparece aqui para você finalizar pelo WhatsApp.
                </p>
                <Button asChild className="mt-6 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]">
                  <Link href="/#catalogo">
                    <Sparkles className="size-4" />
                    Ver catálogo
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <aside className="rounded-xl border border-[var(--line)] bg-white p-5 shadow-[0_18px_42px_rgba(51,38,31,0.1)] lg:sticky lg:top-24">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted-ink)]">Resumo</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--primary)]">
                  {cart.length} {cart.length === 1 ? "item" : "itens"}
                </h2>
              </div>
              {cart.length > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full border-[var(--line-strong)] bg-white text-[var(--muted-ink)] hover:bg-[#fff3f3] hover:text-[#a63b3b]"
                  onClick={clearCart}
                  aria-label="Limpar carrinho"
                >
                  <Trash2 className="size-4" />
                </Button>
              ) : null}
            </div>

            <div className="mt-6 rounded-xl bg-[var(--bg-soft)] p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[var(--muted-ink)]">Total estimado</span>
                <strong className="text-2xl text-[var(--primary)]">{formatPrice(total)}</strong>
              </div>
              <p className="mt-3 text-xs leading-6 text-[var(--muted-ink)]">
                A disponibilidade e formas de pagamento são confirmadas no atendimento.
              </p>
            </div>

            <Button
              asChild
              disabled={cart.length === 0}
              className="mt-5 h-12 w-full rounded-full bg-[var(--primary)] text-white shadow-[0_18px_40px_rgba(51,38,31,0.18)] hover:bg-[var(--primary-dark)] disabled:pointer-events-none disabled:opacity-50"
            >
              <a href={checkoutLink} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" />
                Finalizar no WhatsApp
              </a>
            </Button>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default Checkout;
