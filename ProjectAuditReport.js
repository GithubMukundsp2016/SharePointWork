var vMyProjects=[];
/*Get all projects that I have access to*/
function getMyProjects()
{
	document.title = ' PMO - Project Audit Report';
	$('#tblSelectedProjectsDiv').hide();
	var modalDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Please wait...', 'We are loading data for you...', 150, 350);
	$.ajax({ 
	   url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Repository')/Items?$select=ID,Email_x0020_Sent_x0020_Count,FileRef,Comments_x0020__x002F__x0020_Suggestions,Email_x0020_Users/Title,Assignment_x0020_Forms,Signed_x0020_SOW_x002F__x0020_Contract,Approved_x0020_PICF,Utilization_x0020_of_x0020_Portal,MOM,Reporting_x0020_Status_x0020_Report_x0020_to_x0020_client,RIC_x0020_Log,Project_x0020_Closure,Lessons_x0020_Learnt,CFF,Case_x0020_Study,ContentType,FileLeafRef,Title&$orderby=Modified desc&$filter=ContentType eq 'Folder'or ContentType eq 'New Project' &$expand=Email_x0020_Users/Title &$top=100000", 
	   type: "GET", 
	   headers: {"accept": "application/json;odata=verbose"}, 
	   success: function (data) { 
	      if (data.d.results) { 	      
	      	var results=data.d.results;
	         for(var i=0;i<data.d.results.length;i++)
	         {	//Getting only Level 2 projects list.	         		         	
	         	if(data.d.results[i].FileRef.split('/').length==6)
	         	{
	         		if(data.d.results[i].FileRef.split('/')[4].toLowerCase()=='spmo' || data.d.results[i].FileRef.split('/')[4].toLowerCase()=='transformation' || 
	         		data.d.results[i].FileRef.split('/')[4].toLowerCase()=='baos' || data.d.results[i].FileRef.split('/')[4].toLowerCase()=='genfour' || 
	         		data.d.results[i].FileRef.split('/')[4].toLowerCase()=='oracle')
		         	{
		         			continue;
		         	}
		         	if(data.d.results[i].Email_x0020_Users.results!=undefined)
	         		{
						var emailUserCount = data.d.results[i].Email_x0020_Users.results.length;
						var allUsers = '';
						for(var v=0;v<emailUserCount;v++)
						{
							allUsers += data.d.results[i].Email_x0020_Users.results[v].Title + ', ';
						}
					}
					else
					{
						allUsers = '';
					}
	         		vMyProjects.push({	 
	         		ID : results[i].ID,       		
	         		Name:results[i].FileRef.split('/')[5],
	         		SignedSOWContract:results[i].Signed_x0020_SOW_x002F__x0020_Contract,
	         		ApprovedPICF:results[i].Approved_x0020_PICF,
	         		AssignmentForms:results[i].Assignment_x0020_Forms,
	         		UtilizationofPortal:results[i].Utilization_x0020_of_x0020_Portal,
	         		MOM:results[i].MOM,
	         		ReportingStatus:results[i].Reporting_x0020_Status_x0020_Report_x0020_to_x0020_client,
	         		RICLogs:results[i].RIC_x0020_Log,
	         		ProjectClosure:results[i].Project_x0020_Closure,
	         		LessonsLearnt:results[i].Lessons_x0020_Learnt,
	         		CFF:results[i].CFF,
	         		CaseStudy:results[i].Case_x0020_Study,
	         		EmailUsers:allUsers,
	         		CommentsSuggestions:results[i].Comments_x0020__x002F__x0020_Suggestions,
	         		followupcount:results[i].Email_x0020_Sent_x0020_Count	         		
	         		});
	         	}
	         }
	         for(var j=0;j<vMyProjects.length;j++)
	         $('#tblAllProjects tbody').append('<tr><td>'+vMyProjects[j].Name+'</td><td>'+(vMyProjects[j].SignedSOWContract==null?'-':vMyProjects[j].SignedSOWContract)+'</td><td>'+(vMyProjects[j].ApprovedPICF==null?'-':vMyProjects[j].ApprovedPICF)+'</td><td>'+(vMyProjects[j].AssignmentForms==null?'-':vMyProjects[j].AssignmentForms)+'</td><td>'+(vMyProjects[j].UtilizationofPortal==null?'-':vMyProjects[j].UtilizationofPortal)+'</td><td>'+(vMyProjects[j].MOM==null?'-':vMyProjects[j].MOM)+'</td><td>'+(vMyProjects[j].ReportingStatus==null?'-':vMyProjects[j].ReportingStatus)+'</td><td>'+(vMyProjects[j].RICLogs==null?'-':vMyProjects[j].RICLogs)+'</td><td>'+(vMyProjects[j].ProjectClosure==null?'-':vMyProjects[j].ProjectClosure)+'</td><td>'+(vMyProjects[j].LessonsLearnt==null?'-':vMyProjects[j].LessonsLearnt)+'</td><td>'+(vMyProjects[j].CFF==null?'-':vMyProjects[j].CFF)+'</td><td>'+(vMyProjects[j].CaseStudy==null?'-':vMyProjects[j].CaseStudy)+'</td><td>'+vMyProjects[j].EmailUsers+'</td><td>'+(vMyProjects[j].CommentsSuggestions==null?'-':vMyProjects[j].CommentsSuggestions)+'</td><td>'+(vMyProjects[j].followupcount==null?'0':vMyProjects[j].followupcount)+'</td><td><img style="display:none;" class="imgFollowupClass" id="imgFollowup" src="../SiteAssets/images/EmailToUsers.jpg" height="auto" width="30!important" title="Send a follow up email." onclick="getItem('+vMyProjects[j].ID+')" /> <img id="imgEdit" src="../SiteAssets/images/Edit%20Icon.jpg" height="auto" width="30!important" title="Edit this project" onclick="EditProject('+vMyProjects[j].ID+')" /></td></tr>');
	        
		        $.ajax({
			    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups/getByName('PMO Owners')/Users?$filter=Id eq " + _spPageContextInfo.userId,
			    method: "GET",
			    headers: {
			        "Accept": "application/json; odata=verbose"
			    },
				    success: function(data) {
				        if (data.d.results[0] != undefined) {			            
				            $('.imgFollowupClass').show();
				        }				        
				        renderDataTable('tblAllProjects');
					    modalDialog.close();
				    }
				});		
	          
	      } 
	   }, 
	   error: function (xhr) { 
	      console.log(xhr.status + ': ' + xhr.statusText); 
	   } 
	});  
}
var emailSentCount = 0;

