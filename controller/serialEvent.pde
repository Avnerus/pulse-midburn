int Sensor;
int BPM;
int IBI;

void serialEvent(Serial port){ 
   String inData = port.readStringUntil('\n');
   if (inData != null && inData.length() > 2) {          
     inData = trim(inData);                 // cut off white space (carriage return)     
     String indexData = inData.substring(0,1);     
     int SensorIndex = int(indexData);
     if (SensorIndex == 1) {
       println(inData);
     }
    if (SensorIndex != 0) return; 
     if (inData.charAt(1) == 'S'){          // leading 'S' for sensor data
       inData = inData.substring(2);        // cut off the leading 'S'
       Sensor = int(inData);                // convert the string to usable int
     } 
     else if (inData.charAt(1) == 'B'){          // leading 'B' for BPM data       
       inData = inData.substring(2);        // cut off the leading 'B'
       BPM = int(inData);                   // convert the string to usable int
       if (BPM <= 150) {         
           heartBeat(SensorIndex, BPM);
       }
       
       
       /*OscMessage myMessage = new OscMessage("/bpm");
       float midiVal = (  int(inData) - 50) / 127.0;  
       println("Sending BPM " + midiVal + " on OSC");       
       myMessage.add(midiVal);    
       oscP5.send(myMessage, myRemoteLocation);*/ 
       
       
     }
     else if (inData.charAt(1) == 'Q'){            // leading 'Q' means IBI data        
       inData = inData.substring(2);        // cut off the leading 'Q'
       IBI = int(inData);                   // convert the string to usable int
       ibiData(SensorIndex, IBI);
     } 
   }
}
