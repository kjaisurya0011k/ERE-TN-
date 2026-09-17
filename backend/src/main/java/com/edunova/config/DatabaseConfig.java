package com.edunova.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
@Profile("!dev")
@Slf4j
public class DatabaseConfig {

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/edunova}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:edunova}")
    private String username;

    @Value("${spring.datasource.password:edunova}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        String url = datasourceUrl != null ? datasourceUrl.trim() : "";
        String user = username;
        String pass = password;

        // Render provides DATABASE_URL in the format: postgres://user:password@hostname:port/database
        // HikariCP and the PostgreSQL JDBC driver require: jdbc:postgresql://hostname:port/database
        if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
            log.info("Detected postgres:// protocol in DATABASE_URL. Converting to standard JDBC format for Render compatibility.");
            try {
                URI uri = new URI(url);
                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":", 2);
                    user = userInfo[0];
                    if (userInfo.length > 1) {
                        pass = userInfo[1];
                    }
                }
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String host = uri.getHost();
                String path = uri.getPath();
                String query = uri.getQuery();

                url = "jdbc:postgresql://" + host + ":" + port + path + (query != null ? "?" + query : "");
            } catch (Exception e) {
                log.warn("Failed to parse database URI, using raw URL: {}", e.getMessage());
            }
        }

        config.setJdbcUrl(url);
        if (user != null && !user.isBlank()) {
            config.setUsername(user);
        }
        if (pass != null && !pass.isBlank()) {
            config.setPassword(pass);
        }
        config.setDriverClassName("org.postgresql.Driver");

        // Conservative connection pool settings tailored for Render free/starter PostgreSQL tiers
        config.setMaximumPoolSize(5);
        config.setMinimumIdle(2);
        config.setIdleTimeout(30000);
        config.setMaxLifetime(60000);
        config.setConnectionTimeout(30000);

        log.info("Configured production HikariCP DataSource for: {}", url.replaceAll(":.*@", ":***@"));
        return new HikariDataSource(config);
    }
}
