package com.project.myinvoices.repository;

import org.springframework.data.repository.CrudRepository;

import com.project.myinvoices.model.InvoiceDetails;

public interface InvoiceDetailsRepository extends CrudRepository<InvoiceDetails, Integer> {

}
