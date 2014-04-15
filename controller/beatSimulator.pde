class BeatSimulator {  
  int _IBI;
  int _BPM;
  int _index;  
  int _lastBeatTime;
  boolean _running;
  
  BeatSimulator(int index, int ibi, int bpm) {
    _index = index;
    _IBI = ibi;
    _BPM = bpm;
    _running = false;
    _lastBeatTime = 0;
  }
  
  void start() {
    _lastBeatTime = millis();
    _running = true;
  }
  
  void update() {
    if (_running) {
      int currentTime = millis();
      if (currentTime - _lastBeatTime >= _IBI) {
          ibiData(_index, _IBI);
          heartBeat(_index, _BPM);
          _lastBeatTime = currentTime;
      } 
    } 
  }  
}
