class Player {
  
  int _IBI;
  int _index;
  
  
  Player(int index) {
    _index = index;
  }
  
  void beat() {
     println("Player" + _index + " beats");
     float[] chord = {0.3,0.4,0.45};
     sendChordWithLength("beat1", chord, _IBI);
     sendChordWithLength("synth1",chord, _IBI);
  }
  
  void setIBI(int ibi) {
     println("Player" + _index + " sets IBI to " + ibi);
    _IBI = ibi;
  }
}
