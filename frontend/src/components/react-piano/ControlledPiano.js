import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import difference from 'lodash.difference';
import Keyboard from './Keyboard';
import midimessage from 'midimessage';

class ControlledPiano extends React.Component {
  static propTypes = {
    noteRange: PropTypes.object.isRequired,
    activeNotes: PropTypes.arrayOf(
        PropTypes.shape({
          midiNumber: PropTypes.number.isRequired,
          velocity: PropTypes.number
        })
    ).isRequired,
    playNote: PropTypes.func.isRequired,
    stopNote: PropTypes.func.isRequired,
    onPlayNoteInput: PropTypes.func.isRequired,
    onStopNoteInput: PropTypes.func.isRequired,
    renderNoteLabel: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    width: PropTypes.number,
    keyWidthToHeight: PropTypes.number,
    keyboardShortcuts: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        midiNumber: PropTypes.number.isRequired,
      }),
    ),
  };

  static defaultProps = {
    renderNoteLabel: ({ keyboardShortcut, midiNumber, isActive, isAccidental }) =>
      keyboardShortcut ? (
        <div
          className={classNames('ReactPiano__NoteLabel', {
            'ReactPiano__NoteLabel--active': isActive,
            'ReactPiano__NoteLabel--accidental': isAccidental,
            'ReactPiano__NoteLabel--natural': !isAccidental,
          })}
        >
          {keyboardShortcut}
        </div>
      ) : null,
  };

  state = {
    isMouseDown: false,
    useTouchEvents: false,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.props.MIDIInput(this.subscribeMidi);
    this.subscribeRTC(this.props.RTCInput);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.activeNotes !== prevProps.activeNotes) {
      this.handleNoteChanges(prevProps.activeNotes || [],
          this.props.activeNotes || []);
    }
  }

  subscribeMidi = (input) => {
    input.onmidimessage = (msg) => {
      const mm = msg.messageType ? msg : midimessage(msg)
      if (mm.messageType === 'noteon' && mm.velocity === 0) {
        mm.messageType = 'noteoff'
      }

      switch (mm.messageType) {
        case 'noteon':
          this.onPlayNoteInput(mm.key, mm.velocity, true);
          break;
        case 'noteoff':
          this.onStopNoteInput(mm.key, mm.velocity, true);
          break;
        default:
          console.log('unsupported ' + mm.messageType);
      }
    }
  };

  subscribeRTC = (setInput) => {
    setInput({
      onrtcmessage: (msg) => {
        console.log('received inner');
        console.log(msg);
        const mm = midimessage(msg);
        console.log(mm);
        if (mm.messageType === 'noteon' && mm.velocity === 0) {
          mm.messageType = 'noteoff'
        }

        switch (mm.messageType) {
          case 'noteon':
            this.onPlayNoteInput(mm.key, mm.velocity, false);
            break;
          case 'noteoff':
            this.onStopNoteInput(mm.key, mm.velocity, false);
            break;
          default:
            console.log('unsupported ' + mm.messageType);
        }
      }
    })
  };


  // This function is responsible for diff'ing activeNotes
  // and playing or stopping notes accordingly.
  handleNoteChanges = (prevActiveNotes, nextActiveNotes) => {
    if (this.props.disabled) {
      return;
    }
    const prevActiveNumbers = prevActiveNotes.map(note => note.midiNumber);
    const nextActiveNumbers = nextActiveNotes.map(note => note.midiNumber);
    const numbersStopped = difference(prevActiveNumbers, nextActiveNumbers);
    const numbersStarted = difference(nextActiveNumbers, prevActiveNumbers);
    const notesStopped = prevActiveNotes.filter(note => numbersStopped.includes(note.midiNumber));
    const notesStarted = nextActiveNotes.filter(note => numbersStarted.includes(note.midiNumber));
    notesStarted.forEach((note) => {
      this.props.playNote(note.midiNumber, note.velocity);
    });
    notesStopped.forEach((note) => {
      this.props.stopNote(note.midiNumber, note.velocity);
    });
  };

  getMidiNumberForKey = (key) => {
    if (!this.props.keyboardShortcuts) {
      return null;
    }
    const shortcut = this.props.keyboardShortcuts.find((sh) => sh.key === key);
    return shortcut && shortcut.midiNumber;
  };

  getKeyForMidiNumber = (midiNumber) => {
    if (!this.props.keyboardShortcuts) {
      return null;
    }
    const shortcut = this.props.keyboardShortcuts.find((sh) => sh.midiNumber === midiNumber);
    return shortcut && shortcut.key;
  };

  onKeyDown = (event) => {
    // Don't conflict with existing combinations like ctrl + t
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    const midiNumber = this.getMidiNumberForKey(event.key);
    if (midiNumber) {
      this.onPlayNoteInput(midiNumber, 127, true);
    }
  };

  onKeyUp = (event) => {
    // This *should* also check for event.ctrlKey || event.metaKey || event.ShiftKey like onKeyDown does,
    // but at least on Mac Chrome, when mashing down many alphanumeric keystrokes at once,
    // ctrlKey is fired unexpectedly, which would cause onStopNote to NOT be fired, which causes problematic
    // lingering notes. Since it's fairly safe to call onStopNote even when not necessary,
    // the ctrl/meta/shift check is removed to fix that issue.
    const midiNumber = this.getMidiNumberForKey(event.key);
    if (midiNumber) {
      this.onStopNoteInput(midiNumber, 0, true);
    }
  };

  onPlayNoteInput = (midiNumber, velocity, doCallback) => {
    if (this.props.disabled) {
      return;
    }
    // Pass in previous activeNotes for recording functionality
    this.props.onPlayNoteInput(midiNumber, velocity, doCallback) //, this.props.activeNotes);
  };

  onStopNoteInput = (midiNumber, velocity, doCallback) => {
    if (this.props.disabled) {
      return;
    }
    // Pass in previous activeNotes for recording functionality
    this.props.onStopNoteInput(midiNumber, velocity, doCallback) //, this.props.activeNotes);
  };

  onMouseDown = () => {
    this.setState({
      isMouseDown: true,
    });
  };

  onMouseUp = () => {
    this.setState({
      isMouseDown: false,
    });
  };

  onTouchStart = () => {
    this.setState({
      useTouchEvents: true,
    });
  };

  renderNoteLabel = ({ midiNumber, isActive, isAccidental }) => {
    const keyboardShortcut = this.getKeyForMidiNumber(midiNumber);
    return this.props.renderNoteLabel({ keyboardShortcut, midiNumber, isActive, isAccidental });
  };

  render() {
    return (
      <div
        style={{ width: '100%', height: '100%' }}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onTouchStart={this.onTouchStart}
        data-testid="container"
      >
        <Keyboard
          noteRange={this.props.noteRange}
          onPlayNoteInput={(midiNumber) => this.onPlayNoteInput(midiNumber, 127, true)}
          onStopNoteInput={(midiNumber) => this.onStopNoteInput(midiNumber, 0, true)}
          activeNotes={this.props.activeNotes.map(note => note.midiNumber)}
          className={this.props.className}
          disabled={this.props.disabled}
          width={this.props.width}
          keyWidthToHeight={this.props.keyWidthToHeight}
          gliss={this.state.isMouseDown}
          useTouchEvents={this.state.useTouchEvents}
          renderNoteLabel={this.renderNoteLabel}
        />
      </div>
    );
  }
}

export default ControlledPiano;
