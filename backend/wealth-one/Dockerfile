# Start with a Java runtime as base
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Add a volume pointing to /tmp
VOLUME /tmp

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Copy the application's jar file to the container
# Your JAR will be in the target directory after building
COPY wealth-one/target/*.jar app.jar

# Run the jar file
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app/app.jar"]