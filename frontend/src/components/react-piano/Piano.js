import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import difference from 'lodash.difference';
import ControlledPiano from './ControlledPiano';
import Keyboard from './Keyboard';

class Piano extends React.Component {
  static propTypes = {
    noteRange: PropTypes.object.isRequired,
    activeNotes: PropTypes.arrayOf(
        PropTypes.shape({
          midiNumber: PropTypes.number.isRequired,
          velocity: PropTypes.number
        })
    ),
    playNote: PropTypes.func.isRequired,
    stopNote: PropTypes.func.isRequired,
    onPlayNoteInput: PropTypes.func,
    onStopNoteInput: PropTypes.func,
    renderNoteLabel: PropTypes.func,
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

  state = {
    activeNotes: this.props.activeNotes || [],
  };

  componentDidUpdate(prevProps) {
    // Make activeNotes "controllable" by using internal
    // state by default, but allowing prop overrides.
    if (
        prevProps.activeNotes !== this.props.activeNotes &&
        this.state.activeNotes !== this.props.activeNotes
    ) {
      this.setState({
        activeNotes: this.props.activeNotes || [],
      });
    }
  }

  handlePlayNoteInput = (midiNumber, velocity, doCallback) => {
    this.setState((prevState) => {
      // Don't append note to activeNotes if it's already present
      if (prevState.activeNotes.some( note => note.midiNumber === midiNumber)) {
        return null;
      }
      // Need to be handled inside setState in order to set prevActiveNotes without
      // race conditions.
      if (this.props.onPlayNoteInput && doCallback) {
        this.props.onPlayNoteInput(midiNumber, velocity) //, { prevActiveNotes: prevState.activeNotes });
      }
      return {
        activeNotes: prevState.activeNotes.concat({midiNumber: midiNumber, velocity: velocity}),
      };
    });
  };

  handleStopNoteInput = (midiNumber, velocity, doCallback) => {
    this.setState((prevState) => {
      // Don't remove note from activeNotes if it's already gone
      if (!prevState.activeNotes.some( note => note.midiNumber === midiNumber)) {
        return null;
      }

      // Need to be handled inside setState in order to set prevActiveNotes without
      // race conditions.
      if (this.props.onStopNoteInput && doCallback) {
        this.props.onStopNoteInput(midiNumber, velocity) //, { prevActiveNotes: this.state.activeNotes });
      }
      return {
        activeNotes: prevState.activeNotes.filter((note) => note.midiNumber !== midiNumber),
      };
    });
  };

  render() {
    const { activeNotes, onPlayNoteInput, onStopNoteInput, ...otherProps } = this.props;
    return (
      <ControlledPiano
        activeNotes={this.state.activeNotes}
        onPlayNoteInput={this.handlePlayNoteInput}
        onStopNoteInput={this.handleStopNoteInput}
        {...otherProps}
      />
    );
  }
}

export default Piano;
