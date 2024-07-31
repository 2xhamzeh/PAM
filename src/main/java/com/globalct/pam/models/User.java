package com.globalct.pam.models;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user")
public class User {

    @Id
    @Getter
    @Column(name = "email")
    private String email;  // Using 'sub' as the primary key

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(
            name = "user_favorites",
            joinColumns = @JoinColumn(name = "email", referencedColumnName = "email"),  // Reference 'sub' here
            inverseJoinColumns = @JoinColumn(name = "model_id", referencedColumnName = "model_id")
    )
    private Set<Model> favoriteModels;

    public User() {
        this.favoriteModels = new HashSet<>();
    }

    public User(String email) {
        this.email = email;
        this.favoriteModels = new HashSet<>();
    }

    public Set<Model> getFavoriteModels() {
        return favoriteModels;
    }

    public void addFavoriteModel(Model model) {
        model.getFavoredByUsers().add(this);
        this.favoriteModels.add(model);
    }

    public boolean removeFavoriteModel(Model model) {
        model.getFavoredByUsers().remove(this);
        return this.favoriteModels.remove(model);
    }

}
