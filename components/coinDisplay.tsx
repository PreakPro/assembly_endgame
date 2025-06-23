import React, { ReactNode } from "react"
import { Coins } from "lucide-react"
import { cn } from "@/lib/utils"

interface MainProps {
    children: ReactNode,
    className?: string,
    spanClassName?: string,
    direction?: "up" | "down" | null
}

export default function CoinDisplay({ children, className, spanClassName, direction }: MainProps) {
    return (
        <div className={cn(
            "absolute top-7 transition-all right-7 md:right-9 flex items-center gap-1 font-semibold text-lg px-3",
            direction && "scale-170 md:scale-180",
            !direction && "scale-150 md:scale-160",
            className
        )}>
            <Coins className="text-yellow-300"/>
            <span className={cn(
                "transition-all",
                direction === "up" && "text-green-400",
                direction === "down" && "text-red-400",
                !direction && "text-white", 
                spanClassName
            )}>
                {children}
            </span>
        </div>
    )
}
