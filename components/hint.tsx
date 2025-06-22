import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";
import { ReactNode } from "react";

interface HintProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    disabled: boolean;
}

export default function Hint({ children, className, onClick, disabled }: HintProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "flex flex-row items-center gap-1 text-lg mt-7 md:mt-0 rounded py-3 px-4 transition-all select-none",
                "text-white light:text-black bg-blue-600 light:bg-blue-500",
                "hover:scale-120 active:bg-blue-700",
                disabled && "opacity-50 cursor-not-allowed pointer-events-none hover:scale-100 active:bg-blue-600",
                className
            )}
        >
            <Lightbulb />
            <span>{children}</span>
        </button>
    );
}
