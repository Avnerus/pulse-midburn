class Player {
  
  int _IBI;
  int _index;  
  int _role;
  int _lastBPM;
  int _steadyBPMCount;
  int _freq;
  int[] _scale;
  
  int _alternator;
  int _changeBuffer;
  int _progressor;
  
  
  Player(int index, int role) {
    _index = index;
    _role = role;    
    _lastBPM = 0;
    _steadyBPMCount = 0;
    
    _freq = 60;
    
    _alternator = 0;
    _progressor = 0;
    _changeBuffer = 0;
    
  }
  
  void beat(int bpm) {
     //println("Player" + _index + " beats at " + bpm);
     updateServer(_index, bpm);
     
     int change = 0;
     
     if (bpm == _lastBPM) {
       _steadyBPMCount++;
     } else {
       // A change in BPM!
       if (_steadyBPMCount >= 1) {
         // A meaningfull change
          change = bpm - _lastBPM;         
       } 
       _steadyBPMCount = 0;
       _lastBPM = bpm;     
     }
     this.play(change);
     
     _alternator++;
     
     
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
      if (_alternator % 2 != 0) {     
          sendChordWithLength("synth" + str(_index + 1),chord2, _IBI);        
      }
    }    
    else if (_role == AMBIENT_ROLE) {
      sendPrg("beatfreq2", _lastBPM);
      sendPrg("synthfreq2", _lastBPM - 10);      
      int[] chord = {38};
      if (_alternator %2 == 0) {
          int[] chord2 = new int[AMBIENT_CHORD.length];
          for (int i = 0; i < AMBIENT_CHORD.length -1; i++) {          
              int note = CURRENT_SCALE[AMBIENT_CHORD[i]] + AMBIENT_OCTAVE;
              chord2[i] = note;        
          }     
          int lastNote;
          _changeBuffer += change;
          if (_changeBuffer == 0 ) {
            lastNote = CURRENT_SCALE[AMBIENT_CHORD[AMBIENT_CHORD.length - 1]] + AMBIENT_OCTAVE;
          }  else if (_changeBuffer > 0) {
            lastNote = CURRENT_SCALE[AMBIENT_RISE[int(random(0, AMBIENT_RISE.length))]] + AMBIENT_OCTAVE;
          } else {
            lastNote = CURRENT_SCALE[AMBIENT_FALL[int(random(0, AMBIENT_FALL.length))]] + AMBIENT_OCTAVE;
          }
          chord2[AMBIENT_CHORD.length -1] = lastNote;    
                       
          sendChordWithLength("synth" + str(_index + 1), chord2, _IBI);
          _changeBuffer = 0;
      } else {
        _changeBuffer += change;        
        sendChordWithLength("beat" + str(_index + 1), chord, _IBI);
      }       
     
    }
    else if (_role == LEAD_ROLE) {      
      // Freq change      
      sendPrg("synthfreq3", _lastBPM - 10);
        
                   
      /*int[] chord = new int[LEAD_PROG.length];

    
      for (int i = 0; i < LEAD_PROG.length; i++) {
        int note = scale[LEAD_PROG[i]] + LEAD_OCTAVE;
        chord[i] = note;        
      }     */
     
      int[] chord = new int[1];
      int note = CURRENT_SCALE[_alternator % CURRENT_SCALE.length] + LEAD_OCTAVE;
      note += (8 * change);
      chord[0] = note;
        sendChordWithLength("synth" + str(_index + 1),chord, _IBI);
    }
    else if (_role == VOICE_ROLE) {
      sendPrg("synthfreq4", _lastBPM);
      sendPrg("synthfreq4-1", _lastBPM - 10);
      if (_alternator % 2 == 0) {
          _changeBuffer += change;        
          int[] chord = {42};          
          sendChordWithLength("beat" + str(_index + 1), chord, _IBI);
      } else {
          /*int[] chord2 = new int[VOICE_CHORD.length];
          for (int i = 0; i < VOICE_CHORD.length; i++) {
              int note = CURRENT_SCALE[VOICE_CHORD[i]] + VOICE_OCTAVE;
              chord2[i] = note;        
          } */         
          
          _changeBuffer += change;
          
          int[] chord2 = new int[1];
          int note = CURRENT_SCALE[VOICE_PROG[_progressor % VOICE_PROG.length]] + VOICE_OCTAVE;
          note += (8 * _changeBuffer);          
          chord2[0] = note;
          _changeBuffer = 0;
          sendChordWithLength("synth" + str(_index + 1),chord2, _IBI);   
          _progressor++;
    
      }  
     
    }
           
 
  }
  
  void setIBI(int ibi) {
 //    println("Player" + _index + " sets IBI to " + ibi);
    _IBI = ibi;
  }
}
