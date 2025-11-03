"use client";

import { fetchInventory } from "@/api/inventoryService";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Inventory } from "@/types/types";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState<Inventory[]>([]);

  useEffect(() => {
    async function loadInventory() {
      try {
        const data = await fetchInventory();
        setItems(data);
      } catch (err) {
        console.error("Erro ao carregar inventário:", err);
      }
    }
    loadInventory();
  }, []);

  return (
    <div className="bg-[#F8F5F0] relative min-h-screen">
      <Header />

      {/* Input de pesquisa e quicksearch */}
      <div className="space-y-2 px-4 mt-2">
        <Input
          placeholder="Pesquisa"
          className="border-[#6C4732] text-[#AF8F7D]"
        />
        <div className="flex gap-2">
          {["Masculino", "Feminino", "Infantil"].map((label) => (
            <Button
              key={label}
              className="bg-[#F8F5F0] border-[#6C4732] text-[#AF8F7D]"
              variant={"outline"}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Itens em catalogo */}
      <div className="grid grid-cols-2 gap-4 px-2 m-4">
        {items.map((item) => (
          <ProductCard
            key={item.product.id}
            id={item.product.id}
            name={item.product.nome}
            price={item.product.precoVenda}
            imageUrl={item.product.imagesUrl[0] || "/placeholder.png"}
            onAddToCart={() => {
              console.log(`Adicionar ao carrinho: ${item.product.nome}`);
            }}
          />
        ))}
      </div>

      {/* Botão flutuante (só aparece quando tiver itens no carrinho) */}
      <div className="justify-center flex">
        <Button className="w-11/12 h-12 bg-[#6C4732] text-white fixed bottom-2 z-10 shadow-lg shadow-black/20">
          Ir para o Carrinho <ShoppingCart />
        </Button>
      </div>
    </div>
  );
}
