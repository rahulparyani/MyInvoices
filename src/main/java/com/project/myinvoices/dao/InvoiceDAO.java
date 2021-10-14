package com.project.myinvoices.dao;

import java.util.ArrayList;

import com.project.myinvoices.model.Invoice;
import com.project.myinvoices.model.InvoiceDetails;

public interface InvoiceDAO {
	
	public void createInvoice(Invoice invoice);
	
	public ArrayList<Invoice> listInvoices();
	
	public void updateInvoice(Invoice invoice);
	
	public void deleteInvoice(Invoice invoice);
	
	public void saveInvoiceDetails(InvoiceDetails invoiceDetails);
	
}
