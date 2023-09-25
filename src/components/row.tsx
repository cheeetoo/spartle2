import Letter from "./letter";

export default function Row() {
	return (
		<div className="mx-auto">
			<li className="grid grid-cols-5 gap-2">
				<Letter letter="" text_style="" box_style="bg-gray-400" />
				<Letter letter="" text_style="" box_style="bg-gray-400" />
				<Letter letter="" text_style="" box_style="bg-gray-400" />
				<Letter letter="" text_style="" box_style="bg-gray-400" />
				<Letter letter="" text_style="" box_style="bg-gray-400" />
			</li>
		</div>
	)
}