package com.globalct.pam.ping_pong;


import com.globalct.pam.database.DBHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Optional;

/**
 * A class which is used to handle WebSocket connections from clients which
 * have opened a Model. This is used to ensure that only one Client opens a Model in Edit mode at once
 */
@Component
public class PingPongHandler extends TextWebSocketHandler {

    /**
     * The Database which also keeps track of which models are currently open
     */
    protected final DBHandler handler;

    /**
     * Constructor
     * @param handler The Global DatabaseHandler
     */
    public PingPongHandler(DBHandler handler) {
        this.handler = handler;
    }

    /**
     * A handler for every Message the WebSocket receives
     * @param session The WebSocketSession instance
     * @param message The message the webSocket receives
     * @throws Exception Possible Exceptions
     */
    @Override
    protected synchronized void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        super.handleTextMessage(session, message);
        session.sendMessage(new TextMessage("pong"));
    }

    /**
     * A method which registers a WebSocket as the owner of a specified Model
     * so that no other client can get exclusive write-access to the Model
     * @param session The WebSocketSession with got created
     * @throws Exception Possible Exceptions
     */
    @Override
    public synchronized void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);

        Optional<Integer> model_id = getSessionModelID(session);
        if (model_id.isEmpty()) {
            return;
        }

        if (!handler.open_models.acquireAccess(session, model_id.get())) {
            System.out.println("Closed connection to socket...");
        }

    }

    /**
     * A method which registers when the exclusive write-access to a Model gets Dropped
     * (When the HeartBeat to the Model stops)
     * @param session The WebSocketSession which closed
     * @param status The status wit which the session closed
     * @throws Exception Possible Exceptions
     */
    @Override
    public synchronized void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);

        Optional<Integer> model_id = getSessionModelID(session);
        if (model_id.isEmpty()) {
            return;
        }

        handler.open_models.dropAccess(session, model_id.get());
    }

    /**
     * A Helper Method with which you can get the ModelID from a WrebSocketSession
     * (provided it was sent with the WebSockez)
     * @param session The WebSocketSession
     * @return The ModelID if it is present; Optional.empty() otherwise 
     */
    public static Optional<Integer> getSessionModelID(WebSocketSession session) {
        try {
            return Optional.of(Integer.parseInt((String)session.getAttributes().get("modelId")));
        } catch (Exception e) {
            return Optional.empty();
        }

    }
}
