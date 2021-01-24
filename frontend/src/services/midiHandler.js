//Return an array with inputs and outputs
const getInputsAndOutputs = (filter) => (subscribe) => {
	navigator.requestMIDIAccess()
		.then(filter)
		.then(inputs => {
			inputs.forEach(subscribe);
		})
		.catch(
			() => window.alert('Could not automatically get a MIDI device. Make sure that you are using a compatible browser.')
		);
}

export default getInputsAndOutputs;

//Play note to MIDI output with note info array (formatted as [on/off, note, velocity])
// function playNote = (noteInfo, midiOutput) => {
// 	midiOutput.send([noteInfo[0],noteInfo[1],noteInfo[2]]);
// }