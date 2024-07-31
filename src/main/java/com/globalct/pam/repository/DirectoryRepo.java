package com.globalct.pam.repository;

import com.globalct.pam.models.Directory;
import org.springframework.data.repository.CrudRepository;

/**
 * The Directory-Table which is responsible for the connection with the Database
 */
public interface DirectoryRepo extends CrudRepository<Directory, Integer> { }
