import { Instrument } from "piano-chart";

export default function Piano() {
    

	const piano = new Instrument(document.getElementById('pianoContainer'),{
        startOctave: 1,
    	startNote: "A",
    	endOctave: 6,
    	endNote: "C",
    	highlightedNotes: ["D", "E", "F#", "G", "A", "B", "C#"],
    	specialHighlightedNotes: ["D"],
	});
	return piano;
}