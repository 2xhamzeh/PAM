package com.globalct.pam.ping_pong;

import org.springframework.web.socket.WebSocketSession;

/**
 * An Identifier used to identify a Model which is currently opened (and therefore connected to a WebSocket session)
 */
public class OpenModelIdentifier {

    /**
     * The WebSocketSession of the current open Model
     */
    WebSocketSession session;

    /**
     * The ID of the open Model
     */
    Integer model_id;


}
