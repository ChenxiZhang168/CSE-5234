package com.example.inventory_management.repo;

import com.example.inventory_management.model.InventoryItem;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Plain JDBC-based repository for accessing the `item` table.
 *
 * This version is independent of Spring and is intended to be
 * used directly from an AWS Lambda handler.
 *
 * It expects the following environment variables to be set
 * in the Lambda configuration:
 *   - DB_URL       (e.g. jdbc:postgresql://host:5432/dbname)
 *   - DB_USERNAME  (database username)
 *   - DB_PASSWORD  (database password)
 */
public class InventoryRepository {

    private final String jdbcUrl;
    private final String username;
    private final String password;

    public InventoryRepository() {
        this.jdbcUrl = System.getenv("DB_URL");
        this.username = System.getenv("DB_USERNAME");
        this.password = System.getenv("DB_PASSWORD");

        try {
            // Load PostgreSQL driver explicitly (harmless if already loaded)
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new IllegalStateException("PostgreSQL JDBC driver not found on classpath", e);
        }
    }

    // Convenience constructor for tests or local usage.
    public InventoryRepository(String jdbcUrl, String username, String password) {
        this.jdbcUrl = jdbcUrl;
        this.username = username;
        this.password = password;
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new IllegalStateException("PostgreSQL JDBC driver not found on classpath", e);
        }
    }

    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(jdbcUrl, username, password);
    }

    /**
     * Returns all inventory items ordered by id.
     */
    public List<InventoryItem> findAll() {
        String sql = """
            SELECT id, item_number, name, description, available_quantity, unit_price
            FROM item
            ORDER BY id
            """;

        List<InventoryItem> items = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                items.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error querying all inventory items", e);
        }

        return items;
    }

    /**
     * Finds a single item by id.
     */
    public Optional<InventoryItem> findById(long id) {
        String sql = """
            SELECT id, item_number, name, description, available_quantity, unit_price
            FROM item
            WHERE id = ?
            """;

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRow(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error querying inventory item by id: " + id, e);
        }

        return Optional.empty();
    }

    /**
     * Finds items whose names match (case-insensitive) the provided substring.
     */
    public List<InventoryItem> findByName(String name) {
        String sql = """
            SELECT id, item_number, name, description, available_quantity, unit_price
            FROM item
            WHERE LOWER(name) LIKE LOWER(?)
            ORDER BY id
            """;

        List<InventoryItem> items = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, "%" + name + "%");

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    items.add(mapRow(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error querying inventory items by name: " + name, e);
        }

        return items;
    }

    private InventoryItem mapRow(ResultSet rs) throws SQLException {
        InventoryItem item = new InventoryItem();
        item.setId(rs.getLong("id"));
        item.setItemNumber(rs.getInt("item_number"));
        item.setName(rs.getString("name"));
        item.setDescription(rs.getString("description"));
        item.setAvailableQuantity(rs.getInt("available_quantity"));
        item.setUnitPrice(rs.getDouble("unit_price"));
        return item;
    }
}
