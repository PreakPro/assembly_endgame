interface MainProps {
    currentWord: string,
    guessedLetters: string[]
}

export default function LetterDisplay(props: MainProps) {
    return (
        (props.currentWord ?? "").split('').map((letter, key) => (
		<span
			key={key}
			className="flex rounded-sm light:bg-neutral-400 light:text-black light:border-b-neutral-800 light:border-b-2 bg-neutral-700 h-13 w-13 md:m-1 select-none text-white text-xl text-center items-center justify-center border-b-neutral-300 border-b-1 md:scale-100 scale-80"
		>
			{props.guessedLetters.includes(letter) ? letter.toUpperCase() : null}
		</span>
	))
    )
}