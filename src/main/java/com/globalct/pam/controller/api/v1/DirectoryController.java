package com.globalct.pam.controller.api.v1;

import com.globalct.pam.helpers.AuthHelper;
import com.globalct.pam.database.DBHandler;
import com.globalct.pam.models.*;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/directory")
public class DirectoryController {
    private AuthHelper authHelper;
    private DBHandler handler;

    public DirectoryController(AuthHelper authHelper, DBHandler handler) {
        this.authHelper = authHelper;
        this.handler = handler;
    }

    @Operation(summary = "Get a directory info by its dir_inode")
    @GetMapping("/{dir_inode}")
    public @ResponseBody ResponseEntity<DirectoryReturnType>
    getDirectoryByDir_INode(@AuthenticationPrincipal OidcUser principal,
                            @PathVariable int dir_inode,
                            @RequestParam(required = false) String sort,
                            @RequestParam(required = false) String[] status) {
        Optional<Directory> curr_dir = handler.directoryRepo.findById(dir_inode);

        if (curr_dir.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).header("reason",
                    String.format("Directory with inode %d doesn't exist", dir_inode)).build();
        }

        // get user and pass to directory return type to determine favorites
        User user = handler.userRepo.findById(principal.getPreferredUsername()).orElse(null);
        DirectoryReturnType ret = new DirectoryReturnType(curr_dir.get(), user);

        if (!authHelper.isDesignerOrAdmin(principal)) {
            if (curr_dir.get().getINode() != Directory.ROOT_DIR_INODE &&
                    !DirectoryReturnType.dirContainsAccessibleModel(principal, curr_dir.get())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("reason",
                        String.format("Permission denied for directory with inode %d", dir_inode)).build();
            }

            List<Integer> dirs_to_remove = new ArrayList<>();
            for (Directory subdir : curr_dir.get().getContainedDirectories()) {
                if (!DirectoryReturnType.dirContainsAccessibleModel(principal, subdir)) {
                    dirs_to_remove.add(subdir.getINode());
                }
            }

            ret.contained_directories.removeIf(directoryMetadata -> dirs_to_remove.contains(directoryMetadata.inode));
            ret.contained_models.removeIf(modelMetadata -> !modelMetadata.getSharedReaders().contains(principal.getPreferredUsername()));
        }

        ret.constructPath(curr_dir.get(), handler.directoryRepo);

        // Apply filtering based on multiple statuses
        if (status != null && status.length > 0) {
            try {
                // Convert the array of status strings to a set of ModelStatus enums
                Set<Model.ModelStatus> filterStatuses = Arrays.stream(status)
                        .map(s -> Model.ModelStatus.valueOf(s.toUpperCase())) // Convert each status string to uppercase and then to ModelStatus
                        .collect(Collectors.toSet()); // Collect the results into a Set

                // Remove models that do not match any of the statuses in filterStatuses
                ret.contained_models.removeIf(modelMetadata -> !filterStatuses.contains(modelMetadata.getStatus()));
            } catch (IllegalArgumentException e) {
                // If any of the status strings are invalid, return a BAD REQUEST response
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("reason",
                        "Invalid status parameter").build();
            }
        }

        // Apply sorting based on multiple criteria
        if (sort != null) {
            Comparator<ModelMetadata> modelComparator = null;
            Comparator<DirectoryMetadata> dirComparator = null;

                switch (sort.toLowerCase()) {
                    case "date":
                        modelComparator = Comparator.comparing(ModelMetadata::getCreation_date).reversed();
                        break;
                    case "name":
                        modelComparator = Comparator.comparing(ModelMetadata::getName);
                        dirComparator = Comparator.comparing(DirectoryMetadata::getName);
                        break;
                    case "author":
                        modelComparator = Comparator.comparing(ModelMetadata::getAuthor);
                        break;
                    case "date_reversed":
                        modelComparator = Comparator.comparing(ModelMetadata::getCreation_date);
                        break;
                    case "name_reversed":
                        modelComparator = Comparator.comparing(ModelMetadata::getName).reversed();
                        dirComparator = Comparator.comparing(DirectoryMetadata::getName).reversed();
                        break;
                    case "author_reversed":
                        modelComparator = Comparator.comparing(ModelMetadata::getAuthor).reversed();
                        break;
                    default:
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("reason",
                                "Invalid sort parameter").build();
                }

            if (modelComparator != null) {
                ret.contained_models.sort(modelComparator);
            }
            if (dirComparator != null) {
                ret.contained_directories.sort(dirComparator);
            }
        }

        // TODO: Filter for dirs. If nothing is contained, return error instead
        return ResponseEntity.of(Optional.of(ret));
    }


    @Operation(summary = "Creates a directory")
    @PostMapping("/")
    public @ResponseBody ResponseEntity<Integer>
        createDirectory(@AuthenticationPrincipal OidcUser principal,
                        @RequestParam("src_inode") int parent_dir_inode,
                        @RequestParam("name") String name) {
        if (!authHelper.isDesignerOrAdmin(principal)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Directory> parent_dir = handler.directoryRepo.findById(parent_dir_inode);

        if (parent_dir.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).header("reason",
                    String.format("No Directory with the inode %d found", parent_dir_inode)).build();
        }

        Directory dir = new Directory(parent_dir_inode, name);
        parent_dir.get().addContainedDirectory(dir);
        handler.directoryRepo.save(parent_dir.get());
        handler.directoryRepo.save(dir);

        return ResponseEntity.of(Optional.of(dir.getINode()));
    }

    @Operation(summary = "Deletes a directory")
    @DeleteMapping("/")
    public @ResponseBody ResponseStatusException
        deleteDirectory(@AuthenticationPrincipal OidcUser principal,
                        @RequestParam("dir_inode") int inode) {
        if (!authHelper.isDesignerOrAdmin(principal)) {
            return new ResponseStatusException(HttpStatus.FORBIDDEN, "Cant delete dir as reader");
        }

        // TODO: Not quite working
        if (inode == Directory.ROOT_DIR_INODE) {
            return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cant delete Home Directory");
        }

        Optional<Directory> dir = handler.directoryRepo.findById(inode);

        if (dir.isEmpty()) {
            return new ResponseStatusException(HttpStatus.NO_CONTENT, "Directory not found");
        }

        return handler.deleteDirectoryTree(dir.get());
    }

    @Operation(summary = "Edits a directory")
    @PutMapping("/")
    public @ResponseBody ResponseStatusException
        renameDirectory(@AuthenticationPrincipal OidcUser principal,
                        @RequestParam("dir_inode") int inode,
                        @RequestParam("new_name") String new_name) {
        if (!authHelper.isDesignerOrAdmin(principal)) {
            return new ResponseStatusException(HttpStatus.FORBIDDEN, "Cant rename dir as reader");
        }

        if (inode == Directory.ROOT_DIR_INODE) {
            return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cant rename Home Directory");
        }

        Optional<Directory> dir = handler.directoryRepo.findById(inode);

        if (dir.isEmpty()) {
            return new ResponseStatusException(HttpStatus.NO_CONTENT, "Directory not found");
        }

        dir.get().setName(new_name);
        handler.directoryRepo.save(dir.get());

        return new ResponseStatusException(HttpStatus.OK, "Directory name changed");
    }
}
