package com.project.myinvoices.controllers;

import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.project.myinvoices.model.SacNumbers;
import com.project.myinvoices.service.SacNumbersService;

@Controller
@RequestMapping("/sac")
public class SacController {
	
	private Logger logger = LoggerFactory.getLogger(SacController.class);
	
	@Autowired
	public SacNumbersService sacNumbersService;

	@GetMapping("/viewSac")
	public String viewSac()
	{
		return "viewSac.html";
	}
	
	@GetMapping("/addSac")
	public String addSac()
	{
		return "addSac.html";
	}
	
	@PostMapping("/addSac")
	@ResponseBody
	public String addSac(@RequestBody SacNumbers sacNumbers)
	{
		sacNumbersService.addSac(sacNumbers);
		return "{\"msg\":\"Success\"}";
	}
	
	@PostMapping("/updateSac")
	@ResponseBody
	public SacNumbers updateSac(SacNumbers sacNumbers)
	{
		sacNumbersService.updateSac(sacNumbers);
		return sacNumbers;
	}
	
	@PostMapping("/deleteSac")
	@ResponseBody
	public String deleteSac(SacNumbers sacNumbers)
	{
		logger.info(sacNumbers.getDescription());
		sacNumbersService.deleteSac(sacNumbers);
		return "success";
	}
	
	@GetMapping("/listSac")
	@ResponseBody
	public ArrayList<SacNumbers> sacNumbers()
	{
		return sacNumbersService.listSac(); 
	}
	
}
