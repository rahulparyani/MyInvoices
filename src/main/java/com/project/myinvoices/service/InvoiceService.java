package com.project.myinvoices.service;

import java.util.ArrayList;

import com.project.myinvoices.model.CompanyInvoice;
import com.project.myinvoices.model.Invoice;
import com.project.myinvoices.model.InvoiceDetails;

public interface InvoiceService {
	
	public void saveInvoice(CompanyInvoice companyInvoice);
	
	public void updateInvoice(CompanyInvoice companyInvoice);
	
	public void deleteInvoice(int id);
	
	public ArrayList<Invoice> listInvoices();
	
	public Invoice getInvoiceById(int id);
	
	public void generateInvoice(CompanyInvoice companyInvoice);
	
	public void deleteInvoiceDetails (InvoiceDetails invoiceDetails);
	
}
