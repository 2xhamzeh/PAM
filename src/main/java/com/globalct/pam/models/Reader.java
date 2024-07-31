package com.globalct.pam.models;

import jakarta.persistence.*;

import java.util.Collections;
import java.util.Set;

/**
 * This class stores data about a Reader and represents the Reader-Table in the Database
 */
@Entity
@Table (name = "reader", indexes = @Index(columnList = "azure_email"))
public class Reader {

    /**
     * Constructor: Initialized with none-value
     */
    public Reader() {
        this.azure_email = "None";
    }

    /**
     * Constructor: Creates a new Reader based on a mail
     * @param azure_email The mail of the Reader
     */
    public Reader (String azure_email) {
        this.azure_email = azure_email;
    }

    /**
     * The mail address of the Reader
     */
    @Id
    @Column(name="azure_email")
    private String azure_email;

    /**
     * All the models, the reader has access to
     */
    @ManyToMany (cascade = CascadeType.ALL)
    @JoinTable (name = "reader_model_relation",
            joinColumns = @JoinColumn(name="azure_email", referencedColumnName = "azure_email"),
            inverseJoinColumns = @JoinColumn(name = "model_id")
    )
    private Set<Model> related_models = Collections.emptySet();

    /**
     * Getter: The mail of the Reader
     * @return The mail of the Reader
     */
    public String getAzureEmail() {
        return this.azure_email;
    }

    /**
     * Setter: The mail if the Reader
     * @param email Sets the new Mail of a Reader
     */
    public void setAzureEmail(String email) {
        this.azure_email = email;
    }

    /**
     * Setter: Adds a Model to which the Reader has access to
     * @param model The new Model the Reader has access to
     */
    public void addRelatedModel(Model model) {
        this.related_models.add(model);
    }

    /**
     * Getter: Gets all Models the Reader has access to
     * @return The Models the reader has access to
     */
    public Set<Model> getRelatedModels() {
        return this.related_models;
    }

    /**
     * Setter: Removes a related Model
     * @param model The Model, the Reader no longer has access to
     * @return Whether the Reader had access to the Model
     */
    public boolean removeRelatedModel(Model model) {
        return this.related_models.remove(model);
    }
}
