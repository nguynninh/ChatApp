# Build .jar
JAVA_HOME=$(/usr/libexec/java_home -v 21) mvn clean package -DskipTests

# Run .jar
JAVA_HOME=$(/usr/libexec/java_home -v 21) java -jar target/eureka-0.0.1-SNAPSHOT.jar