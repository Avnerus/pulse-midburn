/*
THIS PROGRAM WORKS WITH PulseSensorAmped_Arduino-xx ARDUINO CODE
THE PULSE DATA WINDOW IS SCALEABLE WITH SCROLLBAR AT BOTTOM OF SCREEN
PRESS 'S' OR 's' KEY TO SAVE A PICTURE OF THE SCREEN IN SKETCH FOLDER (.jpg)
MADE BY JOEL MURPHY AUGUST, 2012
*/


import processing.serial.*;
import oscP5.*;
import netP5.*;

int NUMBER_OF_PLAYERS = 1;
Player[] players;



Serial port;     

void setup() {
  size(100, 100);  // Stage size
  frameRate(100);

  oscP5 = new OscP5(this,12000);
  myRemoteLocation = new NetAddress("192.168.111.21",8000);
  
  players = new Player[NUMBER_OF_PLAYERS];
  for (int i = 0; i < NUMBER_OF_PLAYERS; i++) {
    Player player = new Player(i);
    players[i] = player;
  }
  
   
// GO FIND THE ARDUINO
  println(Serial.list());    // print a list of available serial ports
  // choose the number between the [] that is connected to the Arduino
  port = new Serial(this, Serial.list()[0], 115200);  // make sure Arduino is talking serial at this baud rate
  port.clear();            // flush buffer
  port.bufferUntil('\n');  // set buffer full flag on receipt of carriage return  
}

void draw() {
  
}
  

void heartBeat(int index, int bpm) {
  players[index].beat();  
}

void ibiData(int index, int IBI) {
  players[index].setIBI(IBI);
}



