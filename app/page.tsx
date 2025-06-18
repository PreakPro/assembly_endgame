"use client"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useState, useEffect, useLayoutEffect } from "react"
import InfoThing from "@/components/info"
import { cn } from "@/lib/utils"

export default function Page() {
    const [theme, setTheme] = useState<string | null>(null);
    const [isInfoOpen, setisInfoOpen] = useState<boolean>(false)    

    const darkModeBg = "./dark_mode_bg.png"
	const lightModeBg = "./light_mode_bg.png"
    
    useLayoutEffect(() => {
        let currentTheme = localStorage.getItem('theme');
        if (!currentTheme) {
            currentTheme = "dark";
            localStorage.setItem('theme', currentTheme);
        }
        setTheme(currentTheme);
    }, []);

    function toggleTheme() {
        setTheme(prev => {
            const newTheme = prev === "dark" ? "light" : "dark";
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    }

    function isInfoOpenToggle() {
        setisInfoOpen(prev => !prev)
    }

    if (theme === null) return null;

    return (
        <section className={cn("h-screen flex flex-col justify-center items-center",
            { "light": theme !== "dark" }
        )}>
            <header 
                className={cn("justify-center items-center w-screen flex flex-col light:bg-amber-100 h-screen transition-all text-center p-10",
                    {"blur-md": isInfoOpen}
                )}
                style={{
                    backgroundImage: `url(${theme === "dark" ? darkModeBg : lightModeBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <h1 className="absolute transition-all top-1/13 md:text-5xl text-4xl text-neutral-200 text-shadow-orange-400 light:text-shadow-blue-500 text-shadow-md hover:-translate-0.5 hover:text-shadow-lg">Assembly: Endgame</h1>

            </header>
            <div className="rounded transition-all text-white light:text-black flex absolute justify-center items-center text-center w-120 h-30 mb-20 text-4xl bg-green-600 light:bg-green-500 active:opacity-80 hover:scale-110 shadow-black shadow-md">
                <Link href="/game" passHref>
                    <button className="">
                        Go to game
                    </button>
                </Link>
            </div>
            <div className="absolute justify-center bg-white/20 rounded h-23 w-43 items-center flex flex-row transition-all text-center bottom-1/5 gap-3">
                {!isInfoOpen ? theme === "dark" ?
                    <div className="transition-all items-center hover:bg-white/30 rounded top-1/4 p-5" onClick={toggleTheme}>
                        <Moon
                            stroke="white"
                            className="scale-150"
                        />
                    </div>
                    :
                    <div className="transition-all items-center hover:bg-white/30 rounded top-1/4 p-5" onClick={toggleTheme}>
                        <Sun
                            className="scale-150"
                        />
                    </div>
                : null}
                <div className={cn("transition-all items-center rounded top-1/4 p-5",
                    {"hover:bg-white/30": !isInfoOpen}
                )}>
                    <InfoThing isInfoOpenToggle={isInfoOpenToggle} theme={theme} isInfoOpen={isInfoOpen} className="scale-150 "/>
                </div> 
            </div>
        </section>
    );
}