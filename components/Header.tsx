import Image from "next/image";
import { Card, CardContent } from "./ui/card";

const Header = () => {
  return (
    <Card className="h-fit bg-[#6C4732] border-none rounded-none">
      <CardContent className="px-2 flex flex-row justify-between items-center">
        <Image src="/logo.svg" alt="Logo" width={50} height={10} />
      </CardContent>
    </Card>
  );
};

// #6C4732

export default Header;
