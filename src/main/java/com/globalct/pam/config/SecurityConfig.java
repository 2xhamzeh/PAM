package com.globalct.pam.config;

import com.azure.spring.cloud.autoconfigure.implementation.aad.security.AadWebApplicationHttpSecurityConfigurer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * The Security Config, which is responsible for configuring the Azure Login
 */
@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
@EnableMethodSecurity
@Profile("!test")
public class SecurityConfig {
    @Value("${react.redirect}")
    private String REACT_REDIRECT;

    @Value("${react.nopermission}")
    private String REACT_NOPERMISSION;

    @Value("${api.logout}")
    private String API_LOGOUT;

    @Value("${react.base_url}")
    private String REACT_BASE_URL;


    /**
     * Configures the Azure Security Configuration
     *
     * @param http The HTTP config
     * @return The configured HTTP Chain
     * @throws Exception Possible Exceptions
     */
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.apply(AadWebApplicationHttpSecurityConfigurer.aadWebApplication());
        // the logout redirect url seems to be invalid here, the one in .env is being used instead, and it needs to be registered for it to work
        http
                .logout(logout -> logout.logoutUrl("/quit-session").logoutSuccessUrl(API_LOGOUT))
                .authorizeHttpRequests(
                        requests -> requests.requestMatchers("/").permitAll().anyRequest().authenticated())
                // TODO: There should be a better way to handle csrf
                .oauth2Login(configurer -> configurer.successHandler(((request, response, authentication) -> {
                    boolean isAuth = checkCredentials();
                    if (isAuth) {
                        response.sendRedirect(REACT_REDIRECT);
                    } else {
                        response.sendRedirect(REACT_NOPERMISSION);
                    }
                })))
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));

        http.cors(Customizer.withDefaults());
        // logout link now working with csrf enabled
        http.csrf(c -> c.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(REACT_BASE_URL));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowCredentials(true);
        configuration.addAllowedHeader("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private boolean checkCredentials() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
            if (authToken != null) {
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}
