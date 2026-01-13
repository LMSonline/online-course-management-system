package vn.uit.lms;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test") // Use H2 in-memory database for testing
@EnableAutoConfiguration(exclude = FlywayAutoConfiguration.class) // Disable Flyway migrations
class LmsApplicationTests {

	@Test
	void contextLoads() {
	}

}
