import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface CheckoutProductProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  color?: string;
  size?: string;
  onRemove?: () => void;
}

const CheckoutProductCard = ({
  id,
  name,
  imageUrl,
  price,
  color,
  size,
  onRemove,
}: CheckoutProductProps) => {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

  return (
    <article className="group grid grid-cols-[88px_1fr_auto] gap-4 rounded-xl border border-[var(--line)] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(51,38,31,0.1)]">
      <Link href={`/product/${id}`} className="relative aspect-square overflow-hidden rounded-lg bg-[var(--highlight)]">
        <Image src={imageUrl} alt={name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="88px" />
      </Link>

      <Link href={`/product/${id}`} className="min-w-0 self-center">
        <h2 className="line-clamp-2 text-base font-semibold text-[var(--ink)]">{name}</h2>
        <p className="mt-1 text-lg font-semibold text-[var(--primary)]">{formattedPrice}</p>
        {color || size ? (
          <p className="mt-2 text-sm text-[var(--muted-ink)]">
            {color ? `Cor: ${color}` : null}
            {color && size ? " · " : null}
            {size ? `Tamanho: ${size}` : null}
          </p>
        ) : null}
      </Link>

      {onRemove ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="self-center rounded-full border-[var(--line-strong)] bg-white text-[var(--muted-ink)] hover:bg-[#fff3f3] hover:text-[#a63b3b]"
          onClick={onRemove}
          aria-label={`Remover ${name}`}
        >
          <Trash2 className="size-4" />
        </Button>
      ) : null}
    </article>
  );
};

export default CheckoutProductCard;
