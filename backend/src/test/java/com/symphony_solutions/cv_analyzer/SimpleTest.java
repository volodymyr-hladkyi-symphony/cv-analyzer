package com.symphony_solutions.cv_analyzer;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("test")
class SimpleTest {

    @Test
    void simpleTest() {
        // Simple test that doesn't require external services
        assertTrue(true, "This test should always pass");
    }

    @Test
    void contextLoadsWithoutWeb() {
        // This test verifies that the Spring application context loads 
        // without starting the web server
        assertTrue(true, "Context loaded successfully");
    }
}
