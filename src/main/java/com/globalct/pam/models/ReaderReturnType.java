package com.globalct.pam.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


/**
 * A Class used to send reader info via HTTP
 */
public class ReaderReturnType implements Serializable {

    /**
     * Default Constructor: Initializes values to invalid values
     */
    public ReaderReturnType() {
        this.azure_email = "None";
        related_models = new ArrayList<>();
    }

    /**
     * Constructor: Based on values directly
     * @param azureEmail The Mail of the Reader
     */
    public ReaderReturnType(String azureEmail) {
        azure_email = azureEmail;
        related_models = new ArrayList<>();

    }

    /**
     * Constructor: Extracts info from a Reader
     * @param reader The Reader, from which information is to be extracted
     */
    public ReaderReturnType(Reader reader) {
        this.azure_email = reader.getAzureEmail();

        related_models = new ArrayList<>();
        for (Model model : reader.getRelatedModels()) {
            related_models.add(model.getModelId());
        }
    }


    /**
     * The Mail of the Reader
     */
    private String azure_email;

    /**
     * The Models, the Reader has access to
     */
    private List<Integer> related_models;

    /**
     * Getter: The Mail of the Reader
     * @return The Mail of the Reader
     */
    public String getAzureEmail() {
        return azure_email;
    }

    /**
     * Setter: Sets the Mail of the Reader
     * @param azure_email The new Mail of the Reader
     */
    public void setAzureEmail(String azure_email) {
        this.azure_email = azure_email;
    }

    /**
     * Getter: Gets all related Models of the Reader
     * @return All related Model-IDs of the Reader
     */
    public List<Integer> getRelatedModels() {
        return related_models;
    }

    /**
     * Setter: Adds a Related Model-ID to this Reader
     * @param related_model_id The new Model-ID, the Reader has access to
     */
    public void addRelatedModelId(Integer related_model_id) {
        this.related_models.add(related_model_id);
    }
}