function getItem(id)
{
	var retVal = confirm("Follow up emails will be send to selected PM / TL and CC users. \n\nDo you want to continue?");
	if(retVal==true)
	{
		$.ajax({ 
		   url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Repository')/Items?$select=Title,Email_x0020_Sent_x0020_Count&$filter=ID eq "+id+"", 
		   type: "GET", 
		   headers: {"accept": "application/json;odata=verbose"}, 
		   success: function (data) { 
		      if (data.d.results) {         
		        
		        emailSentCount = data.d.results[0].Email_x0020_Sent_x0020_Count;
		        if(emailSentCount == null)
		        	emailSentCount = 0;
	            updateListItem(id); 
		        
		      } 
		   }, 
		   error: function (xhr) { 
		      console.log(xhr.status + ': ' + xhr.statusText); 
		   } 
		}); 
	}
}
/*Updated email sent count*/
function updateListItem(ID)
{
	var clientContext =  new SP.ClientContext.get_current();
    var oList = clientContext.get_web().get_lists().getByTitle('Repository');
    this.oListItem = oList.getItemById(ID);
    oListItem.set_item('Email_x0020_Sent_x0020_Count',(parseInt(emailSentCount) + 1));
    oListItem.set_item('SendEmailToUsers',true);    
    oListItem.update();
    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}		   
/*Email sent success*/
function onQuerySucceeded() {

    alert('Email sent!');
}

