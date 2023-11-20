function search(array, searchTerm) {
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedSearchTerm, 'i');

  return array.filter(item => regex.test(item));
}

function getNote(input) {
  if (typeof input !== 'string' || input.length < 1) return ''

  // No double flats or double charts b/c I do not believe in them.
  const match = input.match(/^([a-g](#|b)?)(.*)/i);

  if (match && match.length >= 3) {
    const rest = input.slice(match[1].length);
    return [match[1], rest.trim()];
  } else {
    return ['', ''];
  }
}

// note: teoria.Note
function formatNote(note) {
  const noteName = note.toString(true).toUpperCase();
  if (noteName.length > 1) {
    return `${noteName[0]}${noteName[1].toLowerCase()}`
  }
  return noteName;
}

// Return space separated string containing pretty printed notes for display on page
// chordOrScale: teoria.Chord | teoria.Scale
function formatNotes(chordOrScale) {
  const notes = chordOrScale.simple().map(formatNote);
  return notes.join(' ')
}
