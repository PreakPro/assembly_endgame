import React, { ReactNode } from "react"
import { Coins } from "lucide-react"
import { cn } from "@/lib/utils"

interface MainProps {
    children: ReactNode,
    className?: string
    spanClassName?: string
}

export default function CoinDisplay({ children, className, spanClassName }: MainProps) {
    return (
            <div className={cn(
                "absolute top-7 right-7 md:right-9 flex items-center gap-1 font-semibold text-lg scale-150 md:scale-160 px-3",
                className
            )}>
                <Coins className="text-yellow-300"/>
                <span className={cn("text-white", spanClassName)}>{children}</span>            </div>
    )
}