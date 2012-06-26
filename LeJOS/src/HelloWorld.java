import lejos.nxt.Button;
import lejos.nxt.Motor;

public class HelloWorld {
  public static void main (String[] args) {
    System.out.println("Hææælo!");
    Motor.A.forward();
    try {
		Thread.sleep(2000L);
	} catch (InterruptedException e) {
		e.printStackTrace();
	}
    Motor.A.stop();
    Button.waitForAnyPress();

  }
}
