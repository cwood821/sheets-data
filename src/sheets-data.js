SheetsData = function(dataSheet, headerOffset) {
  var defaultHeaderOffset = 2;
  this.dataSheet = dataSheet;
  this.headerOffset = (typeof headerOffset !== 'undefined') ? headerOffset : defaultHeaderOffset;
}

SheetsData.prototype.getAll = function() {
  var rowBelowHeader = 2;
  var firstColumn = 1;
  var lastRowWithData = this.dataSheet.getLastRow() - 1;
  var dataBelowHeaderRange = this.dataSheet.getRange(rowBelowHeader, firstColumn, lastRowWithData, this.dataSheet.getLastColumn());
  var values = dataBelowHeaderRange.getValues();
  var headers = this.getColumnHeaders();
  return this.convertRows(values, headers);
}

SheetsData.prototype.getColumnHeaders = function() {
  // Since Google 1 indexes, 1,1 is the top left corner
  var headerRange = this.dataSheet.getRange(1, 1, 1, this.dataSheet.getLastColumn());
  var values = headerRange.getValues();
  values = values[0];
  return values;
}

SheetsData.prototype.convertRows = function (rows, columnHeaders) {
  var rowObjects = [];
  rows.forEach(function (row, rowIndex) {
    var rowData = new RowData(row, rowIndex, this.dataSheet, columnHeaders);
    rowObjects.push(rowData);
  }.bind(this));
  return rowObjects;
};

SheetsData.prototype.store = function(row, column, value) {
  var range = this.dataSheet.getRange(parseInt(row), parseInt(column));
  // Row and column here are relative to the range, so 1,1 points to itself
  range.setValue(value);
  // Flush pending changes and apply them to the sheet
  SpreadsheetApp.flush();
};

SheetsData.prototype.add = function(rowObject) {
  var lastRowWithData = this.dataSheet.getLastRow() - 1;
  // Unpack pojo of data we received into Sheets-esque array
  var columnHeaders = this.getColumnHeaders();
  var rowData = [];
  
  columnHeaders.forEach( function(header, index) {
    if (rowObject.hasOwnProperty(header)) {
      rowData.push(rowObject[header]);
    } else {
     // It's empty, so add an empty string
      rowData.push("");
    }
  });
 
  var newRow = new RowData(rowData, lastRowWithData, this.dataSheet, this.getColumnHeaders(), this.headerOffset);  
  // Write it so it persists
  newRow.write();
  SpreadsheetApp.flush();
}


/*
  The RowData class is a representation of a single row in a spreadsheet
*/
var RowData = function(row, rowIndex, dataSheet, columnHeaders, headerOffset) {
  // Since Sheets 1 indexes, we offset 2 for the actual data starting point
  this.headerOffset = (typeof headerOffset !== 'undefined') ? headerOffset : 2;
  this.dataSheet = dataSheet;
  this.columns = {};

  // Setup pojo's for column data
  var GOOGLE_SHEETS_COLUMN_OFFSET = 1;
  for (var i = 0; i < row.length; i++) {
    this.columns[columnHeaders[i]] = {
      value: row[i],
      row: rowIndex + this.headerOffset,
      column: i + GOOGLE_SHEETS_COLUMN_OFFSET,
    };
  }
}

RowData.prototype.get = function(columnName) {
  if (! this.columns[columnName]) return undefined;
  return this.columns[columnName].value;
}

RowData.prototype.set = function(columnName, newValue) {
  // Update the column object value 
  this.columns[columnName].value = newValue;
  // Update the spreadsheet value
  var row = parseInt(this.columns[columnName].row);
  var column = parseInt(this.columns[columnName].column);
  var range = this.dataSheet.getRange(row, column);
  // Row and column here are relative to the range, so 1,1 points to itself
  range.setValue(newValue);
  return this;
}

// Write an entire row object, as-is, to its owning sheet
RowData.prototype.write = function() {
   for (columnName in this.columns) {
      var row = parseInt(this.columns[columnName].row);
      var column = parseInt(this.columns[columnName].column);
      var range = this.dataSheet.getRange(row, column);
      range.setValue(this.columns[columnName].value);
  }
  return this;
}
