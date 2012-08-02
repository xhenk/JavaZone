import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Scanner;
import java.util.Stack;
import java.util.concurrent.Executors;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.TransformerFactoryConfigurationError;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import sun.misc.BASE64Decoder;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class Server {

	public static final String LOCAL_SERVER_PATH = "C:\\Program Files (x86)\\Apache Software Foundation\\Apache2.2\\htdocs\\";
	public static final File LOCAL_SERVER_FILE = new File(LOCAL_SERVER_PATH);

	private Logger logger;

	public Server() {

		logger = new Logger();
		InetSocketAddress addr = new InetSocketAddress(80);
		HttpServer server = null;
		try {
			server = HttpServer.create(addr, 0);
		} catch (IOException e) {
			logger.log(Logger.LogEvent.ERROR, "Kan ikke lage ny server");
		}

		server.createContext("/", new HTTP());
		server.setExecutor(Executors.newCachedThreadPool());
		server.start();
	}

	public static void main(String[] args) throws IOException {
		new Server();
	}

	class HTTP implements HttpHandler {
		private final FileAndBytes ERROR_404 = new FileAndBytes(null, "404, Filen finnes ikke!".getBytes());

		public void handle(HttpExchange exchange) throws IOException {
			String requestMethod = exchange.getRequestMethod();
			String path = exchange.getRequestURI().getPath();
			logger.log(Logger.LogEvent.INFO, requestMethod + " " + exchange.getRequestURI().getPath());
			if (requestMethod.equalsIgnoreCase("GET")) {
				getWebPage(exchange);
			}
		}

		private void getWebPage(HttpExchange exchange) {

			String path = exchange.getRequestURI().getPath();
			if (path.equals("/")) {
				path = "index.html";
			}
			// TODO LOG GET + path);

			FileAndBytes fb = getFileContents(path);
			byte[] fileContents = fb.bytes;
			File theFile = fb.file;
			String ctype = getType(theFile);
			if (ctype.equals("custom/quiz")) {
				// Spesialtilfelle: Skal levere sanert quizfil.
				fileContents = SteriaQuiz.createPublicQuizFile();
				logger.log(Logger.LogEvent.INFO, "Henter sanert quizfil");
			}
			if (ctype.equals("custom/php")) {
				// Spesialtilfelle: Skal ta imot parametre fra adressen som php
				// ville gjort.

				fileContents = SteriaQuiz.validateParams(exchange.getRequestURI().getQuery()).getBytes();
				ctype = "text/plain";
				logger.log(Logger.LogEvent.INFO, "Registrerer svar:\t" + SteriaQuiz.lastRegistered);
			}
			exchange.getResponseHeaders().set("Content-Type", ctype);

			try {
				exchange.sendResponseHeaders(HttpURLConnection.HTTP_OK, fileContents.length);
				exchange.getResponseBody().write(fileContents);
				exchange.getResponseBody().close();
			} catch (IOException e) {
				logger.log(Logger.LogEvent.ERROR, "Kunne ikke skrive filinnhold til socket!");
				return;
			}
		}

		private String getType(File theFile) {
			if (theFile == null)
				return "text/plain";
			String n = theFile.getName();
			String ext = n.substring(n.lastIndexOf(".") + 1);
			if (ext.equals("ico")) {
				return "image/x-icon";
			} else if (ext.equals("html")) {
				return "text/html";
			} else if (ext.equals("png")) {
				return "image/png";
			} else if (ext.equals("xml")) {
				return "text/xml";
			} else if (ext.equals("pdf")) {
				return "application/pdf";
			} else if (ext.equals("quiz")) {
				return "custom/quiz";
			} else if (ext.equals("css")) {
				return "text/css";
			} else if (ext.equals("js")) {
				return "text/javascript";
			} else if (ext.startsWith("php")) {
				return "custom/php";
			}

			return "text/plain";
		}

		private FileAndBytes getFileContents(String path) {

			path = path.replace('/', '\\');

			File theFile = new File(Server.LOCAL_SERVER_PATH + path);
			if (!Server.LOCAL_SERVER_FILE.isDirectory()) {
				String err = "Adressen " + path + " er ikke en mappe!";
				logger.log(Logger.LogEvent.ERROR, err);
				throw new IllegalArgumentException(err);
			}

			if (theFile == null) {
				logger.log(Logger.LogEvent.ERROR, "404 finner ikke " + path);
				return ERROR_404;
			}

			if (theFile.length() > Integer.MAX_VALUE) {
				String err = "Filen er for stor!";
				logger.log(Logger.LogEvent.ERROR, err);
				throw new IllegalArgumentException(err);
			}

			byte[] retb = new byte[(int) theFile.length()];
			FileInputStream rd = null;
			try {
				rd = new FileInputStream(theFile);
				rd.read(retb);
				rd.close();
			} catch (IOException e) {
				e.printStackTrace();
				logger.log(Logger.LogEvent.ERROR, "Kunne ikke hente fil: " + theFile.getAbsolutePath());
			}
			return new FileAndBytes(theFile, retb);
		}

		/**
		 * 
		 * @param root
		 * @return
		 */
		private Stack<File> listAllFiles(File root) {
			Stack<File> retval = new Stack<File>();
			for (File f : root.listFiles()) {
				if (f.getName().charAt(0) != '.') {
					if (f.isDirectory()) {
						retval.addAll(listAllFiles(f));
					} else {
						retval.add(f);
					}
				}
			}
			return retval;

		}

		class FileAndBytes {

			File file;
			byte[] bytes;

			FileAndBytes(File f, byte[] b) {
				file = f;
				bytes = b;
			}
		}

	}
}

class SteriaQuiz {

	private static String PUBLIC_SCOREBOARD = "scoreboard.xml";
	private static String PRIVATE_SCOREBOARD = "scoreboard-private.xml";
	private static String QUIZ_PATH = "Quiz\\JavaZone2012.quiz";

	// Navnet til sist registrerte bruker
	static String lastRegistered = "";

	public static String validateParams(String params) {

		String p = params;
		params = params.substring(params.lastIndexOf('?') + 1);
		BASE64Decoder x = new BASE64Decoder();
		try {
			params = new String(x.decodeBuffer(params));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		String[] paramarr = params.split("&");
		String _tmp[];
		String name = null, email = null, phone = null, answers = null, time = null, points = null;
		for (String st : paramarr) {
			_tmp = st.split("=");
			if (_tmp[0].equals("name")) {
				name = _tmp[1];
			} else if (_tmp[0].equals("email")) {
				email = _tmp[1];
			} else if (_tmp[0].equals("phone")) {
				phone = _tmp[1];
			} else if (_tmp[0].equals("answers")) {
				answers = _tmp[1];
			}
		}
		Calendar c = Calendar.getInstance();
		DateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
		time = dateFormat.format(c.getTime());
		if (checkIfAlreadyAContestant(email, phone))
			return "Obs: En luring (kanskje deg?) med samme telefonnummer eller epost har allerede konkurrert!";
		points = getPointsByAnswers(answers.split(";")) + "";
		storeUser(true, time, name, email, phone, answers, points);
		storeUser(false, time, name, email, phone, answers, points);

		return "Gratulerer, " + name + " du fikk " + points + " poeng!";
	}

	/**
	 * Her plukkes de rette svarene bort fra quizfila som sendes klienten. Dette
	 * er en stygg måte å gjøre det på. Kunne delt opp i to quizfiler eller
	 * lagret korrekte et annet sted...
	 * 
	 * @return Quizfila uten svar.
	 */
	public static byte[] createPublicQuizFile() {

		byte[] retval = null;
		Scanner scan = null;
		try {
			scan = new Scanner(new File(Server.LOCAL_SERVER_PATH + QUIZ_PATH));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String ret = "";
		String l = "";
		while (scan.hasNext()) {
			l = scan.nextLine();
			if (!isCorrect(l)) {
				ret += l + '\n';
			}
		}
		return ret.getBytes();
	}

	private static boolean isCorrect(String l) {
		if (l.contains("correct"))
			return true;
		char[] chrs = l.toCharArray();
		String _tmp = "";
		for (int i = 0; i < chrs.length; i += 2) {
			_tmp += chrs[i];
		}
		if (_tmp.contains("correct"))
			return true;
		_tmp = "";
		for (int i = 1; i < chrs.length; i += 2) {
			_tmp += chrs[i];
		}
		if (_tmp.contains("correct"))
			return true;

		return false;
	}

	/**
	 * Kontrollerer om en bruker er registrert fra før av.
	 * 
	 * @param email
	 *            Epostadressen man (ikke) vil finne.
	 * @param phone
	 *            Telefonnummeret man (ikke) vil finne.
	 * @return false hvis brukeren ikke finnes i scoreboardet.
	 */
	private static boolean checkIfAlreadyAContestant(String email, String phone) {

		// Dropper hele XML-greia her.
		// Enklere å bare scanne linjer - gjør det samme
		Scanner scan = null;
		try {
			scan = new Scanner(new File(Server.LOCAL_SERVER_PATH + PRIVATE_SCOREBOARD));
			String line = "";
			while (scan.hasNext()) {
				line = scan.nextLine();
				if (line.contains(email) || line.contains(phone)) {
					return true;
				}
			}
			scan.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}

		return false;
	}

	/**
	 * Finner &lt;correct&gt;-taggene i quizfila og sjekker innkommende answers
	 * mot disse
	 * 
	 * @param answers
	 *            Svarene i en array
	 * @return
	 */
	private static int getPointsByAnswers(String[] answers) {

		int points = 0;
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = null;
		Document doc = null;
		try {
			db = dbf.newDocumentBuilder();
			doc = db.parse(Server.LOCAL_SERVER_PATH + QUIZ_PATH);
		} catch (ParserConfigurationException | SAXException | IOException e) {
			e.printStackTrace();
		}

		// Henter alle spørsmål fra <quiz>-elementet (første child).
		NodeList allQuestions = doc.getChildNodes().item(0).getChildNodes();

		int ansCnt = 0;
		for (int i = 0; i < allQuestions.getLength(); i++) {

			if (!allQuestions.item(i).getNodeName().equals("question")) {
				continue;
			}
			NodeList innerNodes = allQuestions.item(i).getChildNodes();

			// Brukes der det er lov å ha opp til 3 feil i forhold til korrekt
			// svar. poeng = 3 - diff.
			boolean allowDiffOfThree = false;
			for (int j = 0; j < innerNodes.getLength(); j++) {
				if (innerNodes.item(j).getNodeName().equals("type")) {
					allowDiffOfThree = (innerNodes.item(j).getTextContent().equals("slider"));
				}
				if (innerNodes.item(j).getNodeName().equals("correct")) {

					if (allowDiffOfThree) {
						String str = innerNodes.item(j).getTextContent();
						int correct = Integer.parseInt(str);
						int answer = Integer.parseInt(answers[ansCnt]);
						int abs = Math.abs(correct - answer);
						if (abs < 3)
							points += 3 - abs;
					} else {
						if (innerNodes.item(j).getTextContent().equals(answers[ansCnt])) {
							points += 3;
						}
					}
					ansCnt++;
				}
			}
		}

		return points;
	}

	private static void storeUser(boolean _private, String time, String name, String email, String phone, String answers, String score) {

		lastRegistered = String.format("Tid: %s\tNavn: %s\tEpost: %s\tTelefon: %s\tSvar: %s\tScore: %s", time, name, email, phone, answers, score);
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = null;
		Document doc = null;
		try {
			db = dbf.newDocumentBuilder();
			doc = db.parse(Server.LOCAL_SERVER_PATH + (_private ? PRIVATE_SCOREBOARD : PUBLIC_SCOREBOARD));
		} catch (ParserConfigurationException | SAXException | IOException e) {
			e.printStackTrace();
		}
		Element newEntry = doc.createElement("entry");
		Element timeElement = doc.createElement("time");
		Element nameElement = doc.createElement("name");
		Element scoreElement = doc.createElement("score");
		Element emailElement, phoneElement, answersElement;
		timeElement.appendChild(doc.createTextNode(time));
		nameElement.appendChild(doc.createTextNode(name));
		scoreElement.appendChild(doc.createTextNode(score));
		newEntry.appendChild(timeElement);
		newEntry.appendChild(nameElement);
		newEntry.appendChild(scoreElement);
		if (_private) {
			emailElement = doc.createElement("email");
			phoneElement = doc.createElement("phone");
			answersElement = doc.createElement("answers");

			emailElement.appendChild(doc.createTextNode(email));
			phoneElement.appendChild(doc.createTextNode(phone));
			answersElement.appendChild(doc.createTextNode(answers));
			newEntry.appendChild(emailElement);
			newEntry.appendChild(phoneElement);
			newEntry.appendChild(answersElement);
		}
		doc.getLastChild().appendChild(newEntry);

		// printAllChildNodesRecursive("", children);
		Transformer transformer;
		try {
			transformer = TransformerFactory.newInstance().newTransformer();
			DOMSource source = new DOMSource(doc);
			StreamResult result = new StreamResult(new File(Server.LOCAL_SERVER_PATH + (_private ? PRIVATE_SCOREBOARD : PUBLIC_SCOREBOARD)));
			transformer.transform(source, result);
		} catch (TransformerFactoryConfigurationError | TransformerException e) {
			e.printStackTrace();
		}
	}

	private static void printAllChildNodesRecursive(String indent, NodeList e) {
		for (int i = 0; i < e.getLength(); i++) {
			System.out.println(indent + e.item(i));
			printAllChildNodesRecursive(indent + "    ", e.item(i).getChildNodes());
		}
	}

}

class Logger {

	private static final boolean ERROR_LOGGING = true, INFORMATION_LOGGING = true;
	private static final String LOG_PATH = "server.log";
	private FileWriter wr = null;

	/**
	 * Logger til wr.
	 * 
	 * @param x
	 *            Alt som skal logges.
	 * @throws IOException
	 */
	public void log(LogEvent event, Object... x) {

		try {
			wr = new FileWriter(new File(LOG_PATH), true);
		} catch (IOException e1) {
			System.err.println("Problemer med å åpne logg for skriving");
			e1.printStackTrace();
			return;
		}
		Calendar c = Calendar.getInstance();
		DateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
		try {
			wr.append("[" + dateFormat.format(c.getTime()) + "] ");
		} catch (IOException e1) {
			System.err.println("Problemer med å skrive til logg");
			e1.printStackTrace();
			return;
		}
		if (wr == null) {
			System.err.println(wr + ">" + x);
			return;
		}
		for (Object o : x) {
			try {
				if (event == LogEvent.ERROR && ERROR_LOGGING)
					wr.append("ERROR>\t" + o);
				else if (event == LogEvent.INFO && INFORMATION_LOGGING)
					wr.append("INFO> \t" + o);
				wr.append('\n');
				System.err.println(((event == LogEvent.ERROR) ? "ERROR" : "INFO") + ">\t" + o);
			} catch (IOException e) {
				System.err.println("Kunne ikke logge >\t" + x);
				e.printStackTrace();
				return;
			}
		}
		try {
			wr.close();
		} catch (IOException e) {
			System.err.println("Problemer med å lukke loggfil");
			e.printStackTrace();
			return;
		}
	}

	public enum LogEvent {
		ERROR, INFO
	}
}