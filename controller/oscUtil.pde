
OscP5 oscP5;
NetAddress myRemoteLocation;

void sendChordWithLength(String message, int[] notes, int chordLength) {
  int velocity = 127;
  int on = 1;
  int off = 0;

  OscMessage paramsMsg = new OscMessage("/params");
  OscMessage noteMsg = new OscMessage("/" + message);

  OscBundle startBundle = new OscBundle();
  OscBundle stopBundle = new OscBundle();

  // Start
  for (int i = 0; i < notes.length; i++) {
    paramsMsg.clear();
    paramsMsg.setAddrPattern("/params" + i);
    paramsMsg.add(notes[i]);
    paramsMsg.add(velocity);
    paramsMsg.add(i);
    startBundle.add(paramsMsg);
    stopBundle.add(paramsMsg);   

    noteMsg.clear();    
    noteMsg.setAddrPattern("/" + message + "-" + i);
    noteMsg.add(on);
    startBundle.add(noteMsg);

    noteMsg.clear();
    noteMsg.setAddrPattern("/" + message + "-" + i);
    noteMsg.add(off);    
    stopBundle.add(noteMsg);
  }
  stopBundle.setTimetag(stopBundle.now() + chordLength);
  oscP5.send(startBundle, myRemoteLocation);
  oscP5.send(stopBundle, myRemoteLocation);
}

void sendNote(String message, int note) {
  int velocity = 80;
  int on = 1;
  int off = 0;

  OscMessage paramsMsg = new OscMessage("/params");
  OscMessage noteMsg = new OscMessage("/" + message);

  OscBundle startBundle = new OscBundle();

  // Start
  
  paramsMsg.clear();
  paramsMsg.setAddrPattern("/params" + 0);
  paramsMsg.add(note);
  paramsMsg.add(velocity);
  startBundle.add(paramsMsg);
     

  noteMsg.clear();    
  noteMsg.setAddrPattern("/" + message + "-" + 0);
  startBundle.add(noteMsg);
  
  oscP5.send(startBundle, myRemoteLocation);  
}


void sendPrg(String message, int value) {
  OscMessage prgMsg = new OscMessage(message); 
  prgMsg.add(value);    
  oscP5.send(prgMsg, myRemoteLocation);
}

