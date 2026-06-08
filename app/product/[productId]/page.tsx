"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  StarIcon,
} from "lucide-react";

import { fetchProductById } from "@/api/productService";
import FloattingButton from "@/components/FloattingButton";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/types/types";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const getPriceLabel = (product: Product) =>
  product.precoLabel || formatPrice(product.precoVenda);

const formatProductDetails = (color?: string, size?: string) => {
  const details = [color ? `cor ${color}` : null, size ? `tamanho ${size}` : null].filter(Boolean).join(", ");

  return details ? ` com ${details}` : "";
};

const createWhatsAppLink = (productName: string, color?: string, size?: string) =>
  `https://wa.me/558199025395?text=${encodeURIComponent(
    `Oi! Vim pelo catálogo da Donna Glamour e quero saber mais sobre ${productName}${formatProductDetails(color, size)}.`
  )}`;

export default function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await fetchProductById(Number(productId));
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar o produto.");
      }
    }

    loadProduct();
  }, [productId]);

  const sizes = useMemo(() => product?.tamanhos || [], [product]);
  const colors = useMemo(() => product?.cores || [], [product]);
  const activeSize = sizes.includes(selectedSize) ? selectedSize : sizes[0] || "";
  const activeColor = colors.includes(selectedColor) ? selectedColor : colors[0] || "";

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-soft)]">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <p className="rounded-xl border border-[#f0b7b7] bg-[#fff3f3] px-5 py-4 text-sm text-[#a63b3b]">
            Erro ao carregar o produto: {error}
          </p>
          <Button asChild className="mt-6 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]">
            <Link href="/#catalogo">Voltar ao catálogo</Link>
          </Button>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--bg-soft)]">
        <Header />
        <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="aspect-[4/5] animate-pulse rounded-xl bg-white" />
          <div className="space-y-4">
            <div className="h-10 w-36 animate-pulse rounded-full bg-white" />
            <div className="h-16 w-full animate-pulse rounded-xl bg-white" />
            <div className="h-40 w-full animate-pulse rounded-xl bg-white" />
          </div>
        </main>
      </div>
    );
  }

  const { id, nome, precoVenda, imagesUrl } = product;
  const gallery = imagesUrl.length > 0 ? imagesUrl : ["/logo.svg"];
  const primaryImage = gallery[selectedImage] || gallery[0];

  const addCurrentProductToCart = () => {
    addToCart({
      id,
      name: nome,
      price: precoVenda,
      imageUrl: primaryImage,
      size: sizes.length > 0 ? activeSize : undefined,
      color: colors.length > 0 ? activeColor : undefined,
    });
  };

  const handleFloatingButton = () => {
    if (cart.length > 0) {
      router.push("/checkout");
      return;
    }

    addCurrentProductToCart();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-soft)] text-[var(--ink)]">
      <Header />
      <FloattingButton
        text={cart.length > 0 ? `Ir para o carrinho (${cart.length})` : "Adicionar ao carrinho"}
        onPress={handleFloatingButton}
      />

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/#catalogo"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted-ink)] transition hover:text-[var(--primary)]"
        >
          <ArrowLeft className="size-4" />
          Voltar ao catálogo
        </Link>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white p-3 shadow-[0_18px_42px_rgba(51,38,31,0.1)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[var(--highlight)]">
                <Image
                  src={primaryImage}
                  alt={product.nome}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  priority
                />
              </div>
            </div>

            {gallery.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {gallery.slice(0, 4).map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    className={`relative aspect-square overflow-hidden rounded-lg border bg-white transition ${
                      selectedImage === index
                        ? "border-[var(--accent)] ring-2 ring-[color:rgba(47,125,115,0.2)]"
                        : "border-[var(--line)] hover:border-[var(--line-strong)]"
                    }`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`Ver imagem ${index + 1}`}
                  >
                    <Image src={image} alt="" fill className="object-cover" sizes="120px" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-[0_18px_42px_rgba(51,38,31,0.1)] lg:sticky lg:top-24">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-full bg-[var(--highlight)] px-4 py-1.5 text-[var(--accent)]">
                  {product.category?.nome || "Donna Glamour"}
                </Badge>
                <div className="flex items-center gap-1 text-sm font-medium text-[var(--primary)]">
                  <StarIcon size={16} className="fill-[#f0b84f] text-[#f0b84f]" />
                  5,0
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="font-[family-name:var(--font-display)] text-4xl leading-none text-[var(--primary)] sm:text-5xl">
                  {product.nome}
                </h1>
                <p className="text-3xl font-semibold leading-tight text-[var(--ink)]">
                  {getPriceLabel(product)}
                </p>
                <p className="leading-7 text-[var(--muted-ink)]">
                  {product.descricao ||
                    "Peça selecionada para quem busca estilo, praticidade e um look bonito para o dia a dia."}
                </p>
              </div>

              {colors.length > 0 ? (
                <div className="rounded-xl bg-[var(--bg-soft)] p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted-ink)]">
                    Cores
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        type="button"
                        key={color}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          activeColor === color
                            ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                            : "border-[var(--line-strong)] bg-white text-[var(--primary)] hover:border-[var(--primary)]"
                        }`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {sizes.length > 0 ? (
                <div className="rounded-xl bg-[var(--bg-soft)] p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted-ink)]">
                    Tamanhos
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        type="button"
                        key={size}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          activeSize === size
                            ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                            : "border-[var(--line-strong)] bg-white text-[var(--primary)] hover:border-[var(--primary)]"
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  className="h-12 rounded-full bg-[var(--primary)] text-white shadow-[0_16px_36px_rgba(51,38,31,0.18)] hover:bg-[var(--primary-dark)]"
                  onClick={addCurrentProductToCart}
                >
                  <ShoppingBag className="size-4" />
                  Adicionar
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-[var(--line-strong)] bg-white text-[var(--primary)] hover:bg-[var(--highlight)]"
                >
                  <a href={createWhatsAppLink(nome, activeColor, activeSize)} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-4" />
                    WhatsApp
                  </a>
                </Button>
              </div>

              <div className="grid gap-3 text-sm leading-7 text-[var(--muted-ink)]">
                <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                  <div className="flex items-center gap-2 font-medium text-[var(--accent)]">
                    <CheckCircle2 className="size-4" />
                    Atendimento rápido para tirar dúvidas
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                  <div className="flex items-center gap-2 font-medium text-[var(--primary)]">
                    <ShieldCheck className="size-4" />
                    Pedido confirmado diretamente com a loja
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                  <div className="flex items-center gap-2 font-medium text-[var(--primary)]">
                    <MapPin className="size-4" />
                    Av. Presidente Kennedy, 31 - São Benedito, Olinda - PE
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
