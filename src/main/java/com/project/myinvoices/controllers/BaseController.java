package com.project.myinvoices.controllers;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.project.myinvoices.dao.InvoiceDAO;

import com.project.myinvoices.model.Invoice;

@Controller
@RequestMapping("/")
public class BaseController {

	@Autowired
	private InvoiceDAO invoiceDAO;
	
	@GetMapping("/")
	public String getHomePage()
	{
		return "index.html";
	}
	
	@GetMapping("/listInvoices")
	@ResponseBody
	public ArrayList<Invoice> listCompanies()
	{
		return invoiceDAO.listInvoices();
	}
	
	@GetMapping("/invoiceTest")
	public String getInvoiceTest()
	{
		return "InvoiceTest.html";
	}
}
