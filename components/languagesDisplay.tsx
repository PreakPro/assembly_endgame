import { languages } from "../lib/languages"
import { cn } from "../lib/utils"

interface MainProps {
    wrongGuesses: number
}

export default function LanguagesDisplay(props: MainProps) { return languages.map((values, key) => (
        <div key={key} className="relative inline-block justify-center items-center text-center">
            <button
                style={{
                    backgroundColor: values.backgroundColor,
                    color: values.color,
                }}
                className={cn(
                    "rounded px-3 py-1 m-1 focus:border-0",
                    { "opacity-30": props.wrongGuesses > key }
                )}
            >
                {values.name}
            </button>
            <span className="absolute inset-0 z-10 h-full w-full translate-y-2">{props.wrongGuesses > key ? "💀" : null}</span>
        </div>
    ))
}