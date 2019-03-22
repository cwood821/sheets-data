# Sheets Data

> A tiny abstraction layer over Google Apps Script Sheets API

Want to work with Google Spreadsheet Data but keep getting fooled by the API? Don't get fooled again!

### Example

This example assumes a tabular format for spreadsheet data with column headers in the first row. Column headers assumed here are `band_name` and `rating`.

```js
// Grab a sheet to pass to SheetsData
var ss = SpreadsheetApp.getActiveSpreadsheet();
var recordsSheet = ss.getSheetByName("records");
// Instantiate a new instance and grab all the data from the sheet
var records = new SheetsData(recordsSheet);
var allMyRecords = records.getAll();
// Get all the records by The Who
var recordsByTheWho = allMyRecords.filter( function(record) {
  return record.get("band_name") == "The Who";
});
// Update the rating for each record by The Who to 5
recordsByTheWho.forEach( function(record) {
  record.set("rating", 5);
});
// Rock out 🎸
```

### Usage

#### Instantiate a new instance by passing a sheet
```js
var records = new SheetsData(recordsSheet);
```

#### Add a row (record)

SheetsData converts plain-old-JavaScript objects down to a new row when object properties match column headers.

```js
records.add({
    "band_name": "Yes", 
    "rating": 4
});
```

#### Grab all rows and columns with data
```js
var allMyRecords = records.getAll()
```

#### Get the value of a particular column
```js

// Assumes allMyRecords call from above
allMyRecords[3].get("band_name");

```

#### Set the value of a particular column
```js

// Assumes allMyRecords call from above
allMyRecords[3].set("band_name", "Red Hot Chili Peppers");

```

#### Store a data into the sheet at an arbitrary location
```js
// Grab a sheet to pass to SheetsData
var ss = SpreadsheetApp.getActiveSpreadsheet();
var recordsSheet = ss.getSheetByName("records");
// Instantiate a new instance and grab all the data from the sheet
var records = new SheetsData(recordsSheet);

var arbitraryRow = 3;
var arbitraryColumn = 4;
records.store(arbitraryRow, arbitraryColumn, "Pinball Wizard");
```

## Benefits

Get and set data from Google Sheets via a simple interface:

```js

record.get(someColumnName);

record.set(someColumnName, newValue);

```

Use that handy format to map/filter/reduce over the returned data and do stuff.


### The Code

The code is written in ES5 due to the limitations of the Google Apps Script Environment. It also needs some cleanup and refactoring.
