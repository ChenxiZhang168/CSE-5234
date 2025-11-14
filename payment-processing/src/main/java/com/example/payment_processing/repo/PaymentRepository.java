package com.example.payment_processing.repo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Statement;

import com.example.payment_processing.model.PaymentInfo;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Repository for persisting payment info into the payment_info table.
 *
 * Table:
 *  payment_info (
 *      id BIGSERIAL PRIMARY KEY,
 *      holder_name VARCHAR(255),
 *      card_num    VARCHAR(25),
 *      exp_date    VARCHAR(10),
 *      cvv         VARCHAR(4)
 *  )
 *
 * Uses env vars:
 *  - DB_URL
 *  - DB_USER
 *  - DB_PASSWORD
 */
public class PaymentRepository {

    private final String dbUrl;
    private final String dbUserName;
    private final String dbPassword;

    public PaymentRepository() {
        this.dbUrl = System.getenv("DB_URL");
        this.dbUserName = System.getenv("DB_USERNAME");
        this.dbPassword = System.getenv("DB_PASSWORD");
    }

    public PaymentRepository(String dbUrl, String dbUserName, String dbPassword) {
        this.dbUrl = dbUrl;
        this.dbUserName = dbUserName;
        this.dbPassword = dbPassword;
    }

    /**
     * Inserts a record into payment_info and returns the generated id.
     */
    public Long save(PaymentInfo info) throws Exception {
        if (dbUrl == null || dbUserName == null || dbPassword == null) {
            throw new IllegalStateException(
                    "Database configuration missing: DB_URL, DB_USER, DB_PASSWORD must be set as environment variables.");
        }

        String sql = "INSERT INTO payment_info (holder_name, card_num, exp_date, cvv) " +
                     "VALUES (?, ?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(dbUrl, dbUserName, dbPassword);
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, info.getHolderName());
            ps.setString(2, info.getCardNum());
            ps.setString(3, info.getExpDate());
            ps.setString(4, info.getCvv());

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getLong(1);
                } else {
                    throw new SQLException("Failed to retrieve generated payment_info id.");
                }
            }
        }
    }
}