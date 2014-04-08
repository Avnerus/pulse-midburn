  
OscP5 oscP5;
NetAddress myRemoteLocation;
  
void sendChordWithLength() {
  float note = 0.5;
  float velocity = 1.0;
  float index = 1.0; 
   
  // Start
  
  OscBundle myBundle = new OscBundle();
  
  OscMessage myMessage = new OscMessage("/stroke");
  
  myBundle.add(myMessage);
  myMessage.clear();
  myMessage.setAddrPattern("/params");
  myMessage.add(note);
  myMessage.add(velocity);
  myMessage.add(index);  
  myBundle.add(myMessage);  
  
 // float midiVal = (  int(inData) - 50) / 127.0;  
   //    println("Sending BPM " + midiVal + " on OSC");       
     //  myMessage.add(midiVal); /* add an int to the osc message */              
  //oscP5.send(myMessage, myRemoteLocation);
  oscP5.send(myBundle, myRemoteLocation);
 
 // Stop
 velocity = 0.0;
 myBundle = new OscBundle();
 
  myMessage = new OscMessage("/stroke");
  
  myBundle.add(myMessage);
  myMessage.clear();
  myMessage.setAddrPattern("/params");
  myMessage.add(note);
  myMessage.add(velocity);
  myMessage.add(index);  
  myBundle.add(myMessage); 
 
 
 myBundle.setTimetag(myBundle.now() + 4000); 
 oscP5.send(myBundle, myRemoteLocation);

}
