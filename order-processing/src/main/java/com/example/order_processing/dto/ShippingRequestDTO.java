package com.example.order_processing.dto;

public class ShippingRequestDTO {

    private String businessId;      // your storefront registration ID
    private String address1;
    private String address2;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private int numPackets;
    private double weightPerPacket;

    public ShippingRequestDTO() {}

    public String getBusinessId() {
        return businessId;
    }

    public void setBusinessId(String businessId) {
        this.businessId = businessId;
    }

    public String getAddress1() {
        return address1;
    }

    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    public String getAddress2() {
        return address2;
    }

    public void setAddress2(String address2) {
        this.address2 = address2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public int getNumPackets() {
        return numPackets;
    }

    public void setNumPackets(int numPackets) {
        this.numPackets = numPackets;
    }

    public double getWeightPerPacket() {
        return weightPerPacket;
    }

    public void setWeightPerPacket(double weightPerPacket) {
        this.weightPerPacket = weightPerPacket;
    }
}