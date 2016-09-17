/**
 * Created by Ishtiaque on 9/17/2016.
 */
function jsonToCsv(input, delimiter, wrapInQuotes){
	"use strict";
	if(!delimiter){
		delimiter = ",";
	}
	if(!wrapInQuotes){
		wrapInQuotes = false;
	}
	var output = "";

	function objToString (obj) {
		var line = "";
		//checking for data consistency
		if(Object.getOwnPropertyNames(obj).length !== noOfHeaders){
			return "Inconsistent data found."
		}
		for (var eachProp in obj) {
			if (obj.hasOwnProperty(eachProp)) {
				line += obj[eachProp] + delimiter;
			}
		}
		return line.slice(0, -1);//remove the last delimiter
	}

	if(!input || input.length === 0 || !(input instanceof Array)){
		output = "Empty / Invalid input";
		console.log(output);
		return;
	}

	//creating the header line
	var noOfHeaders = Object.getOwnPropertyNames(input[0]).length;
	//console.log(noOfHeaders);
	output += Object.getOwnPropertyNames(input[0]).join(delimiter);
	var i = 0;
	var lineVal;
	for(i = 0; i < input.length; i++){
		output += "\n";
		lineVal = objToString(input[i]);
		output += lineVal;
		if(lineVal === "Inconsistent data found."){
			break;
		}
	}
	return output;
	//console.log(output);
}

