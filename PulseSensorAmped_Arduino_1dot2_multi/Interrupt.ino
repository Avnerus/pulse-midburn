    
typedef struct  {
  volatile int rate[10];                    // array to hold last ten IBI values
  volatile unsigned long sampleCounter = 0;          // used to determine pulse timing
  volatile unsigned long lastBeatTime = 0;           // used to find IBI
  volatile int P =512;                      // used to find peak in pulse wave, seeded
  volatile int T = 512;                     // used to find trough in pulse wave, seeded
  volatile int thresh = 512;                // used to find instant moment of heart beat, seeded
  volatile int amp = 100;                   // used to hold amplitude of pulse waveform, seeded
  volatile boolean firstBeat = true;        // used to seed rate array so we startup with reasonable BPM
  volatile boolean secondBeat = false;      // used to seed rate array so we startup with reasonable BPM
} PulseState;

PulseState sensorsState[NUMBER_OF_SENSORS];


void interruptSetup(){     
  // Initializes Timer2 to throw an interrupt every 2mS.
  TCCR2A = 0x02;     // DISABLE PWM ON DIGITAL PINS 3 AND 11, AND GO INTO CTC MODE
  TCCR2B = 0x06;     // DON'T FORCE COMPARE, 256 PRESCALER 
  OCR2A = 0X7C;      // SET THE TOP OF THE COUNT TO 124 FOR 500Hz SAMPLE RATE
  TIMSK2 = 0x02;     // ENABLE INTERRUPT ON MATCH BETWEEN TIMER2 AND OCR2A
  sei();             // MAKE SURE GLOBAL INTERRUPTS ARE ENABLED      
  
  for (int i = 0; i < NUMBER_OF_SENSORS; i++) {
      sensorsState[i].thresh = 512;                          // set thresh default
      sensorsState[i].P = 512;                               // set P default
      sensorsState[i].T = 512;                               // set T default
      sensorsState[i].lastBeatTime = 0;
      sensorsState[i].sampleCounter = 0;      
      sensorsState[i].amp = 100;      
      sensorsState[i].firstBeat = true;                      // set these to avoid noise
      sensorsState[i].secondBeat = false;                    // when we get the heartbeat back    
  }
} 


// THIS IS THE TIMER 2 INTERRUPT SERVICE ROUTINE. 
// Timer 2 makes sure that we take a reading every 2 miliseconds
ISR(TIMER2_COMPA_vect){                         // triggered when Timer2 counts to 124
  cli();                                      // disable interrupts while we do this
  for (int i = 0; i < NUMBER_OF_SENSORS; i++) {
    sensorsData[i].Signal = analogRead(i);                     // read the Pulse Sensor 
    sensorsState[i].sampleCounter += 2;                         // keep track of the time in mS with this variable
    int N = sensorsState[i].sampleCounter - sensorsState[i].lastBeatTime;       // monitor the time since the last beat to avoid noise
  
      //  find the peak and trough of the pulse wave
    if(sensorsData[i].Signal < sensorsState[i].thresh && N > (sensorsData[i].IBI/5)*3){       // avoid dichrotic noise by waiting 3/5 of last IBI
      if (sensorsData[i].Signal < sensorsState[i].T){                        // T is the trough
        sensorsState[i].T = sensorsData[i].Signal;                         // keep track of lowest point in pulse wave 
      }
    }

    if(sensorsData[i].Signal > sensorsState[i].thresh && sensorsData[i].Signal > sensorsState[i].P){          // thresh condition helps avoid noise
      sensorsState[i].P = sensorsData[i].Signal;                             // P is the peak
    }                                        // keep track of highest point in pulse wave
  
    //  NOW IT'S TIME TO LOOK FOR THE HEART BEAT
    // signal surges up in value every time there is a pulse
    if (N > 250){                                   // avoid high frequency noise
      if ( (sensorsData[i].Signal > sensorsState[i].thresh) && (sensorsData[i].Pulse == false) && (N > (sensorsData[i].IBI/5)*3) ){        
        sensorsData[i].Pulse = true;                 // set the Pulse flag when we think there is a pulse
//        digitalWrite(blinkPin,HIGH);                // turn on pin 13 LED
        sensorsData[i].IBI = sensorsState[i].sampleCounter - sensorsState[i].lastBeatTime;         // measure time between beats in mS
        sensorsState[i].lastBeatTime = sensorsState[i].sampleCounter;               // keep track of time for next pulse
  
        if(sensorsState[i].secondBeat){                        // if this is the second beat, if secondBeat == TRUE
          sensorsState[i].secondBeat = false;                  // clear secondBeat flag
          for(int j=0; j<=9; j++){             // seed the running total to get a realisitic BPM at startup
            sensorsState[i].rate[j] = sensorsData[i].IBI;                      
          }
        }

        if(sensorsState[i].firstBeat){                         // if it's the first time we found a beat, if firstBeat == TRUE
          sensorsState[i].firstBeat = false;                   // clear firstBeat flag
          sensorsState[i].secondBeat = true;                   // set the second beat flag
          continue;                              // IBI value is unreliable so discard it
        }   
  
  
        // keep a running total of the last 10 IBI values
        word runningTotal = 0;                  // clear the runningTotal variable    
  
        for(int j=0; j<=8; j++){                // shift data in the rate array
          sensorsState[i].rate[j] = sensorsState[i].rate[j+1];                  // and drop the oldest IBI value 
          runningTotal += sensorsState[i].rate[j];              // add up the 9 oldest IBI values
        }
  
        sensorsState[i].rate[9] = sensorsData[i].IBI;                          // add the latest IBI to the rate array
        runningTotal += sensorsState[i].rate[9];                // add the latest IBI to runningTotal
        runningTotal /= 10;                     // average the last 10 IBI values 
        sensorsData[i].BPM = 60000/runningTotal;               // how many beats can fit into a minute? that's BPM!
        sensorsData[i].QS = true;                              // set Quantified Self flag 
        // QS FLAG IS NOT CLEARED INSIDE THIS ISR
      }                       
    }
  
    if (sensorsData[i].Signal < sensorsState[i].thresh && sensorsData[i].Pulse == true){   // when the values are going down, the beat is over
      //digitalWrite(blinkPin,LOW);            // turn off pin 13 LED
      sensorsData[i].Pulse = false;                         // reset the Pulse flag so we can do it again
      sensorsState[i].amp = sensorsState[i].P - sensorsState[i].T;                           // get amplitude of the pulse wave
      sensorsState[i].thresh = sensorsState[i].amp/2 + sensorsState[i].T;                    // set thresh at 50% of the amplitude
      sensorsState[i].P = sensorsState[i].thresh;                            // reset these for next time
      sensorsState[i].T = sensorsState[i].thresh;
    }
  
    if (N > 2500){                           // if 2.5 seconds go by without a beat
      sensorsState[i].thresh = 512;                          // set thresh default
      sensorsState[i].P = 512;                               // set P default
      sensorsState[i].T = 512;                               // set T default
      sensorsState[i].lastBeatTime = sensorsState[i].sampleCounter;          // bring the lastBeatTime up to date        
      sensorsState[i].firstBeat = true;                      // set these to avoid noise
      sensorsState[i].secondBeat = false;                    // when we get the heartbeat back
    }
 }
 sei();                                   // enable interrupts when youre done!
}// end isr





