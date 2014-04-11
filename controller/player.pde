class Player {
  
  int _IBI;
  int _index;
  
  
  Player(int index) {
    _index = index;
  }
  
  void beat() {
     println("Player" + _index + " beats");
     float[] chord = {0.3,0.32,0.34};
     float[] chord2 = {0.4,0.5,0.60};
     sendChordWithLength("beat1", chord, _IBI);
     sendChordWithLength("synth1",chord2, _IBI);
  }
  
  void setIBI(int ibi) {
     println("Player" + _index + " sets IBI to " + ibi);
    _IBI = ibi;
  }
}
