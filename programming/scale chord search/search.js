// Track search time.
var scales;
var chords;

$.ajax({
  async: false,
  url: "./data/scales.json",
  success: (data) => (scales = data),
});
$.ajax({
  async: false,
  url: "./data/chords.json",
  success: (data) => (chords = data),
});

const data = { ...chords, ...scales };

function collapseObject(obj) {
  var res = "";
  for (const key of Object.keys(obj)) {
    var val = obj[key];
    // This is a *bad* way of doing this, but it works. 
    if (
      key == "notes_chord" ||
      key == "notes_scale" ||
      key == "notes_chord_noOctave" ||
      key == "extensions"
    ) {
      continue;
    }
    if (typeof val === "string" || val instanceof String) {
      res = res + " " + val;
    }
    if (Array.isArray(val)) {
      for (v of val) {
        res = res + " " + v;
      }
    }
  }
  return res.toLowerCase().replace(/ /g, "");
}

function searchEngine(searchString, searchData) {
  var result = [];
  searchString = searchString.replace(/ /g, "");
  $.each(searchData, (item) => {
    var val = collapseObject(searchData[item]);
    if (val.includes(searchString)) {
      result.push(searchData[item]);
      if (result.length > 10) return false;
    }
  });
  return result;
}

$("#searchText, #searchField").on("change paste keyup", () => {
  var searchText = $("#searchText").val().toLowerCase();
  var searchField = $("#searchField").val();
  var searchResult;
  if (searchField == "scales") {
    var scaleSource = $("#scaleTemplate");
    var scalesTemplate = Handlebars.compile(scaleSource.html());
    searchResult = searchEngine(searchText, scales);
    $("#output").html(scalesTemplate(searchResult));
  } else {
    var chordSource = $("#chordTemplate");
    var chordTemplate = Handlebars.compile(chordSource.html());
    searchResult = searchEngine(searchText, chords);
    $("#output").html(chordTemplate(searchResult));
  }
});
