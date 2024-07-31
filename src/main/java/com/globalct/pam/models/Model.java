package com.globalct.pam.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * The Model class which contains all relevant infos of a Model
 */
@Entity
@Table(name = "model")
public class Model {

    public enum ModelStatus {
        PUBLISHED, UNPUBLISHED, IN_PROGRESS
    }

    public Model() {
        this.model_data = new byte[] {};
        this.model_name = "None";
        this.description = "None";
        this.dir = null;
        this.status = ModelStatus.IN_PROGRESS;
        this.creation_date = LocalDate.now();
        this.author = "None";
        this.authorEmail = "None";
        favoredByUsers = new HashSet<>();
    }

    public Model(String model_name, String description, byte[] model_data, Directory dir, String author, String authorEmail) {
        this.model_data = model_data;
        this.model_name = model_name;
        this.description = description;
        this.dir = dir;
        this.status = ModelStatus.IN_PROGRESS;
        this.creation_date = LocalDate.now();
        this.author = author;
        this.authorEmail = authorEmail;
        favoredByUsers = new HashSet<>();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "model_id")
    private int model_id;

    @Column(name = "name")
    private String model_name;

    @Column(name = "description")
    private String description;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "model_data", length = 65000, columnDefinition = "BLOB")
    private byte[] model_data;

    @ManyToOne
    @JoinColumn(name = "contained_models")
    private Directory dir;

    @ManyToMany(mappedBy = "related_models")
    private Set<Reader> related_readers = Collections.emptySet();

    @Setter
    @Getter
    @Enumerated(EnumType.STRING)
    @Column(name="status")
    private ModelStatus status;

    @Getter
    @Column(name="creation_date")
    private LocalDate creation_date;

    @Getter
    @Column(name="author")
    private String author;

    @Getter
    @Column(name="author_email")
    private String authorEmail;

    @Getter
    @ManyToMany(mappedBy = "favoriteModels")
    private Set<User> favoredByUsers;

    @PreRemove
    private void removeAssociatedUsers() {
        for (User user : this.favoredByUsers) {
            user.getFavoriteModels().remove(this);
        }
    }

    public int getModelId() {
        return this.model_id;
    }

    public String getModelName() {
        return this.model_name;
    }

    public void setModelName(String newName) {
        this.model_name = newName;
    }

    public byte[] getModelData() {
        return this.model_data;
    }

    public void setModelData(byte[] newModelData) {
        this.model_data = newModelData;
    }

    public String getModelDataStr() {
        return new String(this.model_data);
    }

    public void addRelatedReader(Reader reader) {
        this.related_readers.add(reader);
    }

    public Set<Reader> getRelatedReaders() {
        return this.related_readers;
    }

    public boolean removeRelatedReader(Reader reader) {
        return this.related_readers.remove(reader);
    }

    public void clearRelatedReaders() {
        this.related_readers.clear();
    }

    public void clearSrcDir() {
        this.dir = null;
    }

    public String getModelDescription() {
        return this.description;
    }

    public void setModelDescription(String description) {
        this.description = description;
    }

    public int getDirINode() {
        return this.dir.getINode();
    }

    public void setDirINode(int inode) {
        this.dir.setINode(inode);
    }

    public Directory getDir() {
        return this.dir;
    }

    public void setDir(Directory dir) {
        this.dir = dir;
    }



}
