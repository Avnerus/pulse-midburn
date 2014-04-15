class Player {
  
  int _IBI;
  int _index;  
  int _role;
  
  Player(int index, int role) {
    _index = index;
    _role = role;
  }
  
  void beat(int bpm) {
     println("Player" + _index + " beats at " + bpm);
        //int[] chord2 = {int(random(48, 61))};
    if (_role == BASS_ROLE) {
      int[] chord = {36};
      int[] chord2 = {CURRENT_SCALE[0] + BASS_OCTAVE};
      sendChordWithLength("beat1", chord, _IBI);
      sendChordWithLength("synth1",chord2, _IBI);
    }    
    else if (_role == AMBIENT_ROLE) {
      int[] chord = {38};
      int[] chord2 = {CURRENT_SCALE[0] + AMBIENT_OCTAVE};
      sendChordWithLength("beat2", chord, _IBI);
      sendChordWithLength("synth2",chord2, _IBI);
    }  
  }
  
  void setIBI(int ibi) {
     println("Player" + _index + " sets IBI to " + ibi);
    _IBI = ibi;
  }
}
