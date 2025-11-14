package com.example.order_processing.repo;

import com.example.order_processing.model.Order;
import com.example.order_processing.model.OrderItem;
import com.example.order_processing.model.ShippingInfo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for persisting orders directly to the database using JDBC.
 *
 * It assumes the following tables (as in your lab schema):
 *
 *  - customer_order
 *      (id BIGSERIAL PK,
 *       customer_name,
 *       customer_email,
 *       shipping_info_id_fk,
 *       payment_info_id_fk,
 *       status,
 *       created_at)
 *
 *  - customer_order_line_item
 *      (id BIGSERIAL PK,
 *       item_id,
 *       item_name,
 *       unit_price_at_purchase,
 *       quantity,
 *       customer_order_id_fk)
 *
 * Database connection details are read from environment variables:
 *  - DB_URL
 *  - DB_USER
 *  - DB_PASSWORD
 */
public class OrderRepository {

    private final String dbUrl;
    private final String dbUserName;
    private final String dbPassword;

    public OrderRepository() {
        this.dbUrl = System.getenv("DB_URL");
        this.dbUserName = System.getenv("DB_USERNAME");
        this.dbPassword = System.getenv("DB_PASSWORD");
    }

    public OrderRepository(String dbUrl, String dbUserName, String dbPassword) {
        this.dbUrl = dbUrl;
        this.dbUserName = dbUserName;
        this.dbPassword = dbPassword;
    }

    /**
     * Persist the order and its line items in a single transaction,
     * then return the generated order id as a confirmation number.
     */
    public String save(Order order) throws Exception {
        if (dbUrl == null || dbUserName == null || dbPassword == null) {
            throw new IllegalStateException("Database configuration missing: DB_URL, DB_USERNAME, DB_PASSWORD must be set as environment variables.");
        }

        Connection conn = null;
        try {
            conn = DriverManager.getConnection(dbUrl, dbUserName, dbPassword);
            conn.setAutoCommit(false);

            // 1) Insert into shipping_info if we have shipping info with a non-empty address1
            Long shippingInfoId = null;
            ShippingInfo shippingInfo = order.getShippingInfo();
            if (shippingInfo != null &&
                shippingInfo.getAddress1() != null &&
                !shippingInfo.getAddress1().isEmpty()) {
                shippingInfoId = insertShippingInfo(conn, order);
                order.setShippingInfoId(shippingInfoId);
            }

            // 2) Insert into customer_order
            long orderId = insertCustomerOrder(conn, order);
            insertLineItems(conn, orderId, order.getItems());

            conn.commit();

            order.setId(orderId);
            return String.valueOf(orderId);
        } catch (Exception ex) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ignored) {
                }
            }
            throw ex;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException ignored) {
                }
            }
        }
    }

    /**
     * Insert a row into shipping_info and return the generated id.
     *
     * Table shipping_info:
     *  (id BIGSERIAL PK,
     *   address1, address2, city, state, country, postal_code, email)
     *
     * For now we map from Order.shippingInfo:
     *  - address1, address2, city, state, country, postal_code
     *  - email (falling back to order.getCustomerEmail() if null)
     */
    private long insertShippingInfo(Connection conn, Order order) throws SQLException {
        String sql = "INSERT INTO shipping_info " +
                     "(address1, address2, city, state, country, postal_code, email) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ShippingInfo info = order.getShippingInfo();

            // address fields from ShippingInfo (may be null if not provided)
            ps.setString(1, info != null ? info.getAddress1() : null);
            ps.setString(2, info != null ? info.getAddress2() : null);
            ps.setString(3, info != null ? info.getCity() : null);
            ps.setString(4, info != null ? info.getState() : null);
            ps.setString(5, info != null ? info.getCountry() : null);
            ps.setString(6, info != null ? info.getPostalCode() : null);
            ps.setString(7, order.getCustomerEmail());

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getLong(1);
                } else {
                    throw new SQLException("Failed to retrieve generated shipping_info ID.");
                }
            }
        }
    }

    private long insertCustomerOrder(Connection conn, Order order) throws SQLException {
        String sql = "INSERT INTO customer_order " +
                     "(customer_name, customer_email, shipping_info_id_fk, payment_info_id_fk, status, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";

        try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, order.getCustomerName());
            ps.setString(2, order.getCustomerEmail());

            // shipping_info_id_fk (nullable for now)
            if (order.getShippingInfoId() != null) {
                ps.setLong(3, order.getShippingInfoId());
            } else {
                ps.setNull(3, java.sql.Types.BIGINT);
            }

            // payment_info_id_fk
            if (order.getPaymentInfoId() != null) {
                ps.setLong(4, order.getPaymentInfoId());
            } else {
                ps.setNull(4, java.sql.Types.BIGINT);
            }

            ps.setString(5, order.getStatus() != null ? order.getStatus() : "New");

            LocalDateTime createdAt = order.getCreatedAt();
            if (createdAt == null) {
                createdAt = LocalDateTime.now();
            }
            ps.setTimestamp(6, Timestamp.valueOf(createdAt));

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getLong(1);
                } else {
                    throw new SQLException("Failed to retrieve generated order ID.");
                }
            }
        }
    }

    private void insertLineItems(Connection conn, long orderId, List<OrderItem> items) throws SQLException {
        if (items == null || items.isEmpty()) {
            return;
        }

        String sql = "INSERT INTO customer_order_line_item " +
                     "(item_id, item_name, unit_price_at_purchase, quantity, customer_order_id_fk) " +
                     "VALUES (?, ?, ?, ?, ?)";

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            for (OrderItem item : items) {
                if (item.getItemId() != null) {
                    ps.setLong(1, item.getItemId());
                } else {
                    ps.setNull(1, java.sql.Types.BIGINT);
                }

                ps.setString(2, item.getItemName());
                ps.setBigDecimal(3, java.math.BigDecimal.valueOf(item.getUnitPriceAtPurchase()));
                ps.setInt(4, item.getQuantity());
                ps.setLong(5, orderId);

                ps.addBatch();
            }
            ps.executeBatch();
        }
    }
}