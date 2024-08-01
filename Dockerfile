FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /opt/app
COPY gradle/ gradle
COPY gradlew build.gradle settings.gradle ./
COPY ./src ./src
RUN ./gradlew clean bootJar

FROM eclipse-temurin:17-jre-jammy
WORKDIR /opt/app
EXPOSE 8080
COPY --from=builder /opt/app/build/libs/*.jar /opt/app/app.jar
ENTRYPOINT ["java", "-Dspring.profiles.active=production", "-jar", "/opt/app/app.jar"]
