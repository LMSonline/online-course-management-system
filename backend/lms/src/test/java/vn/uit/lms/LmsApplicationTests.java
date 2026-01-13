package vn.uit.lms;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test") // Use H2 in-memory database for testing
class LmsApplicationTests {

	@Test
	void contextLoads() {
	}

}
