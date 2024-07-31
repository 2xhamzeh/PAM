package com.globalct.pam.repository;

import com.globalct.pam.models.Model;
import org.springframework.data.repository.CrudRepository;

import java.util.List;


/**
 * The Model-Table which is responsible for the connection with the Database
 */
public interface ModelRepo extends CrudRepository<Model, Integer> {
    List<Model> findByAuthorEmail(String authorEmail);
}
