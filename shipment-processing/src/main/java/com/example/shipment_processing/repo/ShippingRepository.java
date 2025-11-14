package com.example.shipment_processing.repo;

import com.example.shipment_processing.dto.ShippingRequestDTO;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

/**
 * Persists shipping requests into shipment_request table.
 * Uses env vars: DB_URL, DB_USERNAME, DB_PASSWORD (for shipping DB).
 */
public class ShippingRepository {

    private final String dbUrl;
    private final String dbUserName;
    private final String dbPassword;

    public ShippingRepository() {
        this.dbUrl = System.getenv("DB_URL");
        this.dbUserName = System.getenv("DB_USERNAME");
        this.dbPassword = System.getenv("DB_PASSWORD");
    }

    public String save(ShippingRequestDTO dto) throws Exception {
        if (dbUrl == null || dbUserName == null || dbPassword == null) {
            throw new IllegalStateException(
                    "DB_URL, DB_USERNAME, DB_PASSWORD must be set for shipping service.");
        }

        String token = UUID.randomUUID().toString();

        String sql = "INSERT INTO shipment_request " +
                "(business_id, address1, address2, city, state, country, postal_code, " +
                " num_packets, weight_per_packet, token) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(dbUrl, dbUserName, dbPassword);
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, dto.getBusinessId());
            ps.setString(2, dto.getAddress1());
            ps.setString(3, dto.getAddress2());
            ps.setString(4, dto.getCity());
            ps.setString(5, dto.getState());
            ps.setString(6, dto.getCountry());
            ps.setString(7, dto.getPostalCode());
            ps.setInt(8, dto.getNumPackets());
            ps.setBigDecimal(9, java.math.BigDecimal.valueOf(dto.getWeightPerPacket()));
            ps.setString(10, token);

            ps.executeUpdate();

            // we don't actually need the generated id; token is what we return
            return token;
        }
    }
}