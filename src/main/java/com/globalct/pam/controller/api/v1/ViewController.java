package com.globalct.pam.controller.api.v1;

import com.globalct.pam.helpers.AuthHelper;
import com.globalct.pam.database.DBHandler;
import com.globalct.pam.models.Model;
import com.globalct.pam.models.ModelReturnType;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/view")
public class ViewController {
    private DBHandler handler;
    private AuthHelper authHelper;

    public ViewController(DBHandler handler, AuthHelper authHelper) {
        this.authHelper = authHelper;
        this.handler = handler;
    }

    @Operation(summary = "Return the model object for viewing")
    @GetMapping("/{id}")
    public @ResponseBody ResponseEntity<ModelReturnType>
        viewModelById(@AuthenticationPrincipal OidcUser principal,
                      @PathVariable int id) {
        Optional<Model> model = handler.modelRepo.findById(id);

        if (model.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        if (!authHelper.isDesignerOrAdmin(principal)) {
            if (!DBHandler.hasModelAccess(principal, model.get())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        return ResponseEntity.of(Optional.of(new ModelReturnType(model.get())));
    }
}
