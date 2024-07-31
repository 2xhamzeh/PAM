package com.globalct.pam.models;

import com.globalct.pam.repository.DirectoryRepo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * A Type which is used to send important infos of a directory over HTTP
 */
public class DirectoryReturnType {


    /**
     * Constructor, which constructs return type based on a directory
     * @param dir The Directory return type
     */
    public DirectoryReturnType(Directory dir, User user) {
        this.metadata = new DirectoryMetadata(dir);
        this.contained_models = dir.getContainedModels().stream().map(model -> {
            ModelMetadata mmd = new ModelMetadata(model);
            if(user != null){
            mmd.setFavorite(user.getFavoriteModels().contains(model));
            }
            return mmd;
        }).collect(Collectors.toList());
        this.contained_directories = dir.getContainedDirectories().stream().map(DirectoryMetadata::new).collect(Collectors.toList());
        this.contained_directories.sort(Comparator.comparing(dir2 -> dir2.name));
        this.contained_models.sort(Comparator.comparing(ModelMetadata::getName));

        this.path = new ArrayList<>();

    }

    public void constructPath(Directory this_dir, DirectoryRepo directoryRepo) {
        path.add(new DirectoryMetadata(this_dir));

        while (this_dir.getINode() != Directory.ROOT_DIR_INODE){
            this_dir = directoryRepo.findById(this_dir.getParentINode()).get();
            path.add(new DirectoryMetadata(this_dir));
        }
    }

    static public boolean dirContainsAccessibleModel(OidcUser principal, Directory curr_dir) {
        String mail = principal.getPreferredUsername();

        if (curr_dir.getContainedModels().stream().anyMatch(
                model -> {
                    return model.getRelatedReaders().stream().anyMatch(
                        reader -> {
                            return reader.getAzureEmail().equals(mail);
                        });
                }))
        {
            return true;
        }

        for (Directory subdir : curr_dir.getContainedDirectories()) {
            if (DirectoryReturnType.dirContainsAccessibleModel(principal, subdir)) {
                return true;
            }
        }

        return false;

    }

    public DirectoryMetadata metadata;

    public List<DirectoryMetadata> path;

    public List<ModelMetadata> contained_models;
    public List<DirectoryMetadata> contained_directories;

}
