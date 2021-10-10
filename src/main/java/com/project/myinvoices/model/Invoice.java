package com.project.myinvoices.model;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Invoice {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	private String invoiceNumber;
	
	private String vessel;
	
	//Bill of lading number
	private String blNumber;
	
	//Container Number
	private String cntNumber;
	
	//Port of Loading
	private String pol;
	
	private String eta;
	
	//Port of Destination
	private String pod;
	
	private String volume;
	
	//USD to INR
	private double exchangeRate;
	
	private double totalcgst;
	
	private double totalsgst;
	
	private double totaligst;
	
	private double grossTotal;
	
	private double grandTotal;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonBackReference
	private Company company;
	
	@Temporal(TemporalType.DATE)
	private Date date;
	
	@OneToMany(mappedBy = "invoice")
	@JsonManagedReference
	private List<InvoiceDetails> invoiceDetails;
	
}
