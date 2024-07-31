package com.globalct.pam.models;


import java.io.Serializable;

/**
 * A type used to transfer Client Info to the Client via HTTP
 */
public class ClientInfo implements Serializable {

    /**
     * The Full name of the User
     */
    public String name;

    /**
     * The PAM-Role of the User
     */
    public String role;
}
