package com.project.myinvoices.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class InvoiceDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	private String description;
	
	private double amountUSD;
	
	private double amountINR;
	
	private double rate;
	
	private double sgst;
	
	private double sgstRate;
	
	private double cgst;
	
	private double cgstRate;
	
	private double igst;
	
	private double igstRate;
	
	private String sacNumber;
	
	@ManyToOne
	@JsonBackReference
	private Invoice invoice;
	
}
