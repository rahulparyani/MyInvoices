package com.project.myinvoices.model;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyInvoice {
	
	private Invoice invoice;
	
	@JsonBackReference
	private Company company;
	
	private ArrayList<InvoiceDetails> invoiceDetails;

}
