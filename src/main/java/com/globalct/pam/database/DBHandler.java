package com.globalct.pam.database;

import com.globalct.pam.models.Directory;
import com.globalct.pam.models.Model;
import com.globalct.pam.models.Reader;
import com.globalct.pam.ping_pong.OpenModelManager;
import com.globalct.pam.repository.DirectoryRepo;
import com.globalct.pam.repository.ModelRepo;
import com.globalct.pam.repository.ReaderRepo;
import com.globalct.pam.repository.UserRepo;
import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * The DBHandler manages the Database connection and the currently open Models
 */
@Component
public class DBHandler {

    /**
     * The currently open Models
     */
    public OpenModelManager open_models;

    /**
     * The Reader Table
     */
    public ReaderRepo readerRepo;

    /**
     * The Model table
     */
    public ModelRepo modelRepo;

    /**
     * The Directory Table
     */
    public DirectoryRepo directoryRepo;


    public UserRepo userRepo;


    /**
     * Constructor
     * @param open_models The open-model-manager
     * @param readerRepo The Reader Table
     * @param modelRepo The Model Table
     * @param directoryRepo The Directory Table
     */
    public DBHandler(OpenModelManager open_models, ReaderRepo readerRepo, ModelRepo modelRepo, DirectoryRepo directoryRepo, UserRepo userRepo) {
        this.readerRepo = readerRepo;
        this.modelRepo = modelRepo;
        this.directoryRepo = directoryRepo;
        this.open_models = open_models;
        this.userRepo = userRepo;
    }

    /**
     * This Method gets called after the initialization of the Database Tables and initializes
     * the directories so that a root directory exists
     */
    @PostConstruct
    void postConstruct() {

        // Set the dir inode counter to the largest used inode
        for (Directory dir : this.directoryRepo.findAll()) {
            if (Directory.current_inode_counter < dir.getINode()) {
                Directory.current_inode_counter = dir.getINode();
            }
        }
        Directory.current_inode_counter += 1;

        if (this.directoryRepo.existsById(Directory.ROOT_DIR_INODE)) {
            return;
        }

        this.directoryRepo.save(new Directory(true, Directory.ROOT_DIR_INODE, Directory.ROOT_DIR_NAME));

    }

    /**
     * A Method which removes a Model from the database
     * @param model The Model which should be removed from the Database
     */
    public void removeModel(Model model) {
        for (Reader reader : model.getRelatedReaders()) {
            reader.removeRelatedModel(model);
        }
        model.clearRelatedReaders();

        Directory dir = model.getDir();

        this.modelRepo.delete(model);
        dir.removeContainedModel(model);
        this.directoryRepo.save(dir);
    }

    /**
     * A method which deletes a directory and all contained subdirectories and Models
     * @param dir The Directory which should be deleted
     * @return The HTTP response status
     */
    public ResponseStatusException deleteDirectoryTree(Directory dir) {

        if (dir == null) {
            return new ResponseStatusException(HttpStatus.OK, "Directory Deleted");
        }

        for (Model model : dir.getContainedModels()) {
            for (Reader reader : model.getRelatedReaders()) {
                reader.removeRelatedModel(model);
            }
            model.clearRelatedReaders();
        }

        this.modelRepo.deleteAll(dir.getContainedModels());
        this.directoryRepo.deleteAll(dir.getContainedDirectories());

        // Delete Parent connection
        Directory parent = this.directoryRepo.findById(dir.getParentINode()).get();
        parent.removeContainedDirectory(dir);

        this.directoryRepo.delete(dir);

        return new ResponseStatusException(HttpStatus.OK, "Directory Deleted");
    }

    /**
     * A Method which checks if a given user has access to a give Model
     * @param principal The user
     * @param model The model
     * @return Whether the user has access to the model
     */
    static public boolean hasModelAccess(OidcUser principal, Model model) {
        String mail = principal.getPreferredUsername();
        return model.getRelatedReaders().stream().anyMatch(reader -> reader.getAzureEmail().equals(mail));
    }

    /**
     * A Method which checks if a given Model name already exists in a given directory
     * @param dir The Directory
     * @param name The Name
     * @return Whether the name already exists in the directory
     */
    public boolean nameExists(Directory dir, String name) {
        return dir.getContainedModels().stream().anyMatch(model -> model.getModelName().equals(name));
    }

    /**
     * A Method which moves a Model from its directory to a new one
     * @param model The Model which should be moved
     * @param destinationDir The destination directory where the model should be moved
     */
    public void moveModel(Model model, Directory destinationDir) {

        Directory currentDir = model.getDir();
        // Remove the model from the current directory
        currentDir.removeContainedModel(model);
        this.directoryRepo.save(currentDir);

        // Add the model to the destination directory
        destinationDir.addContainedModel(model);
        this.directoryRepo.save(destinationDir);

        // Update the model's directory reference and save the model
        model.setDir(destinationDir);
        this.modelRepo.save(model);
    }

    public void changeModelStatus(Model model, Model.ModelStatus status) {
        model.setStatus(status);
        this.modelRepo.save(model);
    }



}
