"use client"
import { languages } from "../../lib/languages"
import { getFarewellText, cn } from "../../lib/utils"
import LanguagesDisplay from "@/components/languagesDisplay"
import { useEffect, useMemo, useRef, useState } from "react"
import { easyWords, mediumWords, hardWords } from "../../lib/words"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import toast, { Toaster } from "react-hot-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import CoinDisplay from "@/components/coinDisplay"
import Hint from "@/components/hint"

export default function AssemblyEndgame() {
	const [currentWord, setCurrentWord] = useState<string>("")
	const [guessedLetters, setGuessedLetters] = useState<string[]>([])
	const [isGameOver, setIsGameOver] = useState<boolean>(false)
	const [theme, setTheme] = useState<string | null>(null)
	const [difficulty, setDifficulty] = useState<string | null>(null)
	const [coins, setCoins] = useState<number | null>(null)
	const [hints, setHints] = useState<number | null>(null)
	const [usedHintLetters, setUsedHintLetters] = useState<string[]>([])
	const [hintLoading, setHintLoading] = useState(false);
	const [coinChangeDirection, setCoinChangeDirection] = useState<"up" | "down" | null>(null);	

	const letterRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
	const newGameRef = useRef<HTMLButtonElement>(null)
	const coinAnimationInterval = useRef<NodeJS.Timeout | null>(null);
	const isRunning = useRef(false)
	const alphabet = "abcdefghijklmnopqrstuvwxyz"
	const darkModeBg = "./dark_mode_bg.png"
	const lightModeBg = "./light_mode_bg.png"

	const wrongGuesses = useMemo(
		() => guessedLetters.filter(letter => !currentWord.includes(letter)).length,
		[guessedLetters, currentWord]
	)

	const hasWon = useMemo(
		() => currentWord.split("").every(letter => guessedLetters.includes(letter)),
		[currentWord, guessedLetters]
	)

	const hasLost = useMemo(
		() => wrongGuesses >= languages.length - 1,
		[wrongGuesses]
	)

	const farewellText = useMemo(
		() =>
			languages[wrongGuesses - 1]
				? getFarewellText(languages[wrongGuesses - 1].name)
				: "",
		[wrongGuesses]
	)

	useEffect(() => setTheme(localStorage.getItem("theme")), [])
	useEffect(() => setDifficulty(localStorage.getItem("difficulty")), [])

	useEffect(() => { //onGameLose decrease coins logic
		if (!hasLost) return;

		let penalty = 0;
		if (difficulty === "hard") penalty = 50;
		else if (difficulty === "medium") penalty = 20;

		decreaseCoins(penalty);	
	}, [hasLost])

	useEffect(() => { //coins setup
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("coins");

			if (stored === null) {
				localStorage.setItem("coins", "100");
				setCoins(100);
			} else {
				const coin = Number(stored);
				setCoins(coin);
			}
		}
    }, []);

	useEffect(() => { //hints = 1 setup
		if (!hints) return setHints(1)
	}, [])

	useEffect(() => { //new word logic
		if (!difficulty) return
		const pool =
			difficulty === "easy"
				? easyWords
				: difficulty === "medium"
				? mediumWords
				: hardWords
		const word = pool[Math.floor(Math.random() * pool.length)]
		setCurrentWord(word)
	}, [difficulty])

	useEffect(() => { //hint re-render updates
		if (!currentWord || hints === 0) return

		if (isRunning.current) return;

		const wordLetters = [
			...new Set(
				currentWord
					.split("")
					.filter(
						letter =>
							!guessedLetters.includes(letter) &&
							!usedHintLetters.includes(letter)
					)
			),
		]

		const nextHintLetter = wordLetters[0]

		if (nextHintLetter) {
			setUsedHintLetters(prev => [...prev, nextHintLetter])
			setGuessedLetters(prev => [...new Set([...prev, nextHintLetter])])
		}
	}, [])
   
	useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const button = letterRefs.current[key];

            if (alphabet.includes(key) && button) {
                button.click();
            }

            if (key === "enter" || key === " ") {
                newGameRef.current?.click();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [alphabet]);


	function onLetterClick(letter: string) {
		setGuessedLetters(prev =>
			prev.includes(letter) ? prev : [...prev, letter]
		)
	}

	async function increaseCoins(value: number) {
		if (value <= 0) return
    	if (coinAnimationInterval.current) {
    	    clearInterval(coinAnimationInterval.current);
    	}
		
		setCoinChangeDirection("up")

    	const start = coins ?? 0;
    	const end = start + value;
	
    	let current = start;
	
    	coinAnimationInterval.current = setInterval(() => {
    	    current += 2;
    	    setCoins(current);
		
    	    if (current >= end) {
    	        if (coinAnimationInterval.current) {
    	            clearInterval(coinAnimationInterval.current);
    	            coinAnimationInterval.current = null;
					setCoinChangeDirection(null);
    	        }
    	    }
    	}, 1);
	}

	async function decreaseCoins(value: number) {
		if (value <= 0) return
		if (coinAnimationInterval.current) {
			clearInterval(coinAnimationInterval.current);
		}

		setCoinChangeDirection("down")

		const start = coins ?? 0;
		const end = Math.max(start - value, 0);
		let current = start;

		coinAnimationInterval.current = setInterval(() => {
			current -= 2;
			setCoins(current);

			if (current <= end) {
				clearInterval(coinAnimationInterval.current!);
				coinAnimationInterval.current = null;
				setCoinChangeDirection(null);
			}
		}, 30);
	}

	async function useHint() {
	    if (hintLoading || isRunning.current) return;

	    const wordLetters = [...new Set(
	        currentWord
	            .split("")
	            .filter(letter =>
	                !guessedLetters.includes(letter) &&
	                !usedHintLetters.includes(letter)
	            )
	    )];

	    const nextHintLetter = wordLetters[0];

	    if (!nextHintLetter) {
	        toast.error("No more hintable letters left!");
	        return;
	    }

	    isRunning.current = true;
	    setHintLoading(true);

	    try {
	        const cost = (hints ?? 1) * 20;

		if ((coins ?? 100) >= cost) {
		    setHints(prev => (prev ?? 1) + 1);
		
			setCoinChangeDirection("down")
			setCoins(prev => Math.max((prev ?? 0) - cost, 0));
		
		    setUsedHintLetters(prev => [...prev, nextHintLetter]);
		    setGuessedLetters(prev => [...new Set([...prev, nextHintLetter])]);		
		}

	        else {
	            toast.error("Not enough coins");
	        }
	    } finally {
	        setTimeout(() => {
				setCoinChangeDirection(null)
	            isRunning.current = false;
	            setHintLoading(false);
	        }, 200);
	    }
	}

	
	function newGame() {
		const pool =
			difficulty === "easy"
				? easyWords
				: difficulty === "medium"
				? mediumWords
				: hardWords
		const word = pool[Math.floor(Math.random() * pool.length)]
		setCurrentWord(word)
		setGuessedLetters([])
		setIsGameOver(false)
		setHints(1)
		setUsedHintLetters([])
	}

	useEffect(() => {  //hasWon, increase coins and conftti
		if (!currentWord) return

		const hasLost = wrongGuesses >= languages.length - 1

		if (hasWon) {
			const addedCoins = difficulty === "easy" ? 30 : difficulty === "medium" ? 40 : 50
			increaseCoins(addedCoins)
			confetti({ particleCount: 150, spread: 130, origin: { y: 0.6 } })
		}

		if (hasWon || hasLost) {
			setIsGameOver(true)
		}
	}, [guessedLetters, wrongGuesses, currentWord])

    useEffect(() => {
        if (coins !== null) {
            localStorage.setItem('coins', String(coins));
        }
    }, [coins]);

	useEffect(() => {
		(window as any).gimmeCoins = (password: string, value: number) => password === "weliveinacruelworld" ? increaseCoins(value) : console.log("Wrong password.");
		(window as any).gimmeWord = (password: string) => password === "weliveinacruelworld" ? console.log(currentWord) : console.log("Wrong password")
	}, [currentWord])

	if (!currentWord)
		return ( //loading game
			<main className="text-white p-10 text-center">
				Loading game...
			</main>
		)

	if ((coins ?? 100) < 0) {
		setCoins(0)
	}

	return (
		<div 
			className={cn("relative h-screen w-full", { light: theme !== "dark" })}
			style={{
    		    backgroundImage: `url(${
    		        theme === "dark" ? darkModeBg : lightModeBg
    		    })`,
    		    backgroundSize: "cover",
    		    backgroundPosition: "center",
    		    backgroundRepeat: "no-repeat",
    		}}
		>
			<Toaster />
			<main
				className={cn(
					"flex flex-col relative z-10 h-full min-h-0 overflow-y-auto transition-all duration-300",
					{
						"blur-md pointer-events-none": isGameOver,
					}
				)}
			>
				<Link href="/">
					<ArrowLeft
						stroke={theme === "dark" ? "white" : "black"}
						className="transition-all w-10 h-10 m-5 absolute hover:scale-120"
					/>
				</Link>

				<div className="relative z-50 p-6 mt-20 flex flex-col justify-center items-center">
					<section
						className={cn(
							"rounded justify-center mx-auto text-center w-80 md:w-120 p-6 text-white z-10",
							{
								"bg-purple-700 border-1 light:bg-purple-400 light:border-1 light:border-black":
									!isGameOver,
							},
							{
								"bg-cyan-600 border-1 light:bg-cyan-400 light:border-1 light:border-black":
									wrongGuesses === 0,
							}
						)}
					>
						<h2 className="text-xl font-semibold text-white light:text-black ">
							{isGameOver ? (
								""
							) : wrongGuesses === 0 ? (
								<span>Start Playing by guessing the letters!</span>
							) : (
								farewellText
							)}
						</h2>
					</section>

					<section className="flex flex-wrap justify-center items-center mx-auto md:w-120 mt-7">
						<LanguagesDisplay wrongGuesses={wrongGuesses} />
					</section>

					<section className="flex flex-row justify-center mt-4">
						<div className="flex flex-wrap justify-center">
							{currentWord.split("").map((letter, key) => (
								<span
									key={key}
									className="flex rounded-sm light:bg-neutral-400 light:text-black light:border-b-neutral-800 light:border-b-2 bg-neutral-700 h-13 w-13 md:m-1 select-none text-white text-xl text-center items-center justify-center border-b-neutral-300 border-b-4 md:border-b-2 md:scale-100 scale-80"
								>
									{guessedLetters.includes(letter)
										? letter.toUpperCase()
										: null}
								</span>
							))}
						</div>
					</section>

					<section className="flex flex-wrap md:w-120 px-5 justify-center text-center mx-auto m-5">
						{alphabet.split("").map((letter, key) => {
							const isGuessed = guessedLetters.includes(letter)
							const isCorrect =
								isGuessed && currentWord.includes(letter)
							const isWrong =
								isGuessed && !currentWord.includes(letter)

							return (
								<button
									key={key}
									ref={el => {
										letterRefs.current[letter] = el
									}}
									disabled={isGameOver}
									onClick={() => onLetterClick(letter)}
									className={cn(
										"flex transition-all text-center items-center justify-center rounded md:m-1 border-1 border-white scale-85 md:scale-100 w-10 h-10 text-black",
										{
											"bg-amber-400 hover:bg-amber-300 hover:scale-105":
												!isGuessed,
											"bg-amber-400 opacity-30": isGameOver,
											"bg-green-500": isCorrect,
											"bg-red-600": isWrong,
										}
									)}
								>
									{letter.toUpperCase()}
								</button>
							)
						})}
					</section>

					<Hint disabled={hintLoading} onClick={useHint}>{(hints ?? 1) * 20}</Hint>
				</div>
			</main>

			<CoinDisplay className="z-50" direction={coinChangeDirection}>{coins}</CoinDisplay>

			{isGameOver && (
				<div className="absolute inset-0 flex flex-col items-center mb-20 justify-center z-100">
					{hasWon ? (
						<motion.div
							initial={{ scale: 0.6, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.5, ease: "easeOut" }}
							className="rounded border-2 border-neutral-300 text-white text-center mb-8 md:mb-20 w-120 p-6 shadow-2xl bg-green-600 scale-70 md:scale-125"
						>
							<h2 className="text-4xl font-bold mb-2">You Win!</h2>
							<p className="text-lg">Well done! 🎉 The word was {currentWord.toUpperCase()}	</p>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: [0.2, 1, 0.2, 1] }}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								repeatType: "mirror",
							}}
							className="rounded border-2 border-neutral-300 text-white text-center mb-8 md:mb-20 w-120 p-6 shadow-2xl bg-red-700 scale-70 md:scale-125"
						>
							<h2 className="text-4xl font-bold mb-2 animate-glitch">
								YOU LOSE!
							</h2>
							<p className="text-lg animate-glitch">
								Better start learning Assembly😭 
								The word was {currentWord.toUpperCase()}
							</p>
						</motion.div>
					)}
					<button
						ref={newGameRef}
						onClick={newGame}
						className="transition-all bg-blue-400 hover:bg-blue-300 hover:scale-105 border-1 text-black border-neutral-200 rounded h-10 w-80 block mx-auto"
					>
						New Game
					</button>
				</div>
			)}
		</div>
	)
}
