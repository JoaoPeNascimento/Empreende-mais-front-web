import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";

interface CheckoutProductProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

const CheckoutProductCard = ({
  id,
  name,
  imageUrl,
  price,
}: CheckoutProductProps) => {
  return (
    <Card className="py-1 px-2">
      <CardContent className="h-fit">
        <Link href={`/product/${id}`}>
          <div className="flex">
            <Image
              src={imageUrl}
              alt={name}
              width={80}
              height={80}
              className="rounded-lg"
            />
            <div>
              <h1 className="font-medium text-xl text-[#4A2E1E]">{name}</h1>
              <h2 className="text-[#5C4033] font-semibold">R$ {price}</h2>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CheckoutProductCard;
