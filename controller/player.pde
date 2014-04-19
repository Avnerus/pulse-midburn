class Player {
  
  int _IBI;
  int _index;  
  int _role;
  int _lastBPM;
  int _steadyBPMCount;
  
  Player(int index, int role) {
    _index = index;
    _role = role;
    
    _lastBPM = 0;
    _steadyBPMCount = 0;
    
  }
  
  void beat(int bpm) {
     //println("Player" + index + " beats at " + bpm);
     
     if (bpm == _lastBPM) {
       _steadyBPMCount++;
     } else {
       // A change in BPM!
       if (_steadyBPMCount >= 2) {
         // A meaningfull change
         int newScale = int(random(SCALES.length));
         println("Meaningfull change!! from " + _steadyBPMCount + " times of " + _lastBPM + " to " + bpm + ". new scale: " + newScale);
         CURRENT_SCALE = SCALES[newScale];              
       } 
       _steadyBPMCount = 0;
       _lastBPM = bpm;     
     }
     this.play();
  }
  
  void play() {
     //int[] chord2 = {int(random(48, 61))};
    if (_role == BASS_ROLE) {
      int[] chord = {36};
      int[] chord2 = {CURRENT_SCALE[0] + BASS_OCTAVE};
      sendChordWithLength("beat" + str(_index + 1), chord, _IBI);
      sendChordWithLength("synth" + str(_index + 1),chord2, _IBI);
    }    
    else if (_role == AMBIENT_ROLE) {
      int[] chord = {38};
      int[] chord2 = {CURRENT_SCALE[0] + AMBIENT_OCTAVE};
      sendChordWithLength("beat" + str(_index + 1), chord, _IBI);
      sendChordWithLength("synth" + str(_index + 1),chord2, _IBI);
    }
    else if (_role == LEAD_ROLE) {      
      // Freq change
      int freq = int(random(50,65));
      sendPrg("freq3", freq);
      
      // lead note
      int note = CURRENT_SCALE[LEAD_PROG[int(random(0, LEAD_PROG.length))]] + LEAD_OCTAVE;
      int note2 = CURRENT_SCALE[LEAD_PROG[int(random(0, LEAD_PROG.length))]] + LEAD_OCTAVE;                
      int[] chord = {note, note2};     
      sendChordWithLength("synth" + str(_index + 1),chord, _IBI);
    }
  }
  
  void setIBI(int ibi) {
 //    println("Player" + _index + " sets IBI to " + ibi);
    _IBI = ibi;
  }
}
