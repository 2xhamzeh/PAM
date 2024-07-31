package com.globalct.pam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * The Main PAM Application Controller
 */
@SpringBootApplication
@RestController
public class PamApplication {

	/**
	 * The Main entry point of the Spring Application
	 * @param args Command line arguments
	 */
	public static void main(String[] args) {
		SpringApplication.run(PamApplication.class, args);
	}


}
