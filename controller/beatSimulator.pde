class BeatSimulator {  
  int _IBI;
  int _BPM;
  int _index;  
  int _lastBeatTime;
  boolean _running;
  int _minusX;
  int _plusX;
  int _buttonSize;
  int _buttonY;
  
  BeatSimulator(int index, int ibi, int bpm) {
    _index = index;
    _IBI = ibi;
    _BPM = bpm;
    _running = false;
    _lastBeatTime = 0;

    _minusX = 10 + _index * 150;
    _plusX = 50 + _index * 150;
    _buttonSize = 20;
    _buttonY = 120;
  }
  
  void start() {
    _lastBeatTime = millis();
    _running = true;
  }
  
  void onMouseReleased() {
    if (mouseX > _minusX && mouseX < (_minusX + _buttonSize) &&
        mouseY > _buttonY && mouseY < (_buttonY + _buttonSize)) {
          _BPM--;
          _IBI = 60000 / _BPM;
     }
     if (mouseX > _plusX && mouseX < (_plusX + _buttonSize) &&
        mouseY > _buttonY && mouseY < (_buttonY + _buttonSize)) {         
          _BPM++;
          _IBI = 60000 / _BPM;          
     }   
  }
  
  void update() {
    textSize(18);
    fill(0, 0, 0);    
    text("BeatSim" + (_index +1), 10 + _index * 150, 70);    
    text(_BPM, 30 + _index * 150 , 100);
    fill(0, 0, 0);    
    rect(_minusX, _buttonY, _buttonSize, _buttonSize);
    rect(_plusX, _buttonY, _buttonSize, _buttonSize);
    fill(255,255,255);
    text("-", _minusX + 5 , _buttonY + 15);    
    text("+", _plusX + 5 , _buttonY + 15);
    

    
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
