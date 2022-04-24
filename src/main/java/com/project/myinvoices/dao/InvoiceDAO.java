package com.project.myinvoices.dao;

import java.util.ArrayList;

import com.project.myinvoices.model.Invoice;
import com.project.myinvoices.model.InvoiceDetails;

public interface InvoiceDAO {
	
	public void createInvoice(Invoice invoice);
	
	public ArrayList<Invoice> listInvoices();
	
	public void updateInvoice(Invoice invoice);
	
	public void deleteInvoice(int id);
	
	public void saveInvoiceDetails(InvoiceDetails invoiceDetails);
	
	public Invoice getInvoiceById(int id);
	
	public void deleteInvoiceDetails (InvoiceDetails invoiceDetails);
	
	public Invoice getLastInvoice();
	
}
