package com.project.myinvoices.repository;

import java.util.ArrayList;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.project.myinvoices.model.SacNumbers;

@Repository
public interface SacNumbersRepository extends CrudRepository<SacNumbers, Integer> {

	public ArrayList<SacNumbers> findAll();
	
}
