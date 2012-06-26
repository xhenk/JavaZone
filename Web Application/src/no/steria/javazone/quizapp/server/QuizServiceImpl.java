package no.steria.javazone.quizapp.server;

import no.steria.javazone.quizapp.client.QuizService;
import no.steria.javazone.quizapp.shared.FieldVerifier;
import com.google.gwt.user.server.rpc.RemoteServiceServlet;

/**
 * The server side implementation of the RPC service.
 */
@SuppressWarnings("serial")
public class QuizServiceImpl extends RemoteServiceServlet implements
		QuizService {

	public String quizServer(String input) throws IllegalArgumentException {

		// Escape data from the client to avoid cross-site script
		// vulnerabilities.
		input = escapeHtml(input);
		String retval = "Feil på spørsmål ";
		int errcnt = 0;
		boolean[] correct = FieldVerifier.getCorrect(input);
		for (int i = 0; i < correct.length; i++) {
			if (!correct[i]) {
				retval += i + ", ";
				errcnt++;
			}
		}
		if (errcnt == 0)
			return "Alt er riktig!";
		else if (errcnt == 2)
			return retval.substring(0, retval.length() - 2).replace(", ", " og ");
		else
			return retval.substring(0, retval.length() - 2);
	}

	/**
	 * Escape an html string. Escaping data received from the client helps to
	 * prevent cross-site script vulnerabilities.
	 * 
	 * @param html
	 *            the html string to escape
	 * @return the escaped string
	 */
	private String escapeHtml(String html) {
		if (html == null) {
			return null;
		}
		return html.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
				.replaceAll(">", "&gt;");
	}
}
