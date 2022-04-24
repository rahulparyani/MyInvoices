package com.project.myinvoices.repository;

import java.util.ArrayList;

import org.springframework.data.repository.CrudRepository;

import com.project.myinvoices.model.Invoice;

public interface InvoiceRepository extends CrudRepository<Invoice, Integer> {
	
	public ArrayList<Invoice> findAll();
	
	public Invoice getInvoiceById(int id);
	
	public Invoice findTopByOrderByIdDesc();
	
}
