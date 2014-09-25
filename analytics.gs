/**   Analytics Report via SMS by TheLacunaBlog  **/
/**   =========================================  **/

/**   Published by Subigya Nepal on 5/15/2013    **/
/**   Details at www.thelacunablog.com/?p=6448   **/

/**   Last Update on July 9, 2013. **/

function run() {
    var results = getReportDataForProfile();
    outputToSpreadsheet(results);
  }


function getReportDataForProfile() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var profileId = ss.getSheetByName('Analytics').getRange("C12").getValue(); // < Enter your Google Analytics Profile ID here.
  var tableId = 'ga:' + profileId;
  var today = new Date();
  var todayString = Utilities.formatDate(today,'GMT+0545','yyyy-MM-dd');
  var startDate = todayString;
  var endDate = todayString;
  var optArgs = {
    //'dimensions': 'ga:keyword',              // Comma separated list of dimensions.
   // 'sort': '-ga:visits,ga:keyword',         // Sort by visits descending, then keyword.
   // 'segment': 'dynamic::ga:isMobile==Yes',  // Process only mobile traffic.
   // 'filters': 'ga:source==google',          // Display only google traffic.
   // 'start-index': '1',
   // 'max-results': '250'      // Display the first 250 results.
    
  };

  // Make a request to the API.
  
  var results = Analytics.Data.Ga.get(
      tableId,                  // Table id (format ga:xxxxxx).
      startDate,                // Start-date (format yyyy-MM-dd).
      endDate,                  // End-date (format yyyy-MM-dd).
      'ga:visitors,ga:visitBounceRate,ga:pageviews', // Comma seperated list of metrics. Edit this as per the reports you want to receive.
      optArgs);

  if (results.getRows() && results != null) {
    return results;

  }
}

function outputToSpreadsheet(results) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('AReports');


  // Print the headers.
  var headerNames = [];
  for (var i = 0, header; header = results.getColumnHeaders()[i]; ++i) {
    headerNames.push(header.getName());
  }
  sheet.getRange(1, 1, 1, headerNames.length)
      .setValues([headerNames]);

  // Print the rows of data.
  sheet.getRange(2, 1, results.getRows().length, headerNames.length)
      .setValues(results.getRows());
  
   
     var now = new Date().getTime();
     var cal = CalendarApp.getDefaultCalendar();
     var  bouncerate = sheet.getRange("B2").getValues().toString();
     var br = (+bouncerate).toFixed(1) // Always show 3 decimal points for Bounce Rate
     var pageviews = sheet.getRange("C2").getValues().toString();
     var visitors = sheet.getRange("A2").getValues().toString();
      var title = "PV:" + pageviews + " V:" + visitors + " BR:" + br; // < This is what gets sent on the SMS. 
     //cal.createEvent(title, new Date("March 3, 2010 08:00:00"), new Date("March 3, 2010 09:00:00"), {description:desc,location:loc});
     cal.createEvent(title, new Date(now+60000), new Date(now+60000)).addSmsReminder(0);
}

// Written by Subigya Nepal admin@thelacunablog.com
// Twitter: @SkNepal

