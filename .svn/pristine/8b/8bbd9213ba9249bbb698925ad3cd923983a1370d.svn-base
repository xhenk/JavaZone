import lejos.nxt.Button;
import lejos.nxt.LCD;
import lejos.nxt.Motor;
import lejos.nxt.SensorPort;
import lejos.nxt.SensorPortListener;
import lejos.nxt.TouchSensor;
import lejos.nxt.UltrasonicSensor;

public class Lego {
	public static void main(String[] args) {

		final long timestamp = System.currentTimeMillis();
		final TouchSensor touch = new TouchSensor(SensorPort.S2);
		final UltrasonicSensor uson = new UltrasonicSensor(SensorPort.S1);
		new Thread() {

			public void run() {
				for (;;) {
					if (uson.getDistance() <= 10)
						launch();
					try {
						sleep(100L);
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}

		}.start();
		SensorPort.S2.addSensorPortListener(new SensorPortListener() {

			@Override
			public void stateChanged(SensorPort aSource, int aOldValue, int aNewValue) {
				if (touch.isPressed())
					launch();
			}
		});

		Button.waitForAnyPress();

	}

	public static void launch() {

		Motor.A.rotate(1000);
		Motor.B.rotateTo(120);
		Motor.A.rotate(-1000);
		Motor.B.rotate(100);
		Motor.B.rotateTo(0);
	}
}