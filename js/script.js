var ws = new cloudmine.WebService({
  appid:  "",
  apikey: ""
});

$(function() {
	$("#main").dataTable({
		bAutoWidth: false
		,sDom: "<\"row\"<\"span12\"l>r>t<\"row\"<\"span6\"i><\"span6\"p>>"
		,sPaginationType: "bootstrap"
		,bProcessing: true
		,bServerSide: true
		,aoColumns: [
			{sTitle: "Foo", mData: "foo"}
			,{sTitle: "Bar", mData: "bar"}
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