//Return an array with inputs and outputs
function getInputsAndOutputs() {
	navigator.requestMIDIAccess().then(
		function success(midiAccess) {
			return [midiAccess.inputs,midiAccess.outputs];
		}, function failure() {
			window.alert('Could not automatically get a MIDI device. Make sure that you are using a compatible browser.')
		}
	);
}

//Play note to MIDI output with note info array (formatted as [on/off, note, velocity])
// function playNote = (noteInfo, midiOutput) => {
// 	midiOutput.send([noteInfo[0],noteInfo[1],noteInfo[2]]);
// }