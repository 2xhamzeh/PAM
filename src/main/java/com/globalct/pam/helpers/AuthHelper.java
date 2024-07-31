package com.globalct.pam.helpers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Provides Helpers for Azure Interaction
 */
@Component("R")
public class AuthHelper {

    /**
     * The OID a User has, when it is a PAM-Reader
     */
    @Value("${groups.reader}")
    private String readerOid;

    /**
     * The OID a User has, when it is a PAM-Designer
     */
    @Value("${groups.designer}")
    private String designerOid;

    /**
     * The OID a User has, when it is a PAM-Admin
     */
    @Value("${groups.admin}")
    private String adminOid;

    /**
     * A Helper which checks if a given User is a PAM-Reader
     * @param principal The Principal user
     * @return Whether the principal is a PAM-Reader
     */
    public boolean isReader(OidcUser principal) {
        return ((List<String>) principal.getClaim("groups")).contains(readerOid);
    }

    /**
     * A Helper which checks if a given User is a PAM-Designer
     * @param principal The Principal user
     * @return Whether the principal is a PAM-Designer
     */
    public boolean isDesigner(OidcUser principal) {
        return ((List<String>) principal.getClaim("groups")).contains(designerOid);
    }

    /**
     * A Helper which checks if a given User is a PAM-Admin
     * @param principal The Principal user
     * @return Whether the principal is a PAM-Admin
     */
    public boolean isAdmin(OidcUser principal) {
        return ((List<String>) principal.getClaim("groups")).contains(adminOid);
    }

    /**
     * A Helper which checks if a given User is a PAM-Designer or Admin
     * @param principal The Principal user
     * @return Whether the principal is a PAM-Designer or Admin
     */
    public boolean isDesignerOrAdmin(OidcUser principal) {
        return isAdmin(principal) || isDesigner(principal);
    }
}
