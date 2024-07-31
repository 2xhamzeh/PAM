package com.globalct.pam;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.boot.test.context.SpringBootTest;

class PamApplicationTests {

	@Test
	void contextLoads() {
		int foo = 42;
		assertEquals(foo, 42);
		assertFalse(foo == 420);
	}
}
