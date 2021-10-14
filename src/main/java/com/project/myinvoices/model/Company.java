package com.project.myinvoices.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;


import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Company {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	private String name;
	
	private String address;
	
	private String city;
	
	private String state;
	
	private String country;
	
	private String gstNumber;

	@OneToMany( mappedBy = "company", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Invoice> invoices;
	
}
