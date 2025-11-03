import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="bg-[#F8F5F0]">
      <Header />
      <div className="space-y-2 px-4 mt-2">
        <Input
          placeholder="Pesquisa"
          className="border-[#6C4732] text-[#AF8F7D]"
        />
        <div className="flex gap-2">
          <Button
            className="bg-[#F8F5F0] border-[#6C4732] text-[#AF8F7D]"
            variant={"outline"}
          >
            Masculino
          </Button>
          <Button
            className="bg-[#F8F5F0] border-[#6C4732] text-[#AF8F7D]"
            variant={"outline"}
          >
            Feminino
          </Button>
          <Button
            className="bg-[#F8F5F0] border-[#6C4732] text-[#AF8F7D]"
            variant={"outline"}
          >
            Infantil
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-2 m-4">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  );
}
