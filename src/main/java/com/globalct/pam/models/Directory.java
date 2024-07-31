package com.globalct.pam.models;

import jakarta.persistence.*;

import java.util.Collections;
import java.util.Set;

/**
 * The Directory class stores information relevant for a directory
 */
@Entity
@Table(name = "directory")
public class Directory {

    /**
     * A static counter, which keeps track which inode is the next one to be assigned to a new directory
     */
    public static int current_inode_counter = 1;

    /**
     * The inode of the Root-Directory
     */
    public final static int ROOT_DIR_INODE = 0;

    /**
     * The name of the Root-Directory
     */
    public final static String ROOT_DIR_NAME = "Home";

    /**
     * The Inode of the Directory
     */
    @Id
    @Column(name = "inode")
    private int inode;

    /**
     * The Inode of the Directory, this directory is in
     */
    @Column (name = "parent_inode")
    private int parent_inode;

    /**
     * The name of the Directory
     */
    private String name;

    /**
     * All Models which are contained in this directory
     */
    @OneToMany (cascade = CascadeType.ALL, mappedBy = "dir")
    private Set<Model> contained_models;

    /**
     * All Directories which are contained in this Directory
     */
    @OneToMany (cascade = CascadeType.ALL)
    private Set<Directory> contained_directories;

    /**
     * Default Constructor
     */
    public Directory() {}

    /**
     * Constructor which creates a Directory instance based on a given name and parent-directory-inode
     * @param parent_inode The Inode of the Parent Directory
     * @param name The name of the new Directory
     */
    public Directory(int parent_inode, String name) {

        this.inode = current_inode_counter;
        this.parent_inode = parent_inode;
        Directory.current_inode_counter += 1;
        this.name = name;

        this.contained_directories = Collections.emptySet();
        this.contained_models = Collections.emptySet();
    }

    /**
     * Constructor which creates a new Directory and sets it as the Root-Directory
     * @param as_root Whether the new directory should be the Root-Directory
     * @param parent_inode The Inode of the parent Directory
     * @param name The name of the new Directory
     */
    public Directory(boolean as_root, int parent_inode, String name) {
        this(parent_inode, name);
        if (as_root) {
            this.inode = ROOT_DIR_INODE;
            this.parent_inode = ROOT_DIR_INODE;
            this.name = ROOT_DIR_NAME;
        }

    }

    /**
     * Getter: Inode
     * @return The Inode of the Directory
     */
    public int getINode() {
        return this.inode;
    }

    /**
     * Setter: Inode
     * @param inode The new Inode of the Directory
     */
    public void setINode(int inode) {
        this.inode = inode;
    }

    /**
     * Getter: Parent Inode
     * @return The Parent-Directories Inode
     */
    public int getParentINode() {
        return this.parent_inode;
    }

    /**
     * Setter: Parent Inode
     * @param parent_inode The new Parents Inode
     */
    public void setParentINode(int parent_inode) {
        this.parent_inode = parent_inode;
    }

    /**
     * Getter: Contained Models
     * @return A Set of contained Models in this Directory
     */
    public Set<Model> getContainedModels() {
        return this.contained_models;
    }

    /**
     * Setter: Adds a Model to this Directory
     * @param model The Model which is to be added to this Directory
     */
    public void addContainedModel(Model model) {
        this.contained_models.add(model);
    }

    /**
     * Setter: Removes a Model from this Directory
     * @param model The Model which should be removed from this directory
     */
    public void removeContainedModel(Model model) {
        this.contained_models.remove(model);
    }

    /**
     * Setter: Adds a contained directory to this Directory
     * @param dir The Directory which should be added
     */
    public void addContainedDirectory(Directory dir) {
        this.contained_directories.add(dir);
    }

    /**
     * Getter: Contained Models
     * @return A Set of contained Directories
     */
    public Set<Directory> getContainedDirectories() {
        return this.contained_directories;
    }

    /**
     * Setter: Removes a contained Directory from this Directory
     * @param dir The Directory which should be removed
     */
    public void removeContainedDirectory(Directory dir) {
        this.contained_directories.remove(dir);
    }

    /**
     * Getter: Directory Name
     * @return The name of this Directory
     */
    public String getName() {
        return name;
    }

    /**
     * Setter: Directory Name
     * @param name The new name of this Directory
     */
    public void setName(String name) {
        this.name = name;
    }
}
