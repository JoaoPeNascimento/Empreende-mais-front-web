import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

interface FloattingButtonProps {
  text: string;
  onPress: () => void;
}

const FloattingButton = ({ text, onPress }: FloattingButtonProps) => {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-4 sm:bottom-5">
      <Button
        className="pointer-events-auto h-12 w-full max-w-md rounded-full bg-[var(--primary)] text-white shadow-[0_18px_44px_rgba(51,38,31,0.24)] transition hover:-translate-y-0.5 hover:bg-[var(--primary-dark)]"
        onClick={onPress}
      >
        {text} <ShoppingCart className="size-4" />
      </Button>
    </div>
  );
};

export default FloattingButton;
