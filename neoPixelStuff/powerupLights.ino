// Include Libraries
#include <FastLED.h>
#include <Wire.h>
#include <LiquidCrystal.h>

// Define settings
#define NUM_LEDS 120
#define DATA_PIN 6
#define MASTER_BRIGHTNESS 100

// --------- CHANGE THESE SETTINGS ----------
#define SUPPORT_BAR_1_START 0
#define SUPPORT_BAR_LENGTH 30
#define BUMPER_LENGTH 7
#define INTAKE_LENGTH 13
// ---------- END OF SETTINGS TO CHANGE -----------

int BUMPER_START = SUPPORT_BAR_1_START + SUPPORT_BAR_LENGTH + 2; // 32
int SUPPORT_BAR_2_START = BUMPER_START + BUMPER_LENGTH + 1; //40
int INTAKE_START = (2 * SUPPORT_BAR_LENGTH) + BUMPER_LENGTH + 3; // 73

// Declare Objects in Memory
CRGB leds[NUM_LEDS]; // Array of individual lights
uint8_t gHue = 0; // rotating "base color" used by many of the patterns
CRGB blue = CRGB::Blue;
CRGB yellow = CRGB::Yellow;
uint8_t wait = 50;
int pulseLength = 4;
// These can be made global. Security doesn't matter for a simple LED program
int count = 0;

// Setup Function
void setup () {
	delay(2000);

	// Setup Lights
	FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
	FastLED.setBrightness(MASTER_BRIGHTNESS);
}

// Loop Function
void loop () {
  powerupLightsCode();
}

void powerupLightsCode() {
    int pulseCount = abs(count % (pulseLength * 2)); // Modulo based on 8, because 4 on 4 off, moving in a snake

    // Right side support bar
    // Updates all values of the LEDs
    for(int i = SUPPORT_BAR_1_START; i < SUPPORT_BAR_1_START + SUPPORT_BAR_LENGTH; i++) {
        if((i+pulseCount) % (pulseLength * 2) < pulseLength) { // to be honest I messed around with my simulator until I got this right
            leds[i] = blue;
        } else {
            leds[i] = yellow;
        }
    }

    // Left side support bar
    for(int i = SUPPORT_BAR_2_START; i < SUPPORT_BAR_2_START + SUPPORT_BAR_LENGTH; i++) {
        if((i+1-pulseCount) % (pulseLength * 2) < pulseLength) { // notice the beginning and how it's backwards (and adds 1 because of indices)
            leds[i] = blue;
        } else {
            leds[i] = yellow;
        }
    }

    // Bumper
    // sets it all to red
    for(int i = BUMPER_START; i < BUMPER_START + BUMPER_LENGTH; i++) {
        leds[i] = CRGB::Red;
    }

    // Intake
    // Chaser coming outwards from middle -- as requested by Alex
    // This is basically the support bar loops merged together
    for(int i = INTAKE_START; i < INTAKE_START + INTAKE_LENGTH; i++) {
        if(i < INTAKE_START + (INTAKE_LENGTH / 2)) {
            if((i+pulseCount) % (pulseLength * 2) < pulseLength) {
                leds[i] = blue;
            } else {
                leds[i] = yellow;
            }
        } else {
            if((i+1-pulseCount) % (pulseLength * 2) < pulseLength) {
                leds[i] = blue;
            } else {
                leds[i] = yellow;
            }
        }
    }

    count++; // Increment the iteration
    delay(wait);
    
}

// Missing Dot Chase - Move an "empty" dot down the strip
void powerupLightsCodeDepracated () { // depracated means "not in use anymore"
  CRGB defaultColor = CRGB::Blue;
  CRGB chasedColor = CRGB::Yellow;
  //uint8_t wait = 50; // Commented this out because I set wait as a global variable
  uint8_t pulses = 3;
  uint8_t pulseLength = 4;
  int pulseCodeIncrement1;
  int pulseCodeIncrement2;

  fill_solid(&(leds[BUMPER_START]), BUMPER_LENGTH, CRGB::Red);
  //fill_solid(&(leds[INTAKE_START]), INTAKE_LENGTH, defaultColor);
  fill_rainbow(&(leds[INTAKE_START]), INTAKE_LENGTH, gHue, 7);

  fill_solid(&(leds[SUPPORT_BAR_1_START]), SUPPORT_BAR_LENGTH, defaultColor);    // If you are setting the colors individually for default colors, there is really no need to
  fill_solid(&(leds[SUPPORT_BAR_2_START]), SUPPORT_BAR_LENGTH, defaultColor);   // set the fill_solid-- it's actually slightly "slower" in terms of processing
  // Then display one pixel at a time:
  for (int led_number = 0; led_number < SUPPORT_BAR_LENGTH; led_number++) {     // Don't think you always have to nest everything in a single for loop.
    int led_number1 = led_number + SUPPORT_BAR_1_START;                         // Making things easier to code and read is infinitely better than
    int led_number2 = led_number + SUPPORT_BAR_2_START;                         // making things complex and hard to calculate. You can do all this in separate for loops much easier

    for (int pulsei = 0; pulsei < pulses; pulsei++) {                               // No need to make the program O(n^3) here, see my example, it's O(n). 
                                                                                    // If you don't know what O(#) is, look up big O notation, it's a method of
                                                                                    // describing code optimization
      pulseCodeIncrement1 = led_number1 + (SUPPORT_BAR_LENGTH / pulses * pulsei);
      pulseCodeIncrement2 = led_number2 + (SUPPORT_BAR_LENGTH / pulses * pulsei);

      for (int lengthi = 0; lengthi < pulseLength; lengthi++) {
        leds[(pulseCodeIncrement1 + lengthi) % (SUPPORT_BAR_LENGTH + SUPPORT_BAR_1_START)] = chasedColor; 
        leds[(pulseCodeIncrement2 + lengthi) % (SUPPORT_BAR_LENGTH + SUPPORT_BAR_2_START)] = chasedColor; 
      }

      if (pulseCodeIncrement1 > 0) {
        // Set previous pixel 'on'
        if (pulseCodeIncrement1 == (SUPPORT_BAR_LENGTH + SUPPORT_BAR_1_START)) {
          leds[(SUPPORT_BAR_LENGTH + SUPPORT_BAR_1_START) - 1] = defaultColor;
        } else {
          leds[(pulseCodeIncrement1 % (SUPPORT_BAR_LENGTH + SUPPORT_BAR_1_START)) - 1] = defaultColor;
        }
      }
      if (pulseCodeIncrement2 > 0) {
        // Set previous pixel 'on'
        if (pulseCodeIncrement2 == (SUPPORT_BAR_LENGTH + SUPPORT_BAR_2_START)) {
          leds[(SUPPORT_BAR_LENGTH + SUPPORT_BAR_2_START) - 1] = defaultColor;
        } else {
          leds[(pulseCodeIncrement2 % (SUPPORT_BAR_LENGTH + SUPPORT_BAR_2_START)) - 1] = defaultColor;
        }
      }
    }

    FastLED.show();
    delay(wait);
  }
  return; // You don't need a return here, this is a void function.
}
