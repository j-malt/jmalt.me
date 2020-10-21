import os
import json



notes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
enharm_1 = ["B#", "C#", "D", "D#", "E", "E#", "F#", "G", "G#", "A", "A#", "B"]
enharm_2 = ["C", "Db", "D", "Eb", "Fb", "F", "Gb", "G", "Ab", "A", "Bb", "Cb"]


base_scale = ["C", "D", "E", "F", "G", "A", "B"]

def getScale(intervals, key):
    """
        Generate heptatonic scale of given key with given interval.
    """
    i = notes.index(key)
    intervals = [2 if x == "W" else 1 for x in intervals.split()]

    init_note = notes[i]
    base_note_idx = base_scale.index(init_note[0])

    #Generates our basic scale without sharps/flats:
    new_scale = base_scale[base_note_idx:] + base_scale[: base_note_idx - 7]
    prev_idx = i
    new_scale[0] = notes[i]
    for n in range(1, len(new_scale)):
            ival = intervals[n-1]
            note_idx = prev_idx + ival

            if(note_idx > 11):
                note_idx -= 12
            new_note = notes[note_idx]
            if(new_note[0] != new_scale[n]):
                #This ensures that the spelling of scales is correct (i.e. each letter is present in the scale)
                eh1 = enharm_1[note_idx]
                eh2 = enharm_2[note_idx]
                if(eh1[0] == new_scale[n]):
                    new_note = eh1
                else:
                    new_note = eh2

            new_scale[n] = new_note
            prev_idx = note_idx
    return new_scale


def generate_scale(intervals):
    """
        Generates heptatonic scales in all keys given string of intervals 
        of the form "W W H W W W H" where W = whole step, H = half step.
    """

    scales = []
    for key in notes:
        scales.append(getScale(intervals, key))
    return scales


""" 
    Heptatonic Scales
    Major Scale: W W H W W W H
    Minor Scale: W H W W H W W
    Modes
        Aeolian: W H W W H W W
        Locrian: H W W H W W W 
        Ionian: W H W W W H W
        Dorian: H W H H H W H
        Phrygian: H W W W H W W 
        Lydian: W W W H W W H
        Mixolydian: W W H W W H W
"""
d = []
def buildScales(name, interval):
    """
        Takes scale type (major, minor, a mode, etc.) and return list of dictionaries of all 12 keys
    """

    scales = generate_scale(interval)
    for scale in scales:
        s = {"key_scale": scale[0], "name_scale": scale[0] + " " + name, "notes_scale": " ".join(scale)}
        d.append(s)
    
buildScales("Major", "W W H W W W H")
buildScales("Minor", "W H W W H W W")
buildScales("Aeolian", "W H W W H W W")
buildScales("Locrian", "H W W H W W W")
buildScales("Ionian", "W H W W W H W")
buildScales("Dorian", "H W H H H W H")
buildScales("Phrygian", "H W W W H W W")
buildScales("Lydian", "W H W W H W W")
buildScales("Mixolydian", "W W H W W H W")
#with open("./data/scales.json", 'a+') as f:
#    json.dump(d, f, indent=4)
