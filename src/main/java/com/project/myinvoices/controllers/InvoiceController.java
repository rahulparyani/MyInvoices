package com.project.myinvoices.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


import com.project.myinvoices.dao.InvoiceDAO;
import com.project.myinvoices.model.CompanyInvoice;
import com.project.myinvoices.model.Invoice;

@Controller
@RequestMapping("/invoice")
public class InvoiceController {
	
	@Autowired
	private InvoiceDAO invoiceDAO;
	
	@GetMapping("/createInvoice")
	public String createInvoice()
	{
		return "/invoice/CreateInvoice.html";
	}
	
	@GetMapping("/viewInvoices")
	public String viewInvoices()
	{
		return "/invoice/ViewInvoices.html";
	}
	
	@PostMapping("/saveInvoice")
	@ResponseBody
	public String saveInvoice(@RequestBody CompanyInvoice companyInvoice)
	{	
		Invoice invoice = companyInvoice.getInvoice();
		invoice.setCompany(companyInvoice.getCompany());
		System.out.println(invoice.getExchangeRate());
		invoiceDAO.createInvoice(invoice);
		return "Success";
	}
	
}
