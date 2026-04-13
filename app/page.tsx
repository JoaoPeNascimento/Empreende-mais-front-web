"use client";

import { fetchInventory } from "@/api/inventoryService";
import FloattingButton from "@/components/FloattingButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/useCartStore";
import { Inventory } from "@/types/types";
import {
  ArrowRight,
  Clock3,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Navigation,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useAuthStore } from "@/store/useAuthStore";

const WHATSAPP_NUMBER = "558199025395";
const ADDRESS = "Av. Presidente Kennedy, 31 - São Benedito, Olinda - PE";
const MAPS_QUERY = "Av. Presidente Kennedy, 31 - São Benedito, Olinda - PE";
const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&z=15&output=embed`;
const MAPS_ROUTE = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAPS_QUERY)}`;

const curatedCategories = [
  {
    key: "vestidos",
    label: "Vestidos",
    match: (value: string) => value.includes("vest"),
  },
  {
    key: "combos",
    label: "Combos",
    match: (value: string) => value.includes("combo"),
  },
  {
    key: "conjuntos",
    label: "Conjuntos",
    match: (value: string) => value.includes("conjunto"),
  },
  {
    key: "acessorios",
    label: "Acessórios",
    match: (value: string) =>
      value.includes("acessor") || value.includes("bolsa") || value.includes("biju"),
  },
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const normalizeText = (value?: string | null) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const createWhatsAppLink = (productName?: string) => {
  const text = productName
    ? `Oi! Vim pelo catálogo da Donna Glamour e quero saber mais sobre ${productName}.`
    : "Oi! Vim pelo catálogo da Donna Glamour e quero escolher um look com vocês.";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Donna Glamour",
  image: "/logo.svg",
  telephone: "+55 81 9902-5395",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Presidente Kennedy, 31",
    addressLocality: "Olinda",
    addressRegion: "PE",
    addressCountry: "BR",
  },
  areaServed: ["Olinda", "Recife", "Paulista"],
};

type CatalogTab = {
  key: string;
  label: string;
  matches: (item: Inventory) => boolean;
};

