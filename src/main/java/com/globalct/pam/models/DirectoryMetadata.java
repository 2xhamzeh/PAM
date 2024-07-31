package com.globalct.pam.models;

import lombok.Getter;

import java.io.Serializable;

/**
 * A Class containing the important Metadata of a Directory
 */
public class DirectoryMetadata implements Serializable {

    /**
     * Constructor
     * @param dir A Directory of which the Metadata is extracted
     */
    public DirectoryMetadata(Directory dir) {
        this.inode = dir.getINode();
        this.name = dir.getName();
        this.parent_inode = dir.getParentINode();
    }

    /**
     * The Inode of the Directory
     */
    public int inode;

    /**
     * The name of the Directory
     */
    @Getter
    public String name;

    /**
     * The parents Inode of the Directory
     */
    public int parent_inode;
}
