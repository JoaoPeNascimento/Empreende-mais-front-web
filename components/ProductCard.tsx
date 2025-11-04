import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCartIcon, StarIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

interface ProductProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

const ProductCard = ({ id, name, price, imageUrl }: ProductProps) => {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <Card className="py-1 w-fit">
      <CardContent>
        {/* Imagem e "Nota" */}
        <Link href={`/product/${id}`}>
          <div className="relative w-full">
            <Image
              src={imageUrl}
              alt="Roupa"
              width={200}
              height={200}
              className="rounded-xl"
            />
            <Badge
              className="absolute right-2 top-2 space-x-1 bg-[#F8F5F0]"
              variant="secondary"
            >
              <StarIcon size={12} className="fill-yellow-500 text-yellow-500" />
              <p className="text-xs font-semibold text-[#4A2E1E]">5,0</p>
            </Badge>
          </div>
        </Link>

        {/* Nome do produto, valor e botão para adicionar ao carrinho */}
        <Link href={`/product/${id}`}>
          <div className="mt-1 px-2">
            <h1 className="font-medium text-[#4A2E1E]">{name}</h1>
          </div>
        </Link>
        <div className="flex justify-between items-center px-2">
          <h2 className="text-[#5C4033] font-bold">R$ {price}</h2>
          <Button
            variant={"outline"}
            className="border-2"
            onClick={() =>
              addToCart({
                id,
                name,
                price,
                imageUrl,
              })
            }
          >
            <ShoppingCartIcon />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// const ProductCard = () => {
//   return (
//     <Card className="py-1 w-fit">
//       <CardContent>
//         {/* Imagem e "Nota" */}
//         <Link href={`/product/${"1"}`}>
//           <div className="relative w-full">
//             <Image
//               src="https://res.cloudinary.com/dwmsyf9pq/image/upload/v1761699431/products/zet6j3mvksl30omwrhj2.png"
//               alt="Roupa"
//               width={200}
//               height={200}
//               className="rounded-xl"
//             />
//             <Badge
//               className="absolute right-2 top-2 space-x-1 bg-[#F8F5F0]"
//               variant="secondary"
//             >
//               <StarIcon size={12} className="fill-yellow-500 text-yellow-500" />
//               <p className="text-xs font-semibold text-[#4A2E1E]">5,0</p>
//             </Badge>
//           </div>
//         </Link>
//         {/* Nome do produto, valor e botão para adicionar ao carrinho */}
//         <Link href={`/product/${"1"}`}>
//           <div className="mt-1 px-2">
//             <h1 className="font-medium text-[#4A2E1E]">Camisa polo Hering</h1>
//           </div>
//         </Link>
//         <div className="flex justify-between items-center px-2">
//           <h2 className="text-[#5C4033] font-bold">R$ 49,99</h2>
//           <Button variant={"outline"} className="border-2">
//             <ShoppingCartIcon />
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

export default ProductCard;