function onQueryFailed(sender, args) {

    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
/*Redirect to edit project*/
function EditProject(id)
{
	window.location.href= window.location.protocol + '//'+ window.location.host + '/sites/PMO/Repository/Forms/EditForm.aspx?ID='+id +'&Source='+window.location.protocol + '//'+ window.location.host +'/sites/PMO/SitePages/Project%20Audit%20Report.aspx';
}
/*Gets group names from Repository Group Master list*/
function getGroupMaster()
{
	$.ajax({ 
   url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Repository Group Master')/Items?$select=ID,Title,Order&$orderby=Order0", 
   type: "GET", 
   headers: {"accept": "application/json;odata=verbose"}, 
   success: function (data) { 
      if (data.d.results) { 
         var count = data.d.results.length;
	         for(var i=0;i<count;i++)
	         {
	         	addOptionToSelect('group',(data.d.results[i].ID),(data.d.results[i].Title));
	         }
	      } 
	   }, 
	   error: function (xhr) { 
	      console.log(xhr.status + ': ' + xhr.statusText); 
	   } 
	}); 
}
/*Adds option to the select*/
function addOptionToSelect(id,value,text)
{
	$('#'+id).append($('<option>', {
	    value: value,
	    text: text
	}));
}
var modalDialog;
var selectedProjects=null;
var groupProjects=[];

$("#group").change(function()
{  
	$('#tblAllProjectsDiv').hide();  
	var value = $('#group :selected').text();  
	getGroupProjects(value);  
});
/*Projects based on dropdown selection*/
function getGroupProjects(group)
{		
	if(group == 'All')
	{
		  $('#tblSelectedProjectsDiv').hide(); 
		  $('#tblAllProjectsDiv').show();		  
	}		
	else	
	{
		$('#tblAllProjectsDiv').hide();
		$('#tblSelectedProjectsDiv').show();		
		$("#tblSelectedProjects").dataTable().fnDestroy();
		groupProjects=[];
		  
		modalDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Please wait...', 'We are loading data for you...', 150, 350);
		var context = new SP.ClientContext.get_current();
		var web = context.get_web();
		var list = web.get_lists().getByTitle('Repository');
		var query = SP.CamlQuery.createAllItemsQuery();
		var foldername = 'Repository/'+group;
		query.set_folderServerRelativeUrl(foldername);
		allItems = list.getItems(query);
		context.load(allItems, 'Include(Title,ContentType,FileRef,ID,Email_x0020_Sent_x0020_Count,FileRef,Comments_x0020__x002F__x0020_Suggestions,Email_x0020_Users,Assignment_x0020_Forms,Signed_x0020_SOW_x002F__x0020_Contract,Approved_x0020_PICF,Utilization_x0020_of_x0020_Portal,MOM,Reporting_x0020_Status_x0020_Report_x0020_to_x0020_client,RIC_x0020_Log,Project_x0020_Closure,Lessons_x0020_Learnt,CFF,Case_x0020_Study,Title)');
		context.executeQueryAsync(Function.createDelegate(this, this.successGroup), Function.createDelegate(this, this.failed));
	}
}
/*Success - group selected*/
function successGroup()
{
	var itemCount=0;
	var ListEnumerator = this.allItems.getEnumerator();
	while(ListEnumerator.moveNext())
	{
		var currentItem = ListEnumerator.get_current();
		var _contentType = currentItem.get_contentType();
		if(currentItem.get_item('FileRef').split('/').length==6 && (_contentType.get_name()=='Folder' || _contentType.get_name()=='New Project'))
		{
         	if(currentItem.get_item('Email_x0020_Users')!=undefined)
     		{
				var emailUserCount = currentItem.get_item('Email_x0020_Users').length;
				var allUsers = '';
				for(var v=0;v<emailUserCount;v++)
				{
					allUsers += currentItem.get_item('Email_x0020_Users')[v].get_lookupValue()+ ', ';
				}
			}
			else
			{
				allUsers = '';
			}
			
     		groupProjects.push({	 
	     		ID : currentItem.get_item('ID'),       		
	     		Name:currentItem.get_item('FileRef').split('/')[5],
	     		SignedSOWContract:currentItem.get_item('Signed_x0020_SOW_x002F__x0020_Contract'),
	     		ApprovedPICF:currentItem.get_item('Approved_x0020_PICF'),
	     		AssignmentForms:currentItem.get_item('Assignment_x0020_Forms'),
	     		UtilizationofPortal:currentItem.get_item('Utilization_x0020_of_x0020_Portal'),
	     		MOM:currentItem.get_item('MOM'),
	     		ReportingStatus:currentItem.get_item('Reporting_x0020_Status_x0020_Report_x0020_to_x0020_client'),
	     		RICLogs:currentItem.get_item('RIC_x0020_Log'),
	     		ProjectClosure:currentItem.get_item('Project_x0020_Closure'),
	     		LessonsLearnt:currentItem.get_item('Lessons_x0020_Learnt'),
	     		CFF:currentItem.get_item('CFF'),
	     		CaseStudy:currentItem.get_item('Case_x0020_Study'),
	     		EmailUsers:allUsers,
	     		CommentsSuggestions:currentItem.get_item('Comments_x0020__x002F__x0020_Suggestions'),
	     		followupcount:currentItem.get_item('Email_x0020_Sent_x0020_Count')
     		});
		}			
	}
	
	$.ajax({
			    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups/getByName('PMO Owners')/Users?$filter=Id eq " + _spPageContextInfo.userId,
			    method: "GET",
			    headers: {
			        "Accept": "application/json; odata=verbose"
			    },
				    success: function(data) {
				    
				    	//clear previous array
						if($('#tblSelectedProjects tbody tr').length!=0)
						{
							$("#tblSelectedProjects tbody ").find("tr").remove();
						}
						for(var j=0;j<groupProjects.length;j++)
						{
						   $('#tblSelectedProjects tbody').append('<tr><td>'+groupProjects[j].Name+'</td><td>'+(groupProjects[j].SignedSOWContract==null?'-':groupProjects[j].SignedSOWContract)+'</td><td>'+(groupProjects[j].ApprovedPICF==null?'-':groupProjects[j].ApprovedPICF)+'</td><td>'+(groupProjects[j].AssignmentForms==null?'-':groupProjects[j].AssignmentForms)+'</td><td>'+(groupProjects[j].UtilizationofPortal==null?'-':groupProjects[j].UtilizationofPortal)+'</td><td>'+(groupProjects[j].MOM==null?'-':groupProjects[j].MOM)+'</td><td>'+(groupProjects[j].ReportingStatus==null?'-':groupProjects[j].ReportingStatus)+'</td><td>'+(groupProjects[j].RICLogs==null?'-':groupProjects[j].RICLogs)+'</td><td>'+(groupProjects[j].ProjectClosure==null?'-':groupProjects[j].ProjectClosure)+'</td><td>'+(groupProjects[j].LessonsLearnt==null?'-':groupProjects[j].LessonsLearnt)+'</td><td>'+(groupProjects[j].CFF==null?'-':groupProjects[j].CFF)+'</td><td>'+(groupProjects[j].CaseStudy==null?'-':groupProjects[j].CaseStudy)+'</td><td>'+groupProjects[j].EmailUsers+'</td><td>'+(groupProjects[j].CommentsSuggestions==null?'-':groupProjects[j].CommentsSuggestions)+'</td><td>'+(groupProjects[j].followupcount==null?'0':groupProjects[j].followupcount)+'</td><td><img style="display:none;" class="imgFollowupClass" id="imgFollowup" src="../SiteAssets/images/EmailToUsers.jpg" height="auto" width="30!important" title="Send a follow up email." onclick="getItem('+groupProjects[j].ID+')" /> <img id="imgEdit" src="../SiteAssets/images/Edit%20Icon.jpg" height="auto" width="30!important" title="Edit this project" onclick="EditProject('+groupProjects[j].ID+')" /></td></tr>');
						}
						
				        if (data.d.results[0] != undefined) {			            
				            $('.imgFollowupClass').show();
				        }								
						renderDataTable('tblSelectedProjects');
						modalDialog.close();    
				    }
				});	
}
function failed(sender, args) 
{
	console.log("failed. Message:" + args.get_message());
}
/*Builds datatable*/
function renderDataTable(id)
{
	selectedProjects = $('#'+id).DataTable( 
	{	         
		"aoColumnDefs": [
		  { 'bSortable': false, 'aTargets': [ 1 ] }
		],		        
	    dom: 'Blfrtip',		        
	    fixedColumns: {
	        leftColumns: 1,
	        rightColumns: 2
	    },
	    scrollX:true,
	    buttons: [
	    			{
				        extend: 'excel',
			            exportOptions: 
			            {
			               columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
			            }
		            }
	    ],
	    "lengthMenu": [[5, 10, 20, 25, -1], [5, 10, 20, 25, "All"]]
	} );
	
	$("span:contains('Excel')").html('Export to Excel');
}