import lejos.nxt.Button;
import lejos.nxt.Motor;
import lejos.nxt.SensorPort;
import lejos.nxt.SensorPortListener;
import lejos.nxt.TouchSensor;
import lejos.nxt.UltrasonicSensor;

/**
 * Den eneste klassen i LeJOS-programmet
 * 
 * @author xhenk
 */
public class Lego {

	/**
	 * LeJOS-programmet tar ingen argumenter i main.
	 * 
	 * @param args
	 *            Ingen ting.
	 */
	public static void main(String[] args) {

		/**
		 * En variabel som knytter <code>uson</code> til avstandssensoren som er
		 * koblet til kontakt 1 i NXT-maskinen
		 */
		final UltrasonicSensor uson = new UltrasonicSensor(SensorPort.S1);

		/**
		 * En variabel som knytter <code>touch</code> til knappen /
		 * "touch-sensoren" som er koblet til kontakt 2 i NXT-maskinen
		 */
		final TouchSensor touch = new TouchSensor(SensorPort.S2);

		/**
		 * Her lytter vi i S2-kontakten på roboten etter endringer i status. Det
		 * vil si at denne fyrer når knappen blir trykket inn. Når dette skjer
		 * starter vi kastefunksjonen launch()
		 * 
		 * @see launch
		 */
		SensorPort.S2.addSensorPortListener(new SensorPortListener() {

			/** Fyres når knappen trykkes */
			@Override
			public void stateChanged(SensorPort aSource, int aOldValue, int aNewValue) {
				// Knappen fyrer events starten vi ikke vil ha med, så denne
				// kontrollen unngår dette
				if (touch.isPressed())
					launch();
			}
		});

		/**
		 * En tråd som lytter på trykking på avslutt-knappen (den oransje) eller
		 * tilfeller hvor avstandssensoren leser avstander kortere enn 10 cm
		 */
		new Thread() {

			public void run() {
				try {
					// Button.ENTER.isDown() vil returnere true fra vi startet
					// programmet hvis vi ikke venter litt her.
					sleep(1000L);
				} catch (InterruptedException e) {
				}
				for (;;) {
					if (Button.ENTER.isDown()) {
						// Hvis vi har trykket ned den oransje knappen i dette
						// øyeblikket avsluttes programmet
						System.exit(0);
					} else {
						// Hvis det er noe i veien for avstandssensoren starter
						// vi kastefunksjonen
						if (uson.getDistance() <= 10)
							launch();
						try {
							sleep(100L);
						} catch (InterruptedException e) {
						}
					}
				}
			}

		}.start();
	}

	/**
	 * Kastefunksjonen er veldig enkel. Den forteller til de to motorportene A
	 * og B at de skal kjøre. Dette går sekvensielt.
	 * 
	 * Motor A er i midten av roboten og trekker i tauet. Motor B styrer armen
	 * som holder igjen kastearmen.
	 */
	public static void launch() {

		Motor.A.rotate(-900);	// Tauet trekkes inn
		Motor.B.rotateTo(110);	// Bakre arm holder seg inntil kastearmen
		Motor.A.rotate(900);	// Tauet løsnes 
		Motor.B.rotate(30);	// Bakre arm går enda lenger ned (hvis den klarer / har nok strøm) 
		Motor.B.rotateTo(0);	// Bakre arm går tilbake til utgangspunktet.
	}
}