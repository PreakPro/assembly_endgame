import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Info } from "lucide-react"

interface MainProps {
    isInfoOpenToggle: () => (void),
    theme: string | null | undefined,
    isInfoOpen: boolean,
	className: string,
	containerClassName?: object
}

export default function InfoThing(props: MainProps) {
    return (
		<section className={cn(" justify-center text-center items-center z-50", props.containerClassName)}>
			<Info 
				onClick={props.isInfoOpenToggle}
				stroke={props.theme === "dark" ? "white" : "black"}
				className={props.className}
			/>
			{props.isInfoOpen && (	
				<div>
					<button onClick={props.isInfoOpenToggle} className="relative transition-all text-white light:text-black rounded-lg text-3xl font-bold hover:opacity-60 bg-blue-500 p-6 w-60 z-50 mb-15 shadow-md border-2 border-black shadow-black">GOT IT!</button>
					<motion.div 
						className="realtive fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 rounded-lg border-2 border-neutral-300 light:border-black justify-center text-center items-center bg-emerald-700 light:bg-emerald-500 flex flex-col mx-auto my-auto max-w-lg w-100 md:w-150 p-8 scale-75 md:scale-120"
						initial={{ scale: 0.7, opacity: 0.5 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.2, ease: "easeIn" }}
					>
						<h1 className="md:text-3xl text-5xl font-semibold mb-2 text-white light:text-black">How To Play</h1>
						<p className="md:text-base text-2xl text-wrap font-mono text-white light:text-black mb-15">Guess the word by clicking or typing letters. Everytime you make a mistake, one programming gets DELETED from this world. Can you guess the word before the world goes back to Assembly? The fate of the world's programming languages depends on you!</p>
					</motion.div>
				</div>
			)}
		</section>
    )
}