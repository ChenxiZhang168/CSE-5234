package com.example.inventory.repos;

import com.example.inventory.model.InventoryItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class InventoryRepository {

    private final JdbcTemplate jdbcTemplate;

    public InventoryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final RowMapper<InventoryItem> INVENTORY_ITEM_ROW_MAPPER =
            (rs, rowNum) -> new InventoryItem(
                    rs.getLong("id"),
                    rs.getInt("item_number"),
                    rs.getString("name"),
                    rs.getString("description"),
                    rs.getInt("available_quantity"),
                    rs.getBigDecimal("unit_price").doubleValue()
            );

    public List<InventoryItem> findAll() {
        String sql = """
            SELECT id, item_number, name, description, available_quantity, unit_price
            FROM item
            ORDER BY id
            """;
        return jdbcTemplate.query(sql, INVENTORY_ITEM_ROW_MAPPER);
    }

    public Optional<InventoryItem> findById(long id) {
        String sql = """
            SELECT id, item_number, name, description, available_quantity, unit_price
            FROM item
            WHERE id = ?
            """;
        return jdbcTemplate.query(sql, INVENTORY_ITEM_ROW_MAPPER, id)
                           .stream()
                           .findFirst();
    }

    public List<InventoryItem> findByName(String name) {
        String sql = """
            SELECT id, item_number, name, description, available_quantity, unit_price
            FROM item
            WHERE LOWER(name) LIKE LOWER(?)
            ORDER BY id
            """;
        return jdbcTemplate.query(sql, INVENTORY_ITEM_ROW_MAPPER, "%" + name + "%");
    }
}