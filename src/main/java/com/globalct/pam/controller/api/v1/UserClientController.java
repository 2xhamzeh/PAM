package com.globalct.pam.controller.api.v1;

import com.globalct.pam.helpers.AuthHelper;
import com.globalct.pam.models.ClientInfo;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
public class UserClientController {
    private AuthHelper authHelper;

    public UserClientController(AuthHelper authHelper) {
        this.authHelper = authHelper;
    }

    @Operation(summary = "Gives the user details (name & role)")
    @GetMapping("/")
    public ResponseEntity<ClientInfo> getClientInfo(@AuthenticationPrincipal OidcUser principal) {
        ClientInfo info = new ClientInfo();
        if (authHelper.isDesignerOrAdmin(principal)) {
            info.role = "Designer";
        }
        else if (authHelper.isReader(principal)) {
            info.role = "Reader";
        }
        else {
            info.role = "None";
        }

        info.name = principal.getName();
        return ResponseEntity.of(Optional.of(info));
    }
}
