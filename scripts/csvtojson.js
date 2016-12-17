/**
 * Created by Ishtiaque on 9/8/2016.
 * DO NOT USE THIS FILE, AS THIS IS JUST FOR MODULARITY PURPOSES
 * USE dist/parseBuddy.js instead
 * MAY THE SOURCE BE WITH YOU
 */
function csvToJson(ipStr, delimiter){


	var lines;
	var numOfLines;
	var headers;
	var noOfHeaders;
	var jsonData = [];
	var rowData = {};
	var eachLineArr;
	var eachLineStr;
	var returnData = {
		message: "",
		linesFound: 0,
		linesParsed: 0,
		data: []
	};

	if(!delimiter){
		delimiter = ",";
	}

	//polyfill for Number.isNaN()
	if(!Number.isNaN){
		Number.isNaN = function isNaN(x){
			return x !== x;
		}
	}

	function removeQuotesFromHeaders(){
		var hc = 0, item, hlen;
		for(hc = 0; hc < noOfHeaders; hc++){
			item = headers[hc];
			hlen = item.length;
			if(item.charAt(0) == '"'  || item.charAt(0) == "'"){
				//remove the 1st and last characters which contain the opening and closing quotes.
				headers[hc] = item.slice(1, hlen-1);
			}
		}
	}

	function performSimpleParsing(){
		var j = 0, word;
		for(j = 0; j < noOfHeaders; j++){
			word = eachLineArr[j];
			if(word.charAt(0) == '"'  || word.charAt(0) == "'"){
				word = word.slice(1, word.length - 1);
			}
			if(Number.isNaN(Number(word))){
				rowData[headers[j]] = ""+word;
			}else{
				rowData[headers[j]] = Number(word);
			}
		}
	}


	//check if empty string
	if(!ipStr){
		returnData.message = "Invalid / Blank Input";
		//return JSON.stringify(returnData);
		return returnData;
	}
	//Remove all extra whitespaces
	var inputStr = ipStr.trim();
	//break the string line-wise by splitting at each newline character
	lines = inputStr.split("\n");

	//checking if there are 2 or more rows. 1st row for headers, subsequent rows for data.
	//If not, data is insufficient
	if(lines.length < 2){
		returnData.message = "You have not provided any data";
		//return JSON.stringify(returnData);
		return returnData;
	}

	//extract headers. The first line always contains the headers
	headers = lines[0].split(delimiter);
	noOfHeaders = headers.length;

	/* Remove quotes from headers if they are like "header1","header2"... to header1,header2...
	 *  This is done to avoid enclosing the headers in quotes twice, once by the quotes given in input,
	 *  and the second time b JSON.stringify().
	 */
	removeQuotesFromHeaders();

	numOfLines = lines.length;
	returnData.linesFound = numOfLines - 1; //exclude the header line
	for(var i = 1; i < numOfLines; i++){
		eachLineArr = lines[i].split(delimiter);
		rowData = {};   //removing the values from prev. iteration
		//checking if data provided and no of headers are same
		if(eachLineArr.length === headers.length){
			//data is in the simplest form, without any quotes or anything.
			performSimpleParsing();
			returnData.message = "No errors found";
			jsonData.push(rowData);
		}else{
			/* Either number of data not same as number of headers
			*  OR
			*  At least one value contains a delimiter within itself.
			*  For example a value like "221b, Baker Street" when the delimiter is ","
			*  In such cases, the delimiter is not to be considered as a separator for splitting.
			*/
			eachLineStr = lines[i];
			var k;
			for(k = 0; (k < noOfHeaders) && eachLineStr; k++){
				var closingSymbol;
				var closingSymbolPos;
				var word2;
				if(eachLineStr.charAt(0) === "'" || eachLineStr.charAt(0) === '"'){
					//if first char is a opening quote, then find the closing quote.
					//word will be between opening and closing quote
					closingSymbol = eachLineStr.charAt(0);  //this is same as the opening symbol
					eachLineStr = eachLineStr.slice(1);     //remove the opening quote from the line
					closingSymbolPos = eachLineStr.indexOf(closingSymbol);  //find the index of closing symbol
					//extract the word
					word2 = eachLineStr.slice(0,closingSymbolPos);
					//remove the word from the line string
					if(closingSymbolPos+2 < eachLineStr.length){
						eachLineStr = eachLineStr.slice(closingSymbolPos+2);//removed the extracted word + '",' or "',"
					}else{
						eachLineStr = ""; //removed the last word and the string is now empty
					}
				}else{
					//find the position of "," or the delimiter given
					closingSymbol = delimiter;//",";
					closingSymbolPos = eachLineStr.indexOf(closingSymbol);
					if(closingSymbolPos === -1){
						//means this is the last word
						word2 = eachLineStr.slice(0);
						eachLineStr = "";
					}else{
						word2 = eachLineStr.slice(0,closingSymbolPos);
						eachLineStr = eachLineStr.slice(closingSymbolPos+1);//removed the extracted word + ","
					}
				}
				if(Number.isNaN(Number(word2))){
					rowData[headers[k]] = ""+word2;
				}else{
					rowData[headers[k]] = Number(word2);
				}
			}
			if(k !== noOfHeaders || eachLineStr!== ""){
				returnData.message = "ParseError: Expected number of fields not found . Line: "+i;
				//jsonData.push(rowData);
				break;
			}else{
				returnData.message = "No errors found";
			}
			jsonData.push(rowData);
		}
	}
	returnData.linesParsed = i-1;
	returnData.data = jsonData;
	//return JSON.stringify(returnData);
	return returnData;
}
