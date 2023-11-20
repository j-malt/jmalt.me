
// Essentially this is a wrapper for Teoria
// Tries it's best to determine what the user is looking for, and returns it

function getChordComponents(input) {
  if (typeof input !== 'string' || input.length < 1) return ''
  const match = input.match(/(maj|min|m|-|dim|aug|[b#]?[0-9]+)/gi)
  console.log(match)

  return match
}

const chordQualities = [
  'min', '-', 'M', '+', "",
  'aug', 'dim', 'o',
  'maj', 'dom', 'ø',
  '5', 'major', 'minor', 'augmented',
  'diminished', 'half-diminished',
  'power', 'dominant']


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
    note = teoria.note(noteName + '4')
    matches = search(chordQualities, rest)
  } else {
    // If they didn't include a note name, it might just be a general scale search:
    note = teoria.note('C4')
    matches = search(chordQualities, input)
  }
  if (matches.length) {
    const baseScales = matches.map(match => {
      const chord = note.chord(match.replace(/\s/g, '').toLowerCase())
      return {
        name_chord: chord.name,
        notes_chord: formatNotes(chord)
      }
    }).slice(0, 12)
    chordSearchCache[input] = baseScales;
    return baseScales;
  }

  // If there are no matches, just dump the input into teoria to see if it exists:
  try {
    const chord = note.chord(rest);
    const result = [{
      name_chord: chord.name,
      notes_chord: formatNotes(chord)
    }]
    chordSearchCache[input] = result;
    return result;
  } catch {
    // Intentionally empty
  }
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
  "Minor"
]


const scaleSearchCache = {};
function scaleSearch(input) {
  if (scaleSearchCache[input]) {
    return scaleSearchCache[input];
  }
  const [noteName, rest] = getNote(input);
  let note, matches;

  if (noteName) {
    note = teoria.note(noteName + '4')
    matches = search(scales, rest)
  } else {
    // If they didn't include a note name, it might just be a general scale search:
    note = teoria.note('C4')
    matches = search(scales, input)
  }

  if (matches) {
    // First generate all scales based on matches
    const key = formatNote(note);
    const baseScales = matches.toReversed().map(match => {
      const scale = note.scale(match.replace(/\s/g, '').toLowerCase())
      return {
        name_scale: `${key} ${match}`,
        notes_scale: formatNotes(scale)
      }
    }).slice(0, 12)
    scaleSearchCache[input] = baseScales;
    return baseScales;
  }
}



























$(() => searchTrigger());

$("input[type=radio][name=select]").change(() => {
  var searchField = $("input[name=select]:checked").val();
  if (searchField == "scales") {
    $("#searchText").attr("placeholder", "Search for a scale...");
  } else {
    $("#searchText").attr("placeholder", "Search for a chord...");
  }
  searchTrigger();
});

$("#searchText, #searchField").on("change paste keyup", () => {
  searchTrigger();
});

const scalesTemplate = Handlebars.compile($("#scaleTemplate").html());
const chordTemplate = Handlebars.compile($("#chordTemplate").html());
function searchTrigger() {
  const timeStart = performance.now();
  if ($("#searchText").val() === undefined) {
    return;
  }

  const searchText = $("#searchText").val().toLowerCase();
  const searchField = $("input[name=select]:checked").val();

  if (searchField == "scales") {
    const searchResult = scaleSearch(searchText);
    $("#output").html(scalesTemplate(searchResult));
  } else {
    const searchResult = chordSearch(searchText);
    $("#output").html(chordTemplate(searchResult));
  }
  const timeEnd = performance.now();
  console.log(`Search took ${Math.round(timeEnd - timeStart, 2)}ms`)
}
