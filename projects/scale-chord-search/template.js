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
  console.debug(`Search took ${Math.round(timeEnd - timeStart, 2)}ms`)
}
