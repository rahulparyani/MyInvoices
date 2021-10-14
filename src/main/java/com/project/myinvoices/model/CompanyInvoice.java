package com.project.myinvoices.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyInvoice {
	
	private Invoice invoice;
	
	@JsonBackReference
	private Company company;
	
	private InvoiceDetails[] invoiceDetails;

}
