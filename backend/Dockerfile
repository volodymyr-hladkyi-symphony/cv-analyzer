# Multi-stage build for Spring Boot application
FROM maven:3.9.6 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-slim

# Set working directory
WORKDIR /app

# Copy the built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Copy resources (CVs and prompts)
COPY --from=build /app/src/main/resources/cvs ./cvs
COPY --from=build /app/src/main/resources/prompts ./prompts

# Expose port
EXPOSE 8080

# Set environment variables
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Run the application (profile will be set via environment variables)
ENTRYPOINT ["java","-jar","app.jar"]
