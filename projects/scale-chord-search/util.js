function search(array, searchTerm) {
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedSearchTerm, 'i');

  return array.filter(item => regex.test(item));
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
