// Dr.Cal - a minimalistic calendar (not a date picker) - version 0.1

// Copyright 2011 Chris Forno
// Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).

// Requirements:
//  * jQuery >= 1.4.3

(function ($) {
  var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function pad(n) {
    var n_ = n.toString();
    return new Array(3 - n_.length).join('0') + n_;
  }

  function iso8601(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  }

  $.drcal = function () {
    var table = $('<table class="calendar"><thead></thead><tbody></tbody><tfoot></tfoot></table>');
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var today = new Date(year, month, now.getDate());

    $('<tr>' + $.map(weekdays, function (x) {return '<th>' + x + '</th>'}).join('') + '</tr>').appendTo(table.find('thead'));
    // Begin at the beginning of this month.
    var date = new Date(year, month, 1);
    // Rewind back to the first Sunday of this month or the previous month.
    date = new Date(date.getTime() - (86400000 * date.getDay()));
    var startDate = date;
    while (date.getMonth() <= month) {
      var row = $('<tr></tr>');
      for (var i = 0; i < 7; i++) {
        var day = $('<td date="' + iso8601(date) + '" day="' + date.getDate() + '"></td>').appendTo(row);
        if (date.getTime() === today.getTime()) {
          day.addClass('today');
        }
        if (date.getMonth() < month || date.getMonth() > month) {
          day.addClass('extra');
        }
        date = new Date(date.getTime() + 86400000);
      }
      row.appendTo($(table).find('tbody'));
    }
    var endDate = date;

    table.startDate = function () {return startDate;};
    table.endDate = function () {return endDate;};
    table.findCell = function (date) {return table.find('[date="' + iso8601(date) + '"]');};

    return table;
  };
})(jQuery);