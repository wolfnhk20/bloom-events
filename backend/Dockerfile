# Use Java 17 runtime
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Build the project
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

# Expose port (Render will override with PORT env)
EXPOSE 8080

# Run the app
CMD ["sh", "-c", "java -jar target/*.jar"]