# Build stage (compile)
FROM eclipse-temurin:17-jdk-jammy as builder
WORKDIR /app
COPY . .
RUN ./mvnw clean package

# Runtime stage (lean)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/target/wealth-one-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]