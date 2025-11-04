import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";

const Header = () => {
  return (
    <Card className="h-fit bg-[#6C4732] border-none rounded-none py-2">
      <CardContent className="px-2 flex flex-row justify-between items-center">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={40} height={10} />
        </Link>
      </CardContent>
    </Card>
  );
};

export default Header;
