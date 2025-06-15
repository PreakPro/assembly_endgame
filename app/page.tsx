"use client"
import { languages } from "../lib/languages"
import { getFarewellText, cn } from "../lib/utils"
import { useEffect, useMemo, useRef, useState } from "react"
import { words } from "../lib/words"	
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
 
export default function AssemblyEndgame() {
	const [currentWord, setCurrentWord] = useState<string>("")
	const [guessedLetters, setGuessedLetters] = useState<string[]>([])
	const [isGameOver, setIsGameOver] = useState<boolean>(false)
	const letterRefs = useRef<{[key: string]: HTMLButtonElement | null}>({})
	const newGameRef = useRef<HTMLButtonElement>(null)
	const alphabet = "abcdefghijklmnopqrstuvwxyz"

	const wrongGuesses = useMemo(() => {
		return guessedLetters.filter(letter => !currentWord.includes(letter)).length
	}, [guessedLetters, currentWord])

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
					"rounded px-3 py-1 m-1 text-black",
					{ "opacity-30": wrongGuesses > key }
				)}
			>
				{values.name}
			</button>
			<span className="absolute inset-0 z-10 h-full w-full translate-y-2">{wrongGuesses > key ? "💀" : null}</span>
		</div>
	))

	function onLetterClick(letter: string, key: number) {
		setGuessedLetters(prevLetters => prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter])
	}

	const letterDisplay = (currentWord ?? "").split('').map((letter, key) => (
		<span
			key={key}
			className="flex rounded-sm bg-neutral-700 h-13 w-13 m-1 select-none text-white text-xl text-center items-center justify-center border-b-neutral-300 border-b-1"
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
				disabled={isGameOver}
				onClick={() => onLetterClick(letter, key)}
				className={cn(
					"flex transition-all text-center items-center justify-center rounded m-1 border-1 border-white w-10 h-10 text-black",
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
		return <main className="text-white p-10 text-center">Loading word...</main>
	}

	const hasWon = currentWord.split("").every(letter => guessedLetters.includes(letter))

	console.log(currentWord)

	return (
		<div className="relative h-screen bg-neutral-800">
			<main className={cn(
				"flex flex-col h-full transition-all duration-300",
				{ "blur-md pointer-events-none": isGameOver }
			)}>
				<header className="p-5 justify-center text-center">
					<h1 className="text-white text-3xl">Assembly: Endgame</h1>
					<p className="text-neutral-300 text-lg mt-2">
						Guess the word within 8 attempts to keep the programming world safe from Assembly!
					</p>
				</header>

				<section className={cn(
					"rounded justify-center mx-auto text-center w-120 p-3 text-white mt-3",
					{ "bg-red-500": wrongGuesses >= languages.length - 1 },
					{ "bg-purple-700 p-6": wrongGuesses !== 0 && !isGameOver && wrongGuesses < languages.length - 1 }
				)}>
					<h2 className="text-xl font-bold">
						{!isGameOver ? farewellText : ""}
					</h2>
				</section>

				<section className="flex flex-wrap justify-center items-center mx-auto w-120 mt-7">
					{languagesDisplay}
				</section>

				<section className="flex flex-row justify-center mt-4">
					{letterDisplay}
				</section>

				<section className="flex flex-wrap w-110 justify-center text-center mx-auto m-5">
					{keyboardDisplay}
				</section>

			</main>

		{isGameOver && (
		<div className="absolute inset-0 flex flex-col items-center justify-center z-50">
			{hasWon ? (
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					className="rounded border-2 border-neutral-300 text-white text-center mb-20 w-120 p-6 shadow-2xl bg-green-600 scale-125"
				>
					<h2 className="text-4xl font-bold mb-2">You Win!</h2>
					<p className="text-lg">Well done! 🎉</p>
				</motion.div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: [0.2, 1, 0.5, 1] }}
					transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
					className="rounded border-2 border-neutral-300 text-white text-center mb-20 w-120 p-6 shadow-2xl bg-red-700 scale-125 animate-glitch"
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
