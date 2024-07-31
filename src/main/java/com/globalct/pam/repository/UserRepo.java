package com.globalct.pam.repository;

import com.globalct.pam.models.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepo extends CrudRepository<User, String> {
}
