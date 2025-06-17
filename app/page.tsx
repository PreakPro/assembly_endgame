"use client"
import { languages } from "../lib/languages"
import { getFarewellText, cn } from "../lib/utils"
import { useEffect, useMemo, useRef, useState } from "react"
import { Moon, Sun, Info } from "lucide-react"
import { words } from "../lib/words"	
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
 
export default function AssemblyEndgame() {
	const [currentWord, setCurrentWord] = useState<string>("")
	const [guessedLetters, setGuessedLetters] = useState<string[]>([])
	const [isGameOver, setIsGameOver] = useState<boolean>(false)
	const [theme, setTheme] = useState<string | null>(null);
	const [isInfoOpen, setisInfoOpen] = useState<boolean>(false)
	const letterRefs = useRef<{[key: string]: HTMLButtonElement | null}>({})
	const newGameRef = useRef<HTMLButtonElement>(null)
	const alphabet = "abcdefghijklmnopqrstuvwxyz"
	const darkModeBg = "./dark_mode_bg.png"
	const lightModeBg = "./light_mode_bg.png"

	const wrongGuesses = useMemo(() => {
		return guessedLetters.filter(letter => !currentWord.includes(letter)).length
	}, [guessedLetters, currentWord])

	useEffect(() => {
		const storedTheme = typeof window !== "undefined" ? localStorage.getItem('theme') : null;
		if (storedTheme) {
			setTheme(storedTheme);
		} else {
			localStorage.setItem('theme', 'dark');
			setTheme('dark');
		}
	}, []);

	useEffect(() => {
		function generateRandomWord() {
			const word = words[Math.floor(Math.random() * words.length)]
			setCurrentWord(word)
		}
		generateRandomWord()
	}, [])

	const languagesDisplay = languages.map((values, key) => (
		<div key={key} className="relative inline-block justify-center items-center text-center">
			<button
				style={{
					backgroundColor: values.backgroundColor,
					color: values.color,
				}}
				className={cn(
					"rounded px-3 py-1 m-1 focus:border-0",
					{ "opacity-30": wrongGuesses > key }
				)}
			>
				{values.name}
			</button>
			<span className="absolute inset-0 z-10 h-full w-full translate-y-2">{wrongGuesses > key ? "💀" : null}</span>
		</div>
	))

	function onLetterClick(letter: string) {
		setGuessedLetters(prevLetters => prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter])
	}

	const letterDisplay = (currentWord ?? "").split('').map((letter, key) => (
		<span
			key={key}
			className="flex rounded-sm light:bg-neutral-400 light:text-black light:border-b-neutral-800 light:border-b-2 bg-neutral-700 h-13 w-13 md:m-1 select-none text-white text-xl text-center items-center justify-center border-b-neutral-300 border-b-1 md:scale-100 scale-80"
		>
			{guessedLetters.includes(letter) ? letter.toUpperCase() : null}
		</span>
	))

	useEffect(() => {
  		const handleKeyDown = (e: KeyboardEvent) => {
			window.addEventListener("keydown", handleKeyDown);
		}
  		return () => {
    		window.removeEventListener("keydown", handleKeyDown);
  		};
	}, []);

	const keyboardDisplay = alphabet.split("").map((letter, key) => {
		const isGuessed = guessedLetters.includes(letter)
		const isCorrect = isGuessed && currentWord.includes(letter)
		const isWrong = isGuessed && !currentWord.includes(letter)

		return (
			<button
				key={key}
				ref={(el) => {letterRefs.current[letter] = el}}
				disabled={isGameOver || isInfoOpen}
				onClick={() => onLetterClick(letter)}
				className={cn(
					"flex transition-all text-center items-center justify-center rounded md:m-1 border-1 border-white scale-85 md:scale-100 w-10 h-10 text-black",
					{
						"bg-amber-400 hover:bg-amber-300 hover:scale-105": !isGuessed,
						"bg-amber-400 opacity-30": isGameOver,
						"bg-green-500": isCorrect,
						"bg-red-600": isWrong
					}
				)}
			>
				{letter.toUpperCase()}
			</button>
		)
	})

	useEffect(() => {
		if (!currentWord) return

		const hasWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
		const hasLost = wrongGuesses >= languages.length - 1

		if (hasWon || hasLost) {
			setIsGameOver(true)
			console.log("game over desu")
		}

		if (hasWon) {
			confetti({
        		particleCount: 150,
        		spread: 130,
        		origin: { y: 0.6 }
      });
		}
	}, [guessedLetters, wrongGuesses, currentWord])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase(); 
			const button = letterRefs.current[key];
			if (alphabet.includes(key) && button) {
    			button.click();
    		}
			if (key === "enter" || key === " ") {
				newGameRef.current?.click()
			}
		}
		window.addEventListener("keydown", handleKeyDown);
  		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [])

	function newGame() {
		setIsGameOver(false)
		setGuessedLetters([])
		setCurrentWord(words[Math.floor(Math.random() * words.length)])
	}

	const farewellText = useMemo(() => {
		if (languages[wrongGuesses - 1]) return getFarewellText(languages[wrongGuesses - 1].name)
		return ""
	}, [wrongGuesses])

	if (!currentWord) {
		return <main className="text-white p-10 text-center">Loading game...</main>
	}

	const hasWon = currentWord.split("").every(letter => guessedLetters.includes(letter))

	function toggleTheme() {
		localStorage.setItem('theme', theme === "dark" ? "light" : "dark")
		setTheme(localStorage.getItem('theme'))
	}

	function isInfoOpenToggle() {
        setisInfoOpen(prev => !prev)
    }

	// console.log(currentWord)

	return (
		<div className={cn("relative h-screen bg-neutral-800",
			{"light": theme!=="dark"}
		)}>
			<main
				className={cn(
					"flex flex-col relative z-10 h-full transition-all duration-300 ",
					{ "blur-md pointer-events-none": isGameOver || isInfoOpen }
				)}
				style={{
					backgroundImage: `url(${theme === "dark" ? darkModeBg : lightModeBg})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>	
				<div className="relative z-50">
					<div onClick={toggleTheme} className="absolute m-5 flex justify-self-end max-h-10 transition hover:scale-110">
						{theme === "dark" ? <Moon color="white" className="bg-neutral-800 rounded w-10 h-10 p-2"/> : <Sun className="bg-neutral-300 rounded w-10 h-10 p-2"/>}
					</div>

					<header className="p-5 justify-center text-center">
						<h1 className="text-white text-2xl md:text-3xl light:text-gray-900">Assembly: Endgame</h1>
						{wrongGuesses === 0 && <p className="text-neutral-300 md:text-lg md:mt-2 mt-4 light:text-black">
							Guess the word within 8 attempts to keep the programming world safe from Assembly!
						</p>}
					</header>

					<section className={cn(
						"rounded justify-center mx-auto text-center w-80 md:w-120 p-3 text-white mt-3",	
						{ "bg-purple-700 border-1 light:bg-purple-400 p-6 light:border-1 light:border-black": wrongGuesses !== 0 && !isGameOver}
					)}>
						<h2 className="text-xl font-semibold text-white light:text-black">
							{!isGameOver ? farewellText : ""}
						</h2>
					</section>

					<section className="flex flex-wrap justify-center items-center mx-auto md:w-120 mt-7">
						{languagesDisplay}
					</section>

					<section className="flex flex-row justify-center mt-4">
						{letterDisplay}
					</section>

					<section className="flex flex-wrap md:w-120 px-5 justify-center text-center mx-auto m-5">
						{keyboardDisplay}
					</section>
				</div>
			</main>

			<section className="justify-center text-center items-center z-50">
				<Info 
					onClick={isInfoOpenToggle}
					stroke={theme === "dark" ? "white" : "black"}
					className="absolute top-5 right-5 flex transition-all justify-self-end w-10 h-10 p-2 hover:scale-110 rounded bg-neutral-800 active:bg-neutral-900 light:active:bg-neutral-400 light:bg-neutral-300 z-50"
				/>
				{isInfoOpen && (	
					<motion.div 
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-neutral-300 light:border-black justify-center text-center items-center bg-emerald-700 light:bg-emerald-500 flex flex-col mx-auto my-auto max-w-lg w-100 md:w-150 p-8 z-50 scale-75 md:scale-120"
						initial={{ scale: 0.7, opacity: 0.5 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.2, ease: "easeIn" }}
					>
						<h1 className="text-3xl font-semibold mb-2 text-white light:text-black">How To Play</h1>
						<p className="text-base text-wrap font-mono text-white light:text-black">Guess the word by clicking or typing letters. Everytime you make a mistake, one programming gets DELETED from this world. Can you guess the word before the world goes back to Assembly?</p>
					</motion.div>
				)}
			</section>
				
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
					<p className="text-lg">Well done! 🎉</p>
				</motion.div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: [0.2, 1, 0.2, 1] }}
					transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror"}}
					className="rounded border-2 border-neutral-300 text-white text-center mb-8 md:mb-20 w-120 p-6 shadow-2xl bg-red-700 scale-70 md:scale-125"
				>
					<h2 className="text-4xl font-bold mb-2 animate-glitch">YOU LOSE!</h2>
					<p className="text-lg animate-glitch">Better start learning Assembly😭</p>
				</motion.div>
			)}
				<button ref={newGameRef} onClick={newGame} className="transition-all bg-blue-400 hover:bg-blue-300 hover:scale-105 border-1 text-black border-neutral-200 rounded h-10 w-80 block mx-auto">New Game</button>
			</div>
			)}
		</div>
	)
}
