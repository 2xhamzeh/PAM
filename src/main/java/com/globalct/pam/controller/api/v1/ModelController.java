package com.globalct.pam.controller.api.v1;

import com.globalct.pam.helpers.AuthHelper;
import com.globalct.pam.database.*;
import com.globalct.pam.models.*;
import io.swagger.v3.oas.annotations.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/models")
public class ModelController {
    private static final Logger log = LoggerFactory.getLogger(ModelController.class);
    private AuthHelper authHelper;
    private DBHandler handler;

    public ModelController(AuthHelper authHelper, DBHandler handler) {
        this.authHelper = authHelper;
        this.handler = handler;
    }

    @Operation(summary = "Get the metadata of a model")
    @GetMapping("/{model_id}/meta")
    public @ResponseBody ResponseEntity<ModelMetadata> getModelMetadata(@AuthenticationPrincipal OidcUser principal,
            @PathVariable("model_id") int model_id) {

        Optional<Model> model = handler.modelRepo.findById(model_id);

        if (model.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        if (!authHelper.isDesignerOrAdmin(principal)) {
            if (!handler.hasModelAccess(principal, model.get())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        // logic to determine if a model is liked by the user
        User user = handler.userRepo.findById(principal.getPreferredUsername()).orElse(null);
        boolean isFav = false;
        if(user!=null){
            isFav = user.getFavoriteModels().contains(model.get());
        }
        ModelMetadata mmd = new ModelMetadata(model.get());
        mmd.setFavorite(isFav);
        return ResponseEntity.of(Optional.of(mmd));
    }

    @Operation(summary = "Check, if the name is present in the directory")
    @GetMapping("/")
    public @ResponseBody ResponseEntity<Boolean> isModelNamePresent(@AuthenticationPrincipal OidcUser principal,
            @RequestParam("dir_inode") int inode,
            @RequestParam("model_name") String model_name) {
        if (!authHelper.isDesignerOrAdmin(principal)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .header("reason", "Cant get Model info as Reader").build();
        }

        Optional<Directory> dir = handler.directoryRepo.findById(inode);

        if (!dir.isPresent()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                    .header("reason", "No Directory with the Provided Inode exists").build();

        }

        return ResponseEntity.of(Optional.of(handler.nameExists(dir.get(), model_name)));
    }

    @Operation(summary = "Get a model by its ID")
    @GetMapping("/{model_id}")
    public @ResponseBody ResponseEntity<ModelReturnType> getModel(@AuthenticationPrincipal OidcUser principal,
            @PathVariable("model_id") int model_id) {
        Optional<Model> model = handler.modelRepo.findById(model_id);

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

    /**
     * Add a Model to the database
     *
     * @param principal  The user which requested this endpoint
     * @param dir_inode  The dir inode in which the Model should be saved
     * @param model_name The name of the new Model
     * @param model_data The XML-Data of the new Model
     * @return Response HTTP-Status
     */
    @Operation(summary = "Creates a model and insert it into a specific directory")
    @PostMapping("/")
    public @ResponseBody ResponseEntity<ModelMetadata> createModel(@AuthenticationPrincipal OidcUser principal,
            @RequestParam("dir_inode") int dir_inode,
            @RequestParam("name") String model_name,
            @RequestParam("description") String description,
            @RequestParam("file") MultipartFile model_data) {
        if (!authHelper.isDesignerOrAdmin(principal)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Directory> dir = handler.directoryRepo.findById(dir_inode);
        if (dir.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).header("reason",
                    String.format("No Directory with the inode %d found", dir_inode)).build();

        }

        if (handler.nameExists(dir.get(), model_name)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).header("reason",
                    String.format("Model name %s already exists", model_name)).build();
        }

        try {
            if (model_data.isEmpty()) {
                System.out.println("Cant add Model!");
                System.out.println("Given Model '" + model_name + "' has no associated data!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("reason",
                        "Given Data is empty").build();

            }

            Model newModel = new Model(model_name, description, model_data.getBytes(), dir.get(), principal.getName(), principal.getPreferredUsername());
            handler.modelRepo.save(newModel);
            dir.get().addContainedModel(newModel);
            handler.directoryRepo.save(dir.get());

            return ResponseEntity.of(Optional.of(new ModelMetadata(newModel)));

        } catch (IOException e) {
            log.error(e.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).header("reason",
                    "Failed to save Model").build();
        }
    }

    @Operation(summary = "Update a model by its ID")
    @PutMapping("/")
    public @ResponseBody ResponseStatusException updateModel(@AuthenticationPrincipal OidcUser principal,
            @RequestParam("id") int model_id,
            @RequestParam("file") MultipartFile model_data) {
        if (!authHelper.isDesignerOrAdmin(principal)) {
            return new ResponseStatusException(HttpStatus.FORBIDDEN, "Cant update Model as reader");
        }

        Optional<Model> model = handler.modelRepo.findById(model_id);

        if (model.isEmpty()) {
            return new ResponseStatusException(HttpStatus.NO_CONTENT, "No Model with the id '" + model_id + "' exists");
        }

        if (model_data.isEmpty()) {
            return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Given model data has no content");

        }

        try {
            model.get().setModelData(model_data.getBytes());
            handler.modelRepo.save(model.get());
            return new ResponseStatusException(HttpStatus.OK, "Model Updated");

        } catch (IOException e) {
            log.error(e.toString());
            return new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "There was an error saving the Model");
        }
    }

    @Operation(summary = "Re-name a model by its ID")
    @PutMapping("/rename")
    public @ResponseBody ResponseStatusException renameModel(@AuthenticationPrincipal OidcUser principal,
            @RequestParam("id") int model_id,
            @RequestParam("new_name") String new_name) {
        if (!authHelper.isDesignerOrAdmin(principal)) {
            return new ResponseStatusException(HttpStatus.FORBIDDEN, "Cant rename Model as reader");
        }

        Optional<Model> model = handler.modelRepo.findById(model_id);

        if (model.isEmpty()) {
            return new ResponseStatusException(HttpStatus.NO_CONTENT, "No Model with the id '" + model_id + "' exists");
        }

        if (handler.nameExists(model.get().getDir(), new_name)) {
            return new ResponseStatusException(HttpStatus.CONFLICT,
                    "There already is a Model named '" + new_name + "'");
        }

        model.get().setModelName(new_name);
        handler.modelRepo.save(model.get());

        return new ResponseStatusException(HttpStatus.OK, "Name successfully changed");
    }

    @Operation(summary = "Update the description by its model ID")
    @PutMapping("/updateDescription")
    public @ResponseBody ResponseStatusException setModelDescription(@AuthenticationPrincipal OidcUser principal,
            @RequestParam("id") int model_id,
            @RequestParam("description") String desc) {
        if (!authHelper.isDesignerOrAdmin(principal)) {
            return new ResponseStatusException(HttpStatus.FORBIDDEN, "Cant set Model description as reader");
        }

        Optional<Model> model = handler.modelRepo.findById(model_id);

        if (model.isEmpty()) {
            return new ResponseStatusException(HttpStatus.NO_CONTENT, "No Model with the id '" + model_id + "' exists");
        }

        model.get().setModelDescription(desc);
        handler.modelRepo.save(model.get());

        return new ResponseStatusException(HttpStatus.OK, "Description successfully changed");
    }

    @Operation(summary = "Deletes a model by its ID")
    @DeleteMapping("/")
    public @ResponseBody ResponseStatusException deleteModel(@AuthenticationPrincipal OidcUser principal,
            @RequestParam("id") int model_id) {
        if (!authHelper.isDesignerOrAdmin(principal)) {
            return new ResponseStatusException(HttpStatus.FORBIDDEN, "Cant delete Model as reader");
        }

        Optional<Model> model = handler.modelRepo.findById(model_id);

        if (model.isEmpty()) {
            return new ResponseStatusException(HttpStatus.NO_CONTENT, "No Model with id '" + model_id + "' found");
        }

        handler.removeModel(model.get());

        return new ResponseStatusException(HttpStatus.OK, "Model deleted");
    }

    @Operation(summary = "Move a model to a new directory")
    @PutMapping("/{model_id}/move")
    public @ResponseBody ResponseEntity<String> moveModel(@AuthenticationPrincipal OidcUser principal,
                                                          @PathVariable("model_id") int model_id,
                                                          @RequestParam("destination_dir_inode") int destinationDirInode) {
        if (!authHelper.isDesignerOrAdmin(principal)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to move the model.");
        }

        Optional<Model> modelOptional = handler.modelRepo.findById(model_id);
        if (modelOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Model not found.");
        }
        Model model = modelOptional.get();

        Optional<Directory> destinationDirOptional = handler.directoryRepo.findById(destinationDirInode);
        if (destinationDirOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Destination directory not found.");
        }
        Directory destinationDir = destinationDirOptional.get();

        if (handler.nameExists(destinationDir, model.getModelName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("A model with the same name already exists in the destination directory.");
        }

        try {
            handler.moveModel(model, destinationDir);
            return ResponseEntity.ok("Model moved successfully.");
        } catch (Exception e) {
            log.error("Error moving model: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while moving the model.");
        }
    }

    @Operation(summary = "Change the status of the Model")
    @PutMapping("/{model_id}/status")
    public @ResponseBody ResponseEntity<String> setModelStatus(@AuthenticationPrincipal OidcUser principal,
                                                               @PathVariable("model_id") int model_id,
                                                               @RequestParam("status") String status) {
        if (!authHelper.isDesignerOrAdmin(principal)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to change the model status.");
        }

        Optional<Model> modelOptional = handler.modelRepo.findById(model_id);
        if (modelOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Model not found.");
        }
        Model model = modelOptional.get();

        try {
            Model.ModelStatus newStatus = Model.ModelStatus.valueOf(status.toUpperCase());
            handler.changeModelStatus(model, newStatus);
            return ResponseEntity.ok("Model status changed successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status value.");
        } catch (Exception e) {
            log.error("Error changing model status: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while changing the model status.");
        }
    }
}
