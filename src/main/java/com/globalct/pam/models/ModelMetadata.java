package com.globalct.pam.models;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * A Class which contains Metadata of a Model
 */
public class ModelMetadata {

    /**
     * Default Constructor
     * Initialized to invalid values
     */
    public ModelMetadata() {
        this.id = -1;
        this.name = "";
        this.directory_inode = -1;
    }

    /**
     * Constructor
     * @param id The ID of the Model
     * @param name The name of the Model
     * @param description The Description of the Model
     * @param inode The Inode of the Model
     */
    public ModelMetadata(int id, String name, String description, int inode, String author) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.shared_readers = Collections.emptySet();
        this.directory_inode = inode;
        this.creation_date = LocalDate.now();
        this.author = author;
        this.status = Model.ModelStatus.IN_PROGRESS;
        this.isFavorite = false;
    }

    /**
     * Constructor: Extracts Metadata of a Model
     * @param model The Model of which to extract Metadata from
     */
    public ModelMetadata(Model model) {
        this.id = model.getModelId();
        this.name = model.getModelName();
        this.description = model.getModelDescription();
        this.shared_readers = model.getRelatedReaders().stream().map(Reader::getAzureEmail).collect(Collectors.toSet());
        this.directory_inode = model.getDirINode();
        this.status = model.getStatus();
        this.creation_date = model.getCreation_date();
        this.author = model.getAuthor();
        this.isFavorite = false;
    }

    /**
     * The ID of the Model
     */
    @Getter
    private int id;

    /**
     * The name of the Model
     */
    @Getter
    private String name;

    /**
     * The Description of the Model
     */
    @Getter
    private String description;

    /**
     * The Inode of the Directory the Model is in
     */
    private int directory_inode;

    /**
     * The Readers the Model is shared with
     */
    private Set<String> shared_readers;

    @Getter
    private LocalDate creation_date;

    @Getter
    private String author;

    @Getter
    private Model.ModelStatus status;

    @Getter
    @Setter
    private boolean isFavorite;

    /**
     * Setter: Sets the ID of the Model
     * @param id The new ID of the Model
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Setter: Sets the name of the Model
     * @param name The new Name of the Model
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Setter: Sets the Description of the Model
     * @param desc The new Description of the Model
     */
    public void setDescription(String desc) {
        this.description = desc;
    }

    /**
     * Getter: Gets the Readers, this model is shared with
     * @return The Mail-Addressed of the Readers, this Model is shared with
     */
    public Set<String> getSharedReaders() {
        return this.shared_readers;
    }

    /**
     * Setter: Adds a new Reader (mail address) this model is shared with
     * @param new_reader The mail address of the Reader
     */
    public void addSharedReaders(String new_reader) {
        this.shared_readers.add(new_reader);
    }

    /**
     * Getter: Inode
     * @return The Inode of the Directory this Model is in
     */
    public int getDirectoryINode() {
        return directory_inode;
    }

    /**
     * Setter: Sets the Inode of the Directory, the Model is in
     * @param directory_inode The Inode of the new Directory, the Model is in
     */
    public void setDirectoryINode(int directory_inode) {
        this.directory_inode = directory_inode;
    }
}
