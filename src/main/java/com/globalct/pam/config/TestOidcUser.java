package com.globalct.pam.config;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.util.Collection;
import java.util.Map;

public class TestOidcUser implements OidcUser {
    private final OidcIdToken idToken;
    private final OidcUserInfo userInfo;

    public TestOidcUser(OidcIdToken idToken, OidcUserInfo userInfo) {
        this.idToken = idToken;
        this.userInfo = userInfo;
    }

    @Override
    public Map<String, Object> getClaims() {
        return userInfo.getClaims();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getName() {
        return userInfo.getSubject();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return userInfo.getClaims();
    }

    @Override
    public OidcIdToken getIdToken() {
        return idToken;
    }

    @Override
    public OidcUserInfo getUserInfo() {
        return userInfo;
    }

    @Override
    public String getPreferredUsername() {
        return getName();
    }

    @Override
    public Object getClaim(String claimName) {
        return getClaims().get(claimName);
    }
}
