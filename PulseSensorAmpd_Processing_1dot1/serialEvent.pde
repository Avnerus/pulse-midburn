void serialEvent(Serial port){ 
   String inData = port.readStringUntil('\n');    
   if (inData != null && inData.length() > 2) {     
     inData = trim(inData);                 // cut off white space (carriage return)
     println(inData);
  
     String indexData = inData.substring(0,1);     
     int SensorIndex = int(indexData);
     if (SensorIndex > Sensor.length -1) {
       return;
     }
      
     
    
     if (inData.charAt(1) == 'S'){    
       println(inData.length());   
       // leading 'S' for sensor data
       String newData = inData.substring(2);        // cut off the leading 'S'
       println(newData);
       Sensor[SensorIndex] = int(newData);                // convert the string to usable int
     } 
     else if (inData.charAt(1) == 'B'){          // leading 'B' for BPM data     
       inData = inData.substring(2);        // cut off the leading 'B'
       BPM[SensorIndex] = int(inData);                   // convert the string to usable int
       beat = true;                         // set beat flag to advance heart rate graph
       heart = 20;
     }  
       // begin heart image 'swell' timer   
      

     else if (inData.charAt(1) == 'Q'){            // leading 'Q' means IBI data        
       inData = inData.substring(2);        // cut off the leading 'Q'
       IBI[SensorIndex] = int(inData);                   // convert the string to usable int
     }
   }
}
