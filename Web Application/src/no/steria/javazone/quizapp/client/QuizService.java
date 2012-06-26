package no.steria.javazone.quizapp.client;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;

/**
 * The client side stub for the RPC service.
 */
@RemoteServiceRelativePath("greet")
public interface QuizService extends RemoteService {
	String quizServer(String name) throws IllegalArgumentException;
}
