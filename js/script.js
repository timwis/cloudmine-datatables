var ws = new cloudmine.WebService({
  appid:  "885393c050dc424aa91ccc8349af22c9",
  apikey: "d58d4ebc082749c7afad088a5c2416b5"
});

$(function() {
	$("#main").dataTable({
		bAutoWidth: false
		,sDom: "<\"row\"<\"span12\"l>r>t<\"row\"<\"span6\"i><\"span6\"p>>"
		,sPaginationType: "bootstrap"
		,bProcessing: true
		,bServerSide: true
		,aoColumns: [
			{sTitle: "Date", mData: "datetime", fnRender: function(o, val) {return display_time(val);}} // Friendly date/time display
			,{sTitle: "Phone", mData: "phone_number", fnRender: function(o, val) {return val.substring(0,3)+'-'+val.substring(3,6)+'-'+val.substring(6,10);}} // Friendly phone number display
			,{sTitle: "Survey ID", mData: "survey_id"}
			,{sTitle: "Color", mData: "color"}
			,{sTitle: "Food", mData: "food"}
			,{sTitle: "Music", mData: "music"}
		]
		,sAjaxSource: "[__class__ = \"Message\"]" // Use this for the query since it gets passed to fnServerData
		,fnServerData: dataTablesAjax
	});
});

// TODO: Add filter/search
function dataTablesAjax(url, aoData, callback) {
	var data = unserializeArray(aoData);
	var options = {
		sort: data["mDataProp_" + data.iSortCol_0] + ":" + data.sSortDir_0, // this is how you get the sort row column name
		limit: data.iDisplayLength,
		skip: data.iDisplayStart,
		count: true
	};
	ws.search(url, options)
	.on("success", function(data, response) {
		callback({
			aaData: objToArrayOfObj(data),
			iTotalRecords: response.count,
			iTotalDisplayRecords: response.count
		});
	});
}

// Convert dataTables format of [[key, val],[key,val]] to [{key: val},{key: val}]
function unserializeArray(dataArray) {
	var dataObj = {};
	$.each(dataArray, function(key, val) {
		dataObj[this.name] = this.value;
	});
	return dataObj;
}

// Convert cloudmine response to dataTables format
function objToArrayOfObj(data) {
	var results = [];
	for(key in data) {
		if(data.hasOwnProperty(key)) {
			data[key].DT_RowId = key;
			results.push(data[key]);
		}
	}
	return results;
}

function display_time(UNIX_timestamp){
	var a = new Date(UNIX_timestamp*1000);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
	var month = a.getMonth()+1;
	var date = a.getDate();
	var hour = a.getHours();
	var min = ('0' + a.getMinutes()).slice(-2);
	var sec = ('0' + a.getSeconds()).slice(-2);
	var time = month+'/'+date+'/'+year+' '+hour+':'+min+':'+sec ;
	return time;
}