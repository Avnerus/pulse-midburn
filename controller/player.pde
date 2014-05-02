class Player {
  
  int _IBI;
  int _index;  
  int _role;
  int _lastBPM;
  int _steadyBPMCount;
  int _freq;
  
  
  Player(int index, int role) {
    _index = index;
    _role = role;    
    _lastBPM = 0;
    _steadyBPMCount = 0;
    
    _freq = 60;
    
  }
  
  void beat(int bpm) {
     println("Player" + _index + " beats at " + bpm);
     
     int change = 0;
     
     if (bpm == _lastBPM) {
       _steadyBPMCount++;
     } else {
       // A change in BPM!
       if (_steadyBPMCount >= 2) {
         // A meaningfull change
          change = bpm - _lastBPM;         
       } 
       _steadyBPMCount = 0;
       _lastBPM = bpm;     
     }
     this.play(change);
  }
  
    
  void changeDown() {
       int newScale = int(random(SCALES.length));
       println("Bass change - chaning scale");
       CURRENT_SCALE = SCALES[newScale];
  }
  
  void play(int change) {
     //int[] chord2 = {int(random(48, 61))};
    if (_role == BASS_ROLE) {
      if (change != 0) {
          int newScale = int(random(SCALES.length));
          println("Bass change - changing master scale");
          CURRENT_SCALE = SCALES[newScale];
      }
          
      int[] chord = {36};
      int[] chord2 = {CURRENT_SCALE[0] + BASS_OCTAVE};
      sendChordWithLength("beat" + str(_index + 1), chord, _IBI);
      sendChordWithLength("synth" + str(_index + 1),chord2, _IBI);
    }    
    else if (_role == AMBIENT_ROLE) {
      int[] chord = {38};
      int[] chord2 = new int[AMBIENT_CHORD.length];
      for (int i = 0; i < AMBIENT_CHORD.length; i++) {
          int note = CURRENT_SCALE[AMBIENT_CHORD[i]] + AMBIENT_OCTAVE;
          chord2[i] = note;        
      }     
      sendChordWithLength("beat" + str(_index + 1), chord, _IBI);     
      
      sendChordWithLength("synth" + str(_index + 1), chord2, _IBI);
    }
    else if (_role == LEAD_ROLE) {      
      // Freq change      
      sendPrg("freq3", change * 5);
      
      
      
      // Choose a scale
      int[] scale = SCALES[int(random(0, SCALES.length))];
      int[] chord = new int[LEAD_PROG.length];

    
      for (int i = 0; i < AMBIENT_CHORD.length; i++) {
        int note = scale[LEAD_PROG[i]] + LEAD_OCTAVE;
        chord[i] = note;        
      }      
      sendChordWithLength("synth" + str(_index + 1),chord, _IBI);
    }     
    else if (_role == VOICE_ROLE) {
      int[] chord2 = new int[VOICE_CHORD.length];
      for (int i = 0; i < VOICE_CHORD.length; i++) {
          int note = CURRENT_SCALE[VOICE_CHORD[i]] + VOICE_OCTAVE;
          chord2[i] = note;        
      }      
      int[] chord = {37};      
      sendChordWithLength("beat" + str(_index + 1), chord, _IBI);
      sendChordWithLength("synth" + str(_index + 1),chord2, _IBI);
    }
  }
  
  void setIBI(int ibi) {
 //    println("Player" + _index + " sets IBI to " + ibi);
    _IBI = ibi;
  }
}
