package com.globalct.pam.ping_pong;


import com.globalct.pam.database.DBHandler;
import lombok.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

/**
 * A class which manages the HeartBeat connection
 */
@Configuration
@EnableWebSocket
public class PingPongSocket implements WebSocketConfigurer {

    /**
     * The DatabaseHandler which also manages the Open-Models
     */
    protected final DBHandler handler;

    /**
     * Constructor
     * @param handler The global DatabaseHandler
     */
    public PingPongSocket(DBHandler handler) {
        this.handler = handler;
    }

    /**
     * Intercepts the WebSocket Handshake and retrieves the Model if
     * @return The HandshakeInterceptor Object
     */
    @Bean
    public HandshakeInterceptor auctionInterceptor() {
        return new HandshakeInterceptor() {

            @Override
            public boolean beforeHandshake(@NonNull ServerHttpRequest request, @NonNull ServerHttpResponse response, @NonNull WebSocketHandler wsHandler, @NonNull Map<String, Object> attributes) {
                // Get the URI segment corresponding to the auction id during handshake
                String path = request.getURI().getPath();
                String auctionId = path.substring(path.lastIndexOf('/') + 1);

                // This will be added to the websocket session
                attributes.put("modelId", auctionId);
                return true;
            }

            public void afterHandshake(@NonNull ServerHttpRequest request, @NonNull ServerHttpResponse response,
                                       @NonNull WebSocketHandler wsHandler, Exception exception) {
                // Nothing to do after handshake
            }
        };
    }

    /**
     * Registers a WebSocket handler
     * @param registry The Registry  to which to add the Handler
     */
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new PingPongHandler(handler), "/ping/*").addInterceptors(auctionInterceptor());
    }
}
