"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { fetchProductById } from "../../../api/productService";
import { Product } from "../../../types/types";
import Image from "next/image";
import Header from "@/components/Header";
import FloattingButton from "@/components/FloattingButton";
import { StarIcon } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await fetchProductById(Number(productId));
        setProduct(data);
      } catch (err) {
        setError("Erro ao carregar o produto." + err);
      }
    }
    loadProduct();
  }, [productId]);

  if (error) return <p className="text-red-500">Erro: {error}</p>;
  if (!product) return <p>Carregando produto...</p>;
  const { id, nome, precoVenda, imagesUrl } = product;

  return (
    <div className="bg-[#F8F5F0] min-h-screen">
      <Header />
      <FloattingButton
        text="Adicionar ao Carrinho"
        onPress={() => {
          addToCart({
            id,
            name: nome,
            price: precoVenda,
            imageUrl: imagesUrl[0] || "/placeholder.png",
          });
          console.log(cart);
        }}
      />
      <div className="px-2 mt-4">
        <Image
          src={product.imagesUrl[0] || "/placeholder.png"}
          alt={product.nome}
          className="w-full h-64 object-cover rounded-lg"
          width={400}
          height={400}
        />
      </div>
      <div className="px-4 mt-2">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#6C4732]">
              {product.nome}
            </h1>
            <p className="text-[#6C4732] text-lg font-light">
              {product.descricao}
            </p>
          </div>
          <div className="flex gap-1 border-l border-[#AF8F7D] p-2 items-center">
            <h1 className="text-[#6C4732] font-semibold text-xl underline">
              5.0
            </h1>
            <StarIcon size={20} className="fill-yellow-500 text-yellow-500" />
          </div>
        </div>
        <p className="text-lg font-bold text-[#6C4732]">
          Por R$ {product.precoVenda.toFixed(2)}
        </p>
        <p className="text-[#6C4732] font-light">Tamanhos:</p>
        <div>
          {["P", "M", "G", "GG"].map((size) => (
            <button
              key={size}
              className="border border-[#6C4732] text-[#6C4732] rounded-md px-3 py-1 mr-2 mt-2"
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
