package com.globalct.pam.controller.api.v1;

import com.globalct.pam.helpers.AuthHelper;
import com.globalct.pam.database.DBHandler;
import com.globalct.pam.models.Model;
import com.globalct.pam.models.Reader;
import com.globalct.pam.models.User;
import com.globalct.pam.repository.UserRepo;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/grant")
public class GrantAccessController {

    private DBHandler handler;
    private AuthHelper authHelper;

    public GrantAccessController(DBHandler handler, AuthHelper authHelper, UserRepo userRepo) {
        this.handler = handler;
        this.authHelper = authHelper;

    }

    @Operation(summary = "Granting reading access to an user")
    @PostMapping("/")
    public @ResponseBody ResponseStatusException
        grantModelAccess(@AuthenticationPrincipal OidcUser principal,
                         @RequestParam("reader_mail") String reader_mail,
                         @RequestParam("model_id") int model_id) {
        if (!authHelper.isDesignerOrAdmin(principal)) {
            return new ResponseStatusException(HttpStatus.FORBIDDEN, "Cant grant Model access as reader");
        }

        Optional<Model> model = handler.modelRepo.findById(model_id);
        Optional<Reader> reader = handler.readerRepo.findById(reader_mail);

        if (model.isEmpty()) {
            String error_message = String.format("No Model(id=%d) or Reader(id=%s) exists", model_id, reader_mail);
            return new ResponseStatusException(HttpStatus.NO_CONTENT, error_message);
        }

        if (reader.isEmpty()) {
            reader = Optional.of(handler.readerRepo.save(new Reader(reader_mail)));
        }

        // Todo: maybe check if user already has access
        // if (model.get().getRelatedReaders().contains(reader.get())) {}

        model.get().addRelatedReader(reader.get());
        reader.get().addRelatedModel(model.get());

        handler.modelRepo.save(model.get());
        handler.readerRepo.save(reader.get());

        return new ResponseStatusException(HttpStatus.OK, "Granted Reader access to Model");
    }

    @Operation(summary = "Revokes a reading access from a user")
    @DeleteMapping("/")
    public @ResponseBody ResponseStatusException
        revokeModelAccess(@AuthenticationPrincipal OidcUser principal,
                          @RequestParam("reader_email") String reader_mail,
                          @RequestParam("model_id") int model_id) {
        if (!authHelper.isDesignerOrAdmin(principal)) {
            return new ResponseStatusException(HttpStatus.FORBIDDEN, "Cant revoke Model access as reader");
        }

        Optional<Model> model = handler.modelRepo.findById(model_id);
        Optional<Reader> reader = handler.readerRepo.findById(reader_mail);

        if (model.isEmpty() || reader.isEmpty()) {
            String error_message = String.format("No Model(id=%d) or Reader(id=%s) exists", model_id, reader_mail);
            return new ResponseStatusException(HttpStatus.NO_CONTENT, error_message);
        }

        if (!model.get().removeRelatedReader(reader.get()) |
                !reader.get().removeRelatedModel(model.get())) {
            String error_message = String.format("Model(id=%d) and Reader(id=%s) were not related", model_id, reader_mail);
            return new ResponseStatusException(HttpStatus.BAD_REQUEST, error_message);

        }

        // remove favorite model from the user when access to it is revoked
        User user = handler.userRepo.findById(reader_mail).orElse(null);
        if (user != null) {
            user.removeFavoriteModel(model.get());
        }

        handler.modelRepo.save(model.get());
        handler.readerRepo.save(reader.get());

        return new ResponseStatusException(HttpStatus.OK, "Access Revoked successfully");
    }
}
