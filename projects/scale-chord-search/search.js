// Really just a fancy wrapper for Teoria.

// TODO: Make this "searchy"-er, it's not very search right now IMO.
// Probably want to make a way to stack extensions?
const chordSearchCache = {};
function chordSearch(input) {
  if (chordSearchCache[input]) {
    return chordSearchCache[input];
  }
  const [noteName, rest] = getNote(input);
  let note, matches;
  if (noteName) {
    note = teoria.note(noteName + "4");
    matches = search(chordQualities, rest);
  } else {
    // If they didn't include a note name, it might just be a general scale search:
    note = teoria.note("C4");
    matches = search(chordQualities, input);
  }
  if (matches.length) {
    const baseScales = matches
      .map((match) => {
        const chord = note.chord(match.replace(/\s/g, "").toLowerCase());
        return {
          name_chord: chord.name,
          notes_chord: formatNotes(chord),
        };
      })
      .slice(0, 12);
    chordSearchCache[input] = baseScales;
    return baseScales;
  }

  // If there are no matches, just dump the input into teoria to see if it exists:
  try {
    const chord = note.chord(rest);
    const result = [
      {
        name_chord: chord.name,
        notes_chord: formatNotes(chord),
      },
    ];
    chordSearchCache[input] = result;
    return result;
  } catch {
    // Intentionally empty
  }
}

const scaleSearchCache = {};
function scaleSearch(input) {
  if (scaleSearchCache[input]) {
    return scaleSearchCache[input];
  }
  const [noteName, rest] = getNote(input);
  let note, matches;

  if (noteName) {
    note = teoria.note(noteName + "4");
    matches = search(scales, rest);
  } else {
    // If they didn't include a note name, it might just be a general scale search:
    note = teoria.note("C4");
    matches = search(scales, input);
  }

  if (matches) {
    // First generate all scales based on matches
    const key = formatNote(note);
    const baseScales = matches
      .toReversed()
      .map((match) => {
        const scale = note.scale(match.replace(/\s/g, "").toLowerCase());
        return {
          name_scale: `${key} ${match}`,
          notes_scale: formatNotes(scale),
        };
      })
      .slice(0, 12);
    scaleSearchCache[input] = baseScales;
    return baseScales;
  }
}


const chordQualities = [
  "min",
  "-",
  "M",
  "+",
  "",
  "aug",
  "dim",
  "o",
  "maj",
  "dom",
  "ø",
  "5",
  "major",
  "minor",
  "augmented",
  "diminished",
  "half-diminished",
  "power",
  "dominant",
];

const scales = [
  "Aeolian",
  "Blues",
  "Chromatic",
  "Dorian",
  "Double Harmonic",
  "Harmonic Minor",
  "Ionian",
  "Locrian",
  "Lydian",
  "Major Pentatonic",
  "Melodic Minor",
  "Minor Pentatonic",
  "Mixolydian",
  "Phrygian",
  "Whole Tone",
  "Major",
  "Minor",
];
