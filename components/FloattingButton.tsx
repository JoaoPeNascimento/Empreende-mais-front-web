import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

interface FloattingButtonProps {
  text: string;
  onPress: () => void;
}

const FloattingButton = ({ text, onPress }: FloattingButtonProps) => {
  return (
    <div className="justify-center flex">
      <Button
        className="w-11/12 h-12 bg-[#6C4732] text-white fixed bottom-2 z-10 shadow-lg shadow-black/20"
        onClick={onPress}
      >
        {text} <ShoppingCart />
      </Button>
    </div>
  );
};

export default FloattingButton;
