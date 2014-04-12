class Player {
  
  int _IBI;
  int _index;
  boolean _isBass;
  
  
  Player(int index) {
    _index = index;
  }
  
  void beat() {
     println("Player" + _index + " beats");
     int[] chord = {36};
//     int[] chord2 = {50,57,62};
    int[] chord2 = {random(48, 61)};
     sendChordWithLength("beat1", chord, _IBI);
     sendChordWithLength("synth1",chord2, _IBI);
  }
  
  void setIBI(int ibi) {
     println("Player" + _index + " sets IBI to " + ibi);
    _IBI = ibi;
  }
}
