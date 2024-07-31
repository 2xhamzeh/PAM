package com.globalct.pam.ping_pong;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.*;

/**
 * A Class used to manage which user currently has which model open
 * This is to ensure that two sessions cant open one model simultaneously in edit-mode
 *
 * This also means, that the same user cant open a model twice
 */
@Component
public class OpenModelManager {

    /**
     * A List of open Models and their associated WebSocketSession
     */
    private final List<OpenModelIdentifier> open_models = new ArrayList<>();


    /**
     * Used to get the WebSocket session which currently holds exclusive access to the Model
     * @param model_id The id of the Model
     * @return The Session of the HeartBear-WebSocket (if one exists). Otherwise, Optional.empty()
     */
    public Optional<WebSocketSession> getSessionOwner(Integer model_id) {
        for (OpenModelIdentifier entry : open_models) {
            if (entry.model_id.equals(model_id)) {
                return Optional.of(entry.session);
            }
        }

        return Optional.empty();
    }

    /**
     * Used to acquire exclusive access to a Model
     * @param session The Session of the Websocket used for the heartbeat
     * @param model_id The id of the Model
     * @return Whether the user has successfully gained exclusive access
     */
    public boolean acquireAccess(WebSocketSession session, Integer model_id) {
        if (getSessionOwner(model_id).isEmpty()) {
            OpenModelIdentifier ident = new OpenModelIdentifier();
            ident.model_id = model_id;
            ident.session = session;
            open_models.add(ident);
            return true;
        }

        return false;
    }

    /**
     * used to drop exclusive access to a Model
     * @param session The session of the WebSocket used for the HeartBeat
     * @param model_id The id of the Model
     * @return Whether the user had exclusive access to the Model
     */
    public boolean dropAccess(WebSocketSession session, Integer model_id) {
        return open_models.removeIf(entry -> entry.session.equals(session) && entry.model_id.equals(model_id));
    }

}
