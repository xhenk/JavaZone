package no.steria.javazone.quizapp.client;

import com.google.gwt.user.client.rpc.AsyncCallback;

/**
 * The async counterpart of <code>GreetingService</code>.
 */
public interface QuizServiceAsync {
	void quizServer(String input, AsyncCallback<String> callback)
			throws IllegalArgumentException;
}
