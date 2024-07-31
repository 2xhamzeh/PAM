package com.globalct.pam.controller.api.v1;

import com.globalct.pam.database.DBHandler;
import com.globalct.pam.helpers.AuthHelper;
import com.globalct.pam.models.Model;
import com.globalct.pam.models.ModelMetadata;
import com.globalct.pam.models.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final DBHandler dbHandler;
    private final AuthHelper authHelper;

    public UserController(DBHandler dbHandler, AuthHelper authHelper) {
        this.dbHandler = dbHandler;
        this.authHelper = authHelper;
    }

    @PutMapping("/favorites/{model_id}")
    public ResponseEntity<Map<String, Boolean>> toggleFavorite(@AuthenticationPrincipal OidcUser principal,
                                                               @PathVariable int model_id) {
        String email = principal.getPreferredUsername(); // fetch email from token
        User user = dbHandler.userRepo.findById(email)
                .orElseGet(() -> new User(email)); // Create user if not exists

        Model model = dbHandler.modelRepo.findById(model_id)
                .orElse(null);

        if (model == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("newState", false));
        }

        // Check if the principal has the necessary permissions
        if (!authHelper.isDesignerOrAdmin(principal) && !DBHandler.hasModelAccess(principal, model)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Collections.singletonMap("newState", false));
        }

        // Toggle the favorite status
        boolean isFavorite;
        if (user.getFavoriteModels().contains(model)) {
            user.removeFavoriteModel(model);
            isFavorite = false;
        } else {
            user.addFavoriteModel(model);
            isFavorite = true;
        }
        dbHandler.userRepo.save(user);

        return ResponseEntity.ok(Collections.singletonMap("newState", isFavorite));
    }



    @GetMapping("/favorites")
    public ResponseEntity<List<ModelMetadata>> getFavorites(@AuthenticationPrincipal OidcUser principal,
                                                            @RequestParam(required = false) String sort,
                                                            @RequestParam(required = false) String[] status) {
        String email = principal.getPreferredUsername(); // Fetch sub from the OIDC token
        User user = dbHandler.userRepo.findById(email)
                .orElseGet(() -> new User(email));

        List<ModelMetadata> favoriteModels = user.getFavoriteModels().stream()
                .map(ModelMetadata::new) // Create a new ModelMetadata object for each Model
                .collect(Collectors.toList());

        // Set each model as favorite
        favoriteModels.forEach(modelMetadata -> modelMetadata.setFavorite(true));

        // Apply status filtering
        if (status != null && status.length > 0) {
            Set<Model.ModelStatus> filterStatuses = Arrays.stream(status)
                    .map(s -> {
                        try {
                            return Model.ModelStatus.valueOf(s.toUpperCase());
                        } catch (IllegalArgumentException e) {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status parameter");
                        }
                    })
                    .collect(Collectors.toSet());

            favoriteModels.removeIf(modelMetadata -> !filterStatuses.contains(modelMetadata.getStatus()));
        }

        // Apply sorting
        if (sort != null) {
            Comparator<ModelMetadata> comparator = switch (sort.toLowerCase()) {
                case "date" -> Comparator.comparing(ModelMetadata::getCreation_date).reversed();
                case "name" -> Comparator.comparing(ModelMetadata::getName);
                case "author" -> Comparator.comparing(ModelMetadata::getAuthor);
                case "date_reversed" -> Comparator.comparing(ModelMetadata::getCreation_date);
                case "name_reversed" -> Comparator.comparing(ModelMetadata::getName).reversed();
                case "author_reversed" -> Comparator.comparing(ModelMetadata::getAuthor).reversed();
                default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid sort parameter");
            };

            favoriteModels.sort(comparator);
        }

        return ResponseEntity.ok(favoriteModels);
    }


    @GetMapping("/myModels")
    public ResponseEntity<List<ModelMetadata>> getMyModels(@AuthenticationPrincipal OidcUser principal,
                                                           @RequestParam(required = false) String sort,
                                                           @RequestParam(required = false) String[] status) {
        String email = principal.getPreferredUsername();
        User user = dbHandler.userRepo.findById(email).orElseGet(() -> new User(email)); // Ensures user is not null
        List<Model> models = dbHandler.modelRepo.findByAuthorEmail(email);

        List<ModelMetadata> modelMetadataList = models.stream()
                .map(model -> {
                    ModelMetadata metadata = new ModelMetadata(model);
                    metadata.setFavorite(user.getFavoriteModels().contains(model));
                    return metadata;
                })
                .collect(Collectors.toList());

        // Apply status filtering
        if (status != null && status.length > 0) {
            Set<Model.ModelStatus> filterStatuses = Arrays.stream(status)
                    .map(s -> {
                        try {
                            return Model.ModelStatus.valueOf(s.toUpperCase());
                        } catch (IllegalArgumentException e) {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status parameter");
                        }
                    })
                    .collect(Collectors.toSet());

            modelMetadataList.removeIf(metadata -> !filterStatuses.contains(metadata.getStatus()));
        }

        // Apply sorting
        if (sort != null) {
            Comparator<ModelMetadata> comparator = switch (sort.toLowerCase()) {
                case "date" -> Comparator.comparing(ModelMetadata::getCreation_date).reversed();
                case "name" -> Comparator.comparing(ModelMetadata::getName);
                case "author" -> Comparator.comparing(ModelMetadata::getAuthor);
                case "date_reversed" -> Comparator.comparing(ModelMetadata::getCreation_date);
                case "name_reversed" -> Comparator.comparing(ModelMetadata::getName).reversed();
                case "author_reversed" -> Comparator.comparing(ModelMetadata::getAuthor).reversed();
                default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid sort parameter");
            };

            modelMetadataList.sort(comparator);
        }

        return ResponseEntity.ok(modelMetadataList);
    }

}
