$(document).ready(function(){
		      
    	var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/company/listCompanies"
                },
            },
            pageSize: 10,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        name: {},
                        address: {},
                        city:{},
                        state: {},
                        country:{},
                        gstNumber:{}
                    }
                }
            }
        })
    	
    	var dataSac = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/sac/listSac"
                },
            },
            pageSize: 10,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        description: {},
                        sacNumber: {},
                        sgst:{},
                        cgst: {},
                        igst:{}
                    }
                }
            }
        })
    	
    	
    	$("#companyName").kendoAutoComplete({
        	dataSource: dataSource,
        	dataTextField: "name",
        	change: onChange,
        	select: onSelect
        })
        
        function onChange(e) {
    		// clear text box values if cleared
    		if ($("#companyName").val()=='')
    		{
    			$("#address").val('')
    			$("#city").val('')
    			$("#state").val('')
    			$("#country").val('')
    			$("#gstNumber").val('')
    		}
        }
    	
    	$("#invoiceDetails").on("change", ".amountUSD", function(){
			
    		var id = $(this).attr('id').split('-')
    		var usd = $("#amountUSD-"+id[1]).val();
    		var exchangeRate = $("#exchangeRate").val()
    		var inr = usd * exchangeRate;
    		$("#amountINR-"+id[1]).val(inr).change()
    		
    	})
        
        function onSelect(e) {
        	//set text box values on select fetching data from event object
    		$("#address").val(e.dataItem.address)
    		$("#city").val(e.dataItem.city)
    		$("#state").val(e.dataItem.state).change();
    		$("#country").val(e.dataItem.country)
    		$("#gstNumber").val(e.dataItem.gstNumber)
        }
        
        function init_autoComplete(x)
        {	
        	$("#description-"+x).kendoAutoComplete({
             	dataSource: dataSac,
             	dataTextField: "description",
             	select: selectDescription,
             	change: onChangeDescription
             })      
        }
        
        function selectDescription(e)
        {
        	//collect "id" from event and fill in the values
        	var id = e.sender.element[0].id.split("-")
        	$("#sacNumber-"+id[1]).val(e.dataItem.sacNumber)
        	$("#sgstRate-"+id[1]).val(e.dataItem.sgst)
        	$("#cgstRate-"+id[1]).val(e.dataItem.cgst)
        	$("#igstRate-"+id[1]).val(e.dataItem.igst)
        }
        
        function onChangeDescription(e)
        {
        	var id = e.sender.element[0].id.split("-")
			if($("#description-"+id[1]).val() == '')
			{
				$("#sacNumber-"+id[1]).val('')
	        	$("#sgstRate-"+id[1]).val('')
	        	$("#cgstRate-"+id[1]).val('')
	        	$("#igstRate-"+id[1]).val('')								
			}
        }
        
        $("#invoiceDetails").on('change', '.amountINR', function(){
        	var id = $(this).attr('id').split('-')
        	var amountINR = $("#amountINR-"+id[1]).val()
        	var sgstRate = $("#sgstRate-"+id[1]).val()
        	var cgstRate = $("#cgstRate-"+id[1]).val()
        	var igstRate = $("#cgstRate-"+id[1]).val()
        	var total = 0;
        	var totalsgst = 0;
        	var totalcgst = 0;
        	
        	if ($("#state").val() == "Gujarat")
        	{
				$("#sgst-"+id[1]).val(amountINR * (sgstRate / 100)).change()
				$("#cgst-"+id[1]).val(amountINR * (cgstRate / 100)).change()
        	}
        	else
        	{
        		        		
        	}
        	
        	$('.amountINR').each(function(index, element) {
                var val = parseFloat($(element).val());
                if( !isNaN( val )){
                   total += val;
                }
            });
        	
        	$('.sgst').each(function(index, element) {
                var val = parseFloat($(element).val());
                if( !isNaN( val )){
                   totalsgst += val;
                }
            });
        	
        	$('.cgst').each(function(index, element) {
                var val = parseFloat($(element).val());
                if( !isNaN( val )){
                   totalcgst += val;
                }
            });
            
        	$('#totalsgst').val(totalsgst);
        	
        	$('#totalcgst').val(totalcgst);
        	
        	$("#grossTotal").val(total).change()
        	
        })
        
        $("#grossTotal").on('change', calculateGrandTotal)
        
        function calculateGrandTotal(e)
        {
        	var grandTotal = 0, totalsgst =0 , totalcgst = 0, totaligst = 0, grossTotal = 0;
        	
        	grossTotal = parseFloat($("#grossTotal").val())
        	
        	if($("#state").val()=="Gujarat"){
        		totalsgst = parseFloat($("#totalsgst").val())
        		totalcgst = parseFloat($("#totalcgst").val())
        		grandTotal = grossTotal + totalsgst + totalcgst;
        	}
        	else{
        		totaligst = parseFloat($("#totaligst").val())
        		grandTotal = grossTotal + totaligst;
        	}
        	$("#grandTotal").val(grandTotal)
        }

        
        $("#state").on('change', function(){
        	// if state is gujarat SGST and CGST will be applicable    	
        	if ($("#state").val() == "Gujarat")
            {
        		
        		if ($.fn.DataTable.isDataTable( '#invoiceDetails' ))
            	{
        			//drop dataDatable if already initialized
            		$("#invoiceDetails").DataTable().clear().destroy();
            	}
        		$("#taxBlock").html('<div class="form-group"> <label class="control-label col-md-2 col-sm-3 col-xs-12 col-md-offset-3">SGST:</label> <div class="col-md-2 col-xs-12"> <input type="number" class="form-control" id="totalsgst" name="address" readonly="readonly" placeholder="Total SGST"> </div></div><div class="form-group"> <label class="control-label col-md-2 col-sm-3 col-xs-12 col-md-offset-3">CGST:</label> <div class="col-md-2 col-xs-12"> <input type="number" class="form-control" id="totalcgst" name="address" readonly="readonly" placeholder="Total CGST"> </div></div>')
            	$("#invoiceDetails").html("<thead><th style='width:10px'>Sr No.</th><th>Description</th><th style='width:60px'>SAC Number</th><th style='width:45px'>SGST Rate <span class='fa fa-percent'></span></th><th style='width:50px'>SGST <span class='fa fa-inr'></span></th><th style='width:45px'>CGST Rate <span class='fa fa-percent'></th><th style='width:50px'>CGST <span class='fa fa-inr'></span></th><th style='width:100px'>Amount USD</th><th style='width:100px'>Amount INR</th></thead>");
            	var count = 1;
                var invoiceDetails = $("#invoiceDetails").DataTable({
                	dom: 'Bfrtip',
                	"searching": false,
                	buttons: [
                		{
                            text: 'Add Row',
                            action: function ( e, dt, node, config ) {
                            	this.row.add([
                					count,
                					'<input type="text" class="description" id="description-'+ count + '"/>',
                					'<input type="text" class="form-control" id="sacNumber-' + count + '" >',
                					'<input type="text" readonly class="form-control" id="sgstRate-' + count + '" >',
                					'<input type="text" readonly class="form-control sgst" id="sgst-' + count + '" >',
                					'<input type="text" readonly class="form-control" id="cgstRate-' + count + '" >',
                					'<input type="text" readonly class="form-control cgst" id="cgst-' + count + '" >',
                					'<input type="number" class="form-control amountUSD" id="amountUSD-' + count + '" >',
                					'<input type="number" class="form-control amountINR" id="amountINR-'	+ count + '">'
                				]).draw();
                            	//initialize autocomplete on description
                            	//console.log("inside datatable" + count)
                            	init_autoComplete(count);
                				count++; 
                            }
                        }
                	]
                });
            }
            else
            {
            	// else IGST will be applicable
            	if ($.fn.DataTable.isDataTable( '#invoiceDetails' ))
            	{
            		//drop dataDatable if already initialized
            		$("#invoiceDetails").DataTable().clear().destroy();
            	}
            	
            	$("#taxBlock").html('<div class="form-group"> <label class="control-label col-md-2 col-sm-3 col-xs-12 col-md-offset-3">IGST:</label> <div class="col-md-2 col-xs-12"> <input type="number" class="form-control" id="totaligst" name="address" readonly="readonly" placeholder="Total IGST" > </div></div>')
            	
            	$("#invoiceDetails").html("<thead><th style='width:10px'>Sr No.</th><th>Description</th><th>SAC Number</th><th>IGST <span class='fa fa-percent'></span></th><th>Amount USD</th><th>Amount INR</th></thead>");
            	var count = 1;
                var invoiceDetails = $("#invoiceDetails").DataTable({
                	dom: 'Bfrtip',
                	"searching": false,
                	buttons: [
                		{
                            text: 'Add Row',
                            action: function ( e, dt, node, config ) {
                            	this.row.add([
                					count,
                					'<input type="text" class="description" id="description-'+ count + '"/>',
                					'<input type="text" class="form-control" id="sacNumber-' + count + '" >',
                					'<input type="text" class="form-control" id="igst-' + count + '" >',
                					'<input type="number" class="form-control amountUSD" id="amountUSD-' + count + '" >',
                					'<input type="number" class="form-control amountINR" id="amountINR-'	+ count + '">'
                				]).draw();
                            	//initialize autocomplete on description
								init_autoComplete(count);
                				count++; 
                            }
                        }
                	]
                });
            }
        })
        
    })