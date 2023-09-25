interface LetterProps {
	letter: string,
	box_style: string,
	text_style: string,
}

export default function Letter(props: LetterProps) {
	return (
		<div className={`${props.box_style} w-12 h-12 p-1 border-gray-500 box-border justify-center justify-items-center flex border-2`}>
			<p className={`${props.text_style} text-center align-middle uppercase text-2xl`}>{props.letter}</p>
		</div>
	)
}