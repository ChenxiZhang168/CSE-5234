package com.example.order_processing.model;

public class PaymentInfo {
    // corresponds to payment_info.id – usually set/known by payment service
    private Long id;
    // holder_name, card_num, exp_date, cvv
    private String holderName;
    private String cardNum;
    private String expDate; // e.g. "05/27"
    private String cvv;

    public PaymentInfo() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHolderName() {
        return holderName;
    }

    public void setHolderName(String holderName) {
        this.holderName = holderName;
    }

    public String getCardNum() {
        return cardNum;
    }

    public void setCardNum(String cardNum) {
        this.cardNum = cardNum;
    }

    public String getExpDate() {
        return expDate;
    }

    public void setExpDate(String expDate) {
        this.expDate = expDate;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }
}