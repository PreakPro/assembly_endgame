"use client"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useState, useLayoutEffect } from "react"
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

    function setDifficulty(difficulty: string) {
        localStorage.setItem('difficulty', difficulty)
    }

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
                <h1 className="absolute transition-all top-1/13 text-5xl md:mt-0 mt-10 text-neutral-200 text-shadow-orange-400 light:text-shadow-blue-500 text-shadow-md hover:-translate-0.5 hover:text-shadow-lg">Assembly: Endgame</h1>

            </header>

            <div onClick={() => setDifficulty("easy")} className="rounded transition-all text-white flex absolute justify-center items-center text-center md:w-100 md:h-20 mb-70 md:text-4xl text-3xl w-80 h-20 bg-green-600 light:bg-green-500 active:opacity-80 hover:scale-110 shadow-black shadow-md">
                <Link href="/game" passHref>
                    <button className="md:w-100 md:h-20 w-80 h-20">
                        Easy
                    </button>
                </Link>
            </div>
            <div onClick={() => setDifficulty("medium")} className="rounded transition-all text-white flex absolute justify-center items-center text-center md:w-100 md:h-20 mb-20 md:text-4xl text-3xl w-80 h-20 bg-orange-600 light:bg-orange-500 active:opacity-80 hover:scale-110 shadow-black shadow-md">
                <Link href="/game" passHref>
                    <button className="md:w-100 md:h-20 w-80 h-20">
                        Medium
                    </button>
                </Link>
            </div>
            <div onClick={() => setDifficulty("hard")} className="rounded transition-all text-white flex absolute justify-center items-center text-center md:w-100 md:h-20 mt-30 md:text-4xl text-3xl w-80 h-20 bg-red-600 light:bg-red-500 active:opacity-80 hover:scale-110 shadow-black shadow-md">
                <Link href="/game" passHref>
                    <button className="md:w-100 md:h-20 w-80 h-20">
                        Hard
                    </button>
                </Link>
            </div>

            <div className="absolute justify-center bg-white/20 rounded-lg h-23 w-43 items-center flex flex-row transition-all text-center bottom-1/6 gap-3">
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