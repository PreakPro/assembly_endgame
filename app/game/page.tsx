"use client"
import { languages } from "../../lib/languages"
import { getFarewellText, cn } from "../../lib/utils"
import LanguagesDisplay from "@/components/languagesDisplay"
import LetterDisplay from "@/components/letterDisplay"
import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react"
import { words } from "../../lib/words"	
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
 
export default function AssemblyEndgame() {
	const [currentWord, setCurrentWord] = useState<string>("")
	const [guessedLetters, setGuessedLetters] = useState<string[]>([])
	const [isGameOver, setIsGameOver] = useState<boolean>(false)
	const [theme, setTheme] = useState<string | null>(null)
	const letterRefs = useRef<{[key: string]: HTMLButtonElement | null}>({})
	const newGameRef = useRef<HTMLButtonElement>(null)
	const alphabet = "abcdefghijklmnopqrstuvwxyz"
	const darkModeBg = "./dark_mode_bg.png"
	const lightModeBg = "./light_mode_bg.png"

	const wrongGuesses = useMemo(() => {
		return guessedLetters.filter(letter => !currentWord.includes(letter)).length
	}, [guessedLetters, currentWord])

	useLayoutEffect(() => {
		setTheme(localStorage.getItem('theme'))
	})

	useEffect(() => {
		function generateRandomWord() {
			const word = words[Math.floor(Math.random() * words.length)]
			setCurrentWord(word)
		}
		generateRandomWord()
	}, [])

	const languagesDisplay = <LanguagesDisplay wrongGuesses={wrongGuesses}/>

	const letterDisplay = <LetterDisplay currentWord={currentWord} guessedLetters={guessedLetters}/>
	
	function onLetterClick(letter: string) {
		setGuessedLetters(prevLetters => prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter])
	}


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
				disabled={isGameOver}
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

	console.log(currentWord)

	return (
		<div className={cn("relative h-screen bg-neutral-800",
			{"light": theme !== "dark"}
		)}>
			<main
				className={cn(
					"flex flex-col relative z-10 h-full transition-all duration-300 ",
					{ "blur-md pointer-events-none": isGameOver}
				)}
				style={{
					backgroundImage: `url(${theme === "dark" ? darkModeBg : lightModeBg})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>	
				<div className="relative z-50 p-6 mt-20">
					<section className={cn(
						"rounded justify-center mx-auto text-center w-80 md:w-120 p-6 text-white z-10",	
						{ "bg-purple-700 border-1 light:bg-purple-400 light:border-1 light:border-black": !isGameOver},
						{"bg-cyan-600 border-1 light:bg-cyan-400 light:border-1 light:border-black": wrongGuesses===0}
					)}>
						<h2 className="text-xl font-semibold text-white light:text-black">
							{isGameOver ? "" : (
								<>
									{wrongGuesses === 0 ? (
										<span>Start Playing</span>
									) : (
										<>
											{farewellText}
										</>
									)}
								</>
							)}
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