export default function Home() {
  const [items, setItems] = useState<Inventory[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleAuthAction = () => {
    if (session) {
      clearSession();
      router.replace("/login");
      return;
    }

    router.push("/login");
  };

  useEffect(() => {
    async function loadInventory() {
      try {
        const data = await fetchInventory();
        setItems(data);
      } catch (error) {
        console.error("Erro ao carregar inventário:", error);
      }
    }

    loadInventory();
  }, []);

  const catalogTabs = useMemo<CatalogTab[]>(() => {
    const tabs: CatalogTab[] = [
      {
        key: "todos",
        label: "Todos",
        matches: () => true,
      },
    ];

    const coveredCategories = new Set<string>();

    curatedCategories.forEach((category) => {
      const hasMatch = items.some((item) => {
        const categoryName = normalizeText(item.product.category?.nome);
        const isMatch = category.match(categoryName);

        if (isMatch) {
          coveredCategories.add(categoryName);
        }

        return isMatch;
      });

      if (hasMatch) {
        tabs.push({
          key: category.key,
          label: category.label,
          matches: (item) => category.match(normalizeText(item.product.category?.nome)),
        });
      }
    });

    const extraCategories = Array.from(
      new Set(
        items
          .map((item) => item.product.category?.nome)
          .filter((value): value is string => Boolean(value))
      )
    ).filter((category) => !coveredCategories.has(normalizeText(category)));

    extraCategories.slice(0, 4).forEach((category) => {
      const normalized = normalizeText(category);

      tabs.push({
        key: normalized,
        label: category,
        matches: (item) => normalizeText(item.product.category?.nome) === normalized,
      });
    });

    return tabs;
  }, [items]);

  const comboItems = useMemo(
    () =>
      items.filter((item) => {
        const categoryName = normalizeText(item.product.category?.nome);
        return categoryName.includes("combo");
      }),
    [items]
  );

  const featuredItems = comboItems.length > 0 ? comboItems.slice(0, 4) : items.slice(0, 4);
  const currentTab = catalogTabs.find((tab) => tab.key === activeTab) || catalogTabs[0];

  const filteredItems = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return items.filter((item) => {
      const matchesTab = currentTab.matches(item);
      const matchesSearch =
        !normalizedSearch || normalizeText(item.product.nome).includes(normalizedSearch);

      return matchesTab && matchesSearch;
    });
  }, [currentTab, items, search]);

  const heroImages = items
    .slice(0, 3)
    .map((item) => item.product.imagesUrl[0])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[var(--bg-soft)] text-[var(--ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:rgba(248,245,240,0.88)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="#topo" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE4DB] ring-1 ring-[#AF8F7D]/20">
              <Image src="/logo.svg" alt="Donna Glamour" width={26} height={26} />
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-xl leading-none text-[var(--primary)]">
                Donna Glamour
              </p>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-ink)]">
                Moda feminina
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--muted-ink)] md:flex">
            <Link href="#destaques" className="transition hover:text-[var(--primary)]">
              Destaques
            </Link>
            <Link href="#catalogo" className="transition hover:text-[var(--primary)]">
              Catálogo
            </Link>
            <Link href="#localizacao" className="transition hover:text-[var(--primary)]">
              Localização
            </Link>
            <Link href="#contato" className="transition hover:text-[var(--primary)]">
              Contato
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {session ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-[var(--line-strong)] bg-white/80 px-5 text-[var(--primary)] shadow-sm hover:bg-white"
                onClick={handleAuthAction}
              >
                Sair
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="rounded-full border-[var(--line-strong)] bg-white/80 px-5 text-[var(--primary)] shadow-sm hover:bg-white"
              >
                <Link href="/login">Entrar</Link>
              </Button>
            )}

            <Button asChild className="rounded-full bg-[var(--primary)] px-5 text-white shadow-[0_18px_40px_rgba(108,71,50,0.22)]">
              <a href={createWhatsAppLink()} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" />
                Fale no WhatsApp
              </a>
            </Button>
          </div>
        </div>

        <div className="flex gap-5 overflow-x-auto border-t border-[var(--line)] px-4 py-3 text-sm font-medium text-[var(--muted-ink)] md:hidden">
          <Link href="#destaques">Destaques</Link>
          <Link href="#catalogo">Catálogo</Link>
          <Link href="#localizacao">Localização</Link>
          <Link href="#contato">Contato</Link>
          {session ? (
            <button
              type="button"
              className="bg-transparent p-0 transition hover:text-[var(--primary)]"
              onClick={handleAuthAction}
            >
              Sair
            </button>
          ) : (
            <Link href="/login">Entrar</Link>
          )}
        </div>
      </header>

      <main>
        <section id="topo" className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(239,228,219,0.9),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(175,143,125,0.16),_transparent_24%),linear-gradient(180deg,_rgba(248,245,240,1)_0%,_rgba(244,238,231,0.96)_100%)]" />
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-8">
              <Badge className="rounded-full border border-[var(--line-strong)] bg-white/80 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[var(--primary)] shadow-sm">
                Moda feminina em Olinda, Recife e região
              </Badge>

              <div className="space-y-5">
                <h1 className="max-w-2xl font-[family-name:var(--font-display)] text-5xl leading-none text-[var(--primary)] sm:text-6xl lg:text-7xl">
                  Moda feminina com estilo e leveza.
                </h1>
                <p className="max-w-xl text-base leading-7 text-[var(--muted-ink)] sm:text-lg">
                  Looks modernos, peças especiais e atendimento rápido para você
                  escolher com calma e falar com a loja quando quiser.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-full bg-[var(--primary)] px-6 text-white shadow-[0_20px_45px_rgba(108,71,50,0.24)] hover:bg-[var(--primary-dark)]">
                  <a href={createWhatsAppLink()} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-4" />
                    Fale no WhatsApp
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-[var(--line-strong)] bg-white/80 px-6 text-[var(--primary)] shadow-sm hover:bg-white">
                  <Link href="#catalogo">
                    <Sparkles className="size-4" />
                    Ver peças
                  </Link>
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.6rem] border border-white/70 bg-white/75 p-4 shadow-[0_18px_35px_rgba(108,71,50,0.08)] backdrop-blur">
                  <Clock3 className="mb-3 size-5 text-[var(--accent)]" />
                  <p className="text-sm font-semibold text-[var(--primary)]">Atendimento rápido</p>
                  <p className="mt-1 text-sm text-[var(--muted-ink)]">Fale com a loja e tire suas dúvidas com facilidade.</p>
                </div>
                <div className="rounded-[1.6rem] border border-white/70 bg-white/75 p-4 shadow-[0_18px_35px_rgba(108,71,50,0.08)] backdrop-blur">
                  <Sparkles className="mb-3 size-5 text-[var(--accent)]" />
                  <p className="text-sm font-semibold text-[var(--primary)]">Peças em destaque</p>
                  <p className="mt-1 text-sm text-[var(--muted-ink)]">Uma seleção bonita para você encontrar seu look mais rápido.</p>
                </div>
                <div className="rounded-[1.6rem] border border-white/70 bg-white/75 p-4 shadow-[0_18px_35px_rgba(108,71,50,0.08)] backdrop-blur">
                  <MapPin className="mb-3 size-5 text-[var(--accent)]" />
                  <p className="text-sm font-semibold text-[var(--primary)]">Loja física em Olinda</p>
                  <p className="mt-1 text-sm text-[var(--muted-ink)]">Fácil de encontrar para visitar, retirar ou comprar com praticidade.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-4 top-10 h-32 w-32 rounded-full bg-[#CBB6A8]/40 blur-3xl" />
              <div className="absolute -left-6 bottom-10 h-40 w-40 rounded-full bg-[#AF8F7D]/25 blur-3xl" />

              <div className="relative rounded-[2rem] border border-white/80 bg-white/72 p-4 shadow-[0_24px_70px_rgba(108,71,50,0.14)] backdrop-blur-xl">
                <div className="grid gap-4">
                  <div className="relative min-h-[420px] overflow-hidden rounded-[1.7rem] bg-[#EFE4DB]">
                    {heroImages[0] ? (
                      <Image
                        src={heroImages[0]}
                        alt="Destaque Donna Glamour"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 40vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-10 text-center">
                        <div>
                          <p className="font-[family-name:var(--font-display)] text-4xl text-[var(--primary)]">
                            Donna Glamour
                          </p>
                          <p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">
                            Uma vitrine leve e bonita para você conhecer a coleção.
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(74,46,30,0.74)] via-transparent to-transparent p-6 text-white">
                      <p className="text-xs uppercase tracking-[0.28em] text-white/75">Coleção atual</p>
                      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl leading-none">
                        Looks que valorizam seu estilo no dia a dia.
                      </p>
                    </div>
                  </div>

               
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="destaques" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl space-y-3">
                <Badge className="rounded-full bg-[var(--highlight)] px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-[var(--primary)]">
                  Destaques da loja
                </Badge>
                <h2 className="font-[family-name:var(--font-display)] text-4xl leading-none text-[var(--primary)] sm:text-5xl">
                  Peças para começar sua escolha.
                </h2>
                <p className="text-base leading-7 text-[var(--muted-ink)]">
                  Alguns looks e combinações para você ver primeiro.
                </p>
              </div>

              <Button asChild variant="outline" className="h-11 rounded-full border-[var(--line-strong)] bg-white px-5 text-[var(--primary)] shadow-sm hover:bg-[var(--bg-soft)]">
                <Link href="#catalogo">
                  Ver catálogo
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featuredItems.map((item) => {
                const imageUrl = item.product.imagesUrl[0] || "/logo.svg";
                const categoryName = item.product.category?.nome || "Destaque";

                return (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-[var(--card)] shadow-[0_18px_40px_rgba(108,71,50,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(108,71,50,0.14)]"
                  >
                    <Link href={`/product/${item.product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-[var(--highlight)]">
                      <Image
                        src={imageUrl}
                        alt={item.product.nome}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)] shadow-sm">
                        {comboItems.length > 0 && normalizeText(categoryName).includes("combo")
                          ? "Combo"
                          : categoryName}
                      </div>
                    </Link>

                    <div className="space-y-4 p-5">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-ink)]">
                          {categoryName}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-[var(--primary)]">
                          {item.product.nome}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xl font-semibold text-[var(--primary)]">
                          {formatPrice(item.product.precoVenda)}
                        </p>
                        <Badge className="rounded-full bg-[var(--bg-soft)] px-3 py-1 text-[var(--accent)]">
                          em destaque
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild className="h-10 flex-1 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]">
                          <a href={createWhatsAppLink(item.product.nome)} target="_blank" rel="noreferrer">
                            <MessageCircle className="size-4" />
                            Quero saber mais
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="size-10 rounded-full border-[var(--line-strong)] bg-white text-[var(--primary)] hover:bg-[var(--bg-soft)]">
                          <Link href={`/product/${item.product.id}`} aria-label={`Ver ${item.product.nome}`}>
                            <ArrowRight className="size-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="catalogo" className="border-y border-[var(--line)] bg-white/65 px-4 py-16 backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <Badge className="rounded-full bg-white px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-[var(--primary)] shadow-sm">
                  Nosso catálogo
                </Badge>
                <h2 className="font-[family-name:var(--font-display)] text-4xl leading-none text-[var(--primary)] sm:text-5xl">
                  Encontre seu próximo look.
                </h2>
                <p className="text-base leading-7 text-[var(--muted-ink)]">
                  Escolha a categoria, veja as peças e fale com a loja quando quiser.
                </p>
              </div>

              <div className="w-full max-w-md rounded-[1.4rem] border border-[var(--line)] bg-white p-2 shadow-sm">
                <div className="flex items-center gap-3 rounded-[1rem] bg-[var(--bg-soft)] px-3 py-2">
                  <Search className="size-4 text-[var(--muted-ink)]" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Busque por nome da peça"
                    className="h-auto border-0 bg-transparent px-0 py-0 text-[var(--primary)] shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3 overflow-x-auto pb-1">
              {catalogTabs.map((tab) => {
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
                      isActive
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_12px_28px_rgba(108,71,50,0.22)]"
                        : "border-[var(--line-strong)] bg-white text-[var(--primary)] hover:bg-[var(--bg-soft)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 text-sm text-[var(--muted-ink)]">
              <p>{filteredItems.length} itens encontrados no catálogo</p>
              <Link href="#contato" className="font-medium text-[var(--primary)] underline-offset-4 hover:underline">
                Prefere atendimento rápido? Chame no WhatsApp
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {filteredItems.map((item) => {
                const imageUrl = item.product.imagesUrl[0] || "/logo.svg";

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[1.6rem] border border-[var(--line)] bg-[var(--card)] shadow-[0_14px_34px_rgba(108,71,50,0.08)]"
                  >
                    <Link href={`/product/${item.product.id}`} className="relative block aspect-square overflow-hidden bg-[var(--highlight)]">
                      <Image
                        src={imageUrl}
                        alt={item.product.nome}
                        fill
                        className="object-cover transition duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </Link>

                    <div className="space-y-4 p-5">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-ink)]">
                          {item.product.category?.nome || "Catálogo"}
                        </p>
                        <h3 className="text-lg font-semibold text-[var(--primary)]">
                          {item.product.nome}
                        </h3>
                        <p className="text-xl font-semibold text-[var(--primary)]">
                          {formatPrice(item.product.precoVenda)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild className="h-10 flex-1 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]">
                          <a href={createWhatsAppLink(item.product.nome)} target="_blank" rel="noreferrer">
                            <MessageCircle className="size-4" />
                            Comprar
                          </a>
                        </Button>
                        <Button asChild variant="outline" className="h-10 rounded-full border-[var(--line-strong)] bg-white px-4 text-[var(--primary)] hover:bg-[var(--bg-soft)]">
                          <Link href={`/product/${item.product.id}`}>Detalhes</Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="mt-8 rounded-[1.8rem] border border-dashed border-[var(--line-strong)] bg-[var(--card)] px-6 py-12 text-center shadow-sm">
                <p className="font-[family-name:var(--font-display)] text-3xl text-[var(--primary)]">
                  Nenhuma peça encontrada.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">
                  Ajuste o filtro ou fale com a loja para receber sugestões de looks.
                </p>
                <Button asChild className="mt-6 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]">
                  <a href={createWhatsAppLink()} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-4" />
                    Pedir ajuda no WhatsApp
                  </a>
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
            <div className="rounded-[1.8rem] border border-[var(--line)] bg-[var(--card)] p-6 shadow-[0_18px_40px_rgba(108,71,50,0.08)]">
              <Store className="size-6 text-[var(--accent)]" />
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-none text-[var(--primary)]">
                Atendimento leve e direto
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted-ink)]">
                Veja as peças com calma e fale com a loja quando estiver pronta.
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-[var(--line)] bg-[linear-gradient(180deg,_rgba(248,245,240,0.96),_rgba(255,255,255,0.98))] p-6 shadow-[0_18px_40px_rgba(108,71,50,0.08)]">
              <ShieldCheck className="size-6 text-[var(--accent)]" />
              <h3 className="mt-4 text-xl font-semibold text-[var(--primary)]">
                Peças escolhidas com carinho
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">
                Uma seleção pensada para quem gosta de moda feminina atual e versátil.
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-[var(--line)] bg-[var(--card)] p-6 shadow-[0_18px_40px_rgba(108,71,50,0.08)]">
              <HeartHandshake className="size-6 text-[var(--accent)]" />
              <h3 className="mt-4 text-xl font-semibold text-[var(--primary)]">
                Compra mais prática
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">
                Do catálogo ao atendimento, tudo foi pensado para facilitar sua escolha.
              </p>
            </div>
          </div>
        </section>

        <section id="localizacao" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-5">
              <Badge className="rounded-full bg-[var(--highlight)] px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-[var(--primary)]">
                Localização e atendimento
              </Badge>
              <h2 className="font-[family-name:var(--font-display)] text-4xl leading-none text-[var(--primary)] sm:text-5xl">
                Loja física em Olinda.
              </h2>
              <p className="text-base leading-7 text-[var(--muted-ink)]">
                Fácil de encontrar para visitar, retirar ou falar com a equipe.
              </p>

              <div className="rounded-[1.8rem] border border-[var(--line)] bg-[var(--card)] p-6 shadow-[0_18px_40px_rgba(108,71,50,0.08)]">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-[var(--highlight)] p-3 text-[var(--primary)]">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-ink)]">Endereço</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--primary)]">{ADDRESS}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted-ink)]">
                      Atendimento pensado para quem quer ver o look, tirar dúvidas
                      e comprar com mais facilidade.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="h-11 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]">
                    <a href={MAPS_ROUTE} target="_blank" rel="noreferrer">
                      <Navigation className="size-4" />
                      Traçar rota no Google Maps
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-11 rounded-full border-[var(--line-strong)] bg-white text-[var(--primary)] hover:bg-[var(--bg-soft)]">
                    <a href={createWhatsAppLink()} target="_blank" rel="noreferrer">
                      <MessageCircle className="size-4" />
                      Pedir atendimento
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--card)] p-3 shadow-[0_22px_60px_rgba(108,71,50,0.12)]">
              <iframe
                src={MAPS_EMBED}
                title="Mapa Donna Glamour"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[440px] w-full rounded-[1.5rem] border-0"
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 rounded-[2.2rem] border border-[var(--line)] bg-[linear-gradient(135deg,_rgba(108,71,50,0.96),_rgba(74,46,30,0.98))] px-6 py-10 text-white shadow-[0_24px_70px_rgba(74,46,30,0.3)] lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
            <div className="space-y-4">
              <Badge className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-white">
                Sobre a marca
              </Badge>
              <h2 className="font-[family-name:var(--font-display)] text-4xl leading-none sm:text-5xl">
                Moda feminina moderna, acessível e com personalidade.
              </h2>
            </div>

            <div className="space-y-5 text-sm leading-7 text-white/80 sm:text-base">
              <p>
                A Donna Glamour nasceu para oferecer looks atuais com atendimento
                leve, rápido e próximo. A loja física fica em Olinda, mas o contato
                digital ajuda a atender toda a região sem complicar sua jornada.
              </p>
              <p>
                Aqui você encontra as peças com mais clareza e pode falar com a loja
                de forma rápida sempre que quiser.
              </p>
            </div>
          </div>
        </section>

        <section id="contato" className="px-4 pb-20 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[2.2rem] border border-[var(--line)] bg-[var(--card)] px-6 py-10 shadow-[0_20px_55px_rgba(108,71,50,0.1)] lg:px-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <Badge className="rounded-full bg-[var(--highlight)] px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-[var(--primary)]">
                  Fale com a loja
                </Badge>
                <h2 className="font-[family-name:var(--font-display)] text-4xl leading-none text-[var(--primary)] sm:text-5xl">
                  Gostou de alguma peça?
                </h2>
                <p className="text-base leading-7 text-[var(--muted-ink)]">
                  É só chamar no WhatsApp e continuar seu atendimento.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-full bg-[var(--primary)] px-6 text-white hover:bg-[var(--primary-dark)]">
                  <a href={createWhatsAppLink()} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-4" />
                    Conversar agora
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-[var(--line-strong)] bg-white px-6 text-[var(--primary)] hover:bg-[var(--bg-soft)]">
                  <Link href="#catalogo">Voltar ao catálogo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--line)] bg-white/70 px-4 py-8 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-[var(--muted-ink)] lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-semibold text-[var(--primary)]">
              Donna Glamour - Loja de Roupas Femininas em Olinda, Recife e Região
            </p>
            <p>{ADDRESS}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href={createWhatsAppLink()} target="_blank" rel="noreferrer" className="hover:text-[var(--primary)]">
              WhatsApp
            </a>
            <a href={MAPS_ROUTE} target="_blank" rel="noreferrer" className="hover:text-[var(--primary)]">
              Localização
            </a>
            <Link href="#topo" className="hover:text-[var(--primary)]">
              Voltar ao topo
            </Link>
          </div>
        </div>
      </footer>

      <a
        href={createWhatsAppLink()}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#6C4732] px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(108,71,50,0.28)] transition hover:scale-[1.02] hover:bg-[#573724]"
      >
        <MessageCircle className="size-4" />
        WhatsApp
      </a>

      {cart.length > 0 && (
        <FloattingButton
          text={`Ir para o carrinho (${cart.length})`}
          onPress={() => router.push("/checkout")}
        />
      )}
    </div>
  );
}
