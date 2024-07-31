package com.globalct.pam.models;

import lombok.Getter;

import java.io.Serializable;

/**
 * This type is used to send info af a Model via HTTP
 */
@Getter
public class ModelReturnType implements Serializable {

    /**
     * Default Constructor
     * initializes the Type with invalid values
     */
    public ModelReturnType() {
        this.id = -1;
        this.name = "";
        this.data = "";
    }

    /**
     * Constructor: Directly sets values
     * @param id The ID of the Model
     * @param name The name of the Model
     * @param data The Data of the Model
     */
    public ModelReturnType(int id, String name, String data) {
        this.id = id;
        this.name = name;
        this.data = data;
    }

    /**
     * Constructor: Extracts important infos from a Model
     * @param model The Model from which infos is to be extracted
     */
    public ModelReturnType(Model model) {
        this.id = model.getModelId();
        this.name = model.getModelName();

        if (model.getModelData() != null) {
            this.data = new String(model.getModelData());
        }
    }

    /**
     * The ID of the Model
     */
    private int id;

    /**
     * The name of the Model
     */
    private String name;

    /**
     * The Data of the Model
     */
    private String data;

    /**
     * Setter: ID of the Model
     * @param id The new ID of the Model
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Setter: Name of the Model
     * @param name The new name of the Model
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Setter: Data of the Model
     * @param data The new Data of the Model
     */
    public void setData(String data) {
        this.data = data;
    }
}


