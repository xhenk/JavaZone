import lejos.nxt.Button;
import lejos.nxt.ColorSensor;
import lejos.nxt.Motor;
import lejos.nxt.SensorPort;
import lejos.nxt.SensorPortListener;
import lejos.nxt.addon.ColorHTSensor;

public class HelloWorld {
  public static void main (String[] args) {
//	  SensorPort.S2.addSensorPortListener(new SensorPortListener() {
//			
//			@Override
//			public void stateChanged(SensorPort aSource, int aOldValue, int aNewValue) {
//				  Motor.B.rotate(20);
//				
//			}
//		});
    System.out.println("Hei.");
    System.out.println("Nå får du godteri :)");
//trekker opp     
//    Motor.A.forward();
//    try {
//		Thread.sleep(2000L);
//	} catch (InterruptedException e) {
//		e.printStackTrace();
//	}
//    Motor.A.stop();
    Motor.A.rotate(1000);
    Motor.B.rotateTo(120);
    Motor.A.rotate(-1000);
    Motor.B.rotate(100);
    Motor.B.rotateTo(0);
    
   

    // 	Motor.A.waitComplete();
   
//    Motor.B.rotateTo(160);
    
    
//   SensorPort.S1.addSensorPortListener(aListener);
//   if{
//	   ColorHTSensor.BLACK;
//	   System.out.println("svart");
//   }
//   else{
//	   System.out.println("Annen farge");
//   }
//   
   
 //Fører over stoppe-pinne
//    Motor.B.forward();
//    try {
//  		Thread.sleep(1000L);
//  	} catch (InterruptedException e) {
//  		e.printStackTrace();
//  	}
//    Motor.B.stop();

// Løsner hyssingen
//    Motor.A.backward();
//    try {
//  		Thread.sleep(2000L);
//  	} catch (InterruptedException e) {
//  		e.printStackTrace();
//  	}
//    Motor.A.stop();
  
// Tar tilbake stoppe-pinnen
//    Motor.B.backward();
//    try {
//  		Thread.sleep(1000L);
//  	} catch (InterruptedException e) {
//  		e.printStackTrace();
//  	}
//    Motor.B.stop();
  }
  
}
