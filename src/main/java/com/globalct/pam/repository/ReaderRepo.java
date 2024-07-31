package com.globalct.pam.repository;

import com.globalct.pam.models.Reader;
import org.springframework.data.repository.CrudRepository;


/**
 * The Reader-Table which is responsible for the connection with the Database
 */
public interface ReaderRepo extends CrudRepository<Reader, String> {}
