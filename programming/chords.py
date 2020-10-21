
import json


"""
    This file is used to *generate* JSON files that contain a list of chords
    Its pretty messy, but it works quite well. In the future I'd just like to add 
    more chord type/extensions. Running it will generate a "chords.json" file in 
    './data'.
"""

"""
    For any given key, we are going to generate about 35 different chords (Think C, C6, C13, C11, C7#13, ...)

    I'll be using integer notation for each chord, it's easier.
    https://en.wikipedia.org/wiki/Pitch_class#Integer_notation
    My canonical list of chords will be: https://en.wikipedia.org/wiki/List_of_chords
    There's probably errors in my transcriptions but it's an easy fix. 
    Here are tons of chords + extensions and their respective integer notations:
"""
chord_list = {
    "+": [0, 4, 8],
    "+,11": [0, 4, 7, 10, 2, 6],
    "+,maj,7": [0, 4, 8, 11],
    "+,7": [0, 4, 8, 10],
    " dim": [0, 3, 6],
    " dim, Maj,7": [0, 3, 6, 11],
    " dim,7": [0, 3, 6, 9],
    "11": [0, 4, 7, 10, 2, 5],
    "7, b9": [0, 4, 7, 10, 1],
    "9": [0, 4, 7, 10, 2],
    "7": [0, 4, 7, 10],
    "7,b5": [0, 4, 6, 10],
    "7,#9": [0, 4, 7, 10, 3],
    "13": [0, 4, 7, 10, 2, 5, 9],
    " halfdim,7": [0, 3, 6, 10],
    " maj,7,#11": [0, 4, 7, 10, 6],
    " maj": [0, 4, 7],
    " maj,11": [0, 4, 7, 10, 2, 5],
    " maj,7": [0, 4, 7, 10],
    " maj,6": [0, 4, 7, 9],
    " maj,6/9": [0, 4, 7, 9, 2],
    " maj,9": [0, 4, 8, 10, 2],
    " maj,13": [0, 4, 7, 10, 2, 6, 9],
    " min": [0, 3, 7],
    " min,11": [0, 3, 7, 10, 2, 5],
    " maj, min 7": [0, 3, 7, 10],
    " min,9": [0, 3, 7, 10, 2],
    " min,7": [0, 3, 7, 10],
    " min,6": [0, 3, 7, 9],
    " min,6/9": [0, 3, 7, 9, 2],
    " min,13": [0, 3, 7, 10, 2, 5, 9],
    "7,sus4": [0, 5, 7, 10],
    "sus4": [0, 5, 7],
    "sus2": [0, 2, 7],
    "13,b9": [0, 4, 7, 10, 1, 9],
    "13,b9,b5": [0, 4, 6, 10, 1, 9]
}
notes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

def translateExtension(name):
    # Stupid method to make extensions more searchable. 

    name = name.replace("maj", "Major")
    name = name.replace("min", "Minor")
    name = name.replace("halfdim", " Half Diminished")
    name = name.replace("dim", "Diminished")
    name = name.replace("dom", "Dominant")
    return name
 

def createChord(int_not, key):
    oct = 5
    key = notes.index(key)
    prev = int_not[0]
    chord = []
    chordNoOctave = []
    for deg in int_not:
        note_idx = deg + key
        if(note_idx > 11):
            note_idx -= 12
        note = notes[note_idx]
        if(prev > deg):
            oct += 1
        prev = deg
        chord.append(note + str(oct))
        chordNoOctave.append(note)
    return (chord, chordNoOctave)

def buildChords(chords):
    """
        Build JSON data of all chords in all keys with their extensions, such as:
        {
            "key": "C"
            "extensions": ["maj", "7"]
            "notes": ["C5", "E5", "G5", "Bb5"]
            ...
        }
    """
    l = []
    for note in notes:
        for key in chords:
            d = {}
            chordNotes = createChord(chords[key], note)
            extensions = key.split(',')
            d["key_chord"] = note
            d["extensions"] = extensions
            d["readable_extensions"] = [translateExtension(ext) for ext in extensions]
            d["notes_chord"] = chordNotes[0]
            d["notes_chord_noOctave"] = chordNotes[1]
            l.append(d)
    return l

with open('./data/chords.json', 'a+') as f:
    json.dump(buildChords(chord_list), f, indent=4)
