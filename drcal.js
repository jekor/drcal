// Dr.Cal - a minimalistic calendar (not a date picker) - version 0.2

// Copyright 2011 Chris Forno
// Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).

// Requirements:
//  * jQuery >= 1.4.3

(function ($) {
  var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var bodies = [];

  function pad(n) {
    var n_ = n.toString();
    return new Array(3 - n_.length).join('0') + n_;
  }

  function iso8601(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  }

  $.drcal = function (render) {
    var table = $('<table class="calendar"><thead><tr><th colspan="7"><button class="prev"></button><span class="monthyear"></span><button class="next"></button></th></tr></thead><tbody></tbody></table>');
    $('<tr>' + $.map(weekdays, function (x) {return '<th>' + x + '</th>'}).join('') + '</tr>').appendTo(table.find('thead'));

    table.year = function () {return table.attr('year') ? parseInt(table.attr('year'), 10) : null;};
    table.month = function () {return table.attr('month') ? parseInt(table.attr('month'), 10) : null;};
    table.findCell = function (date) {return table.find('[date="' + iso8601(date) + '"]');};
    table.changeMonth = function (date) {
      // If this month has already been rendered, store the tbody.
      if (table.year()) {
        if (!bodies[table.year()]) {
          bodies[table.year()] = [];
        }
        bodies[table.year()][table.month()] = table.find('tbody > tr').detach();
      }
      var year = date.getFullYear();
      var month = date.getMonth();
      table.attr('year', year);
      table.attr('month', month + 1);
      table.find('.monthyear').empty().append(months[month] + ' ' + year);
      // Is the target month in the cache?
      if (bodies[year] && bodies[year][month + 1]) {
        bodies[year][month + 1].appendTo(table.find('tbody'));
        table.trigger('drcal.monthChange', []);
        return;
      }

      var now = new Date();
      today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      // Begin at the beginning of this month.
      var date = new Date(year, month, 1);
      // Rewind back to the first Sunday of this month or the previous month.
      date = new Date(date.getTime() - (86400000 * date.getDay()));
      var startDate = date;
      while (date.getFullYear() <= year && (date.getMonth() <= month || month === 0 && date.getMonth() === 11)) {
        var row = $('<tr></tr>');
        for (var i = 0; i < 7; i++) {
          var day = $('<td date="' + iso8601(date) + '" day="' + date.getDate() + '"></td>').appendTo(row);
          if (date.getTime() === today.getTime()) {
            day.addClass('today');
          }
          if (date.getMonth() !== month) {
            day.addClass('extra');
          }
          date = new Date(date.getTime() + 86400000);
        }
        row.appendTo($(table).find('tbody'));
      }
      var endDate = date;
      table.trigger('drcal.monthRender', []);
      table.trigger('drcal.monthChange', []);
    };

    table.find('button.prev').click(function () {
      table.changeMonth(new Date(table.year() - (table.month() === 1  ? 1 : 0), table.month() === 1 ? 11 : table.month() - 2, 1));
    });
    table.find('button.next').click(function () {
      table.changeMonth(new Date(table.year() + (table.month() === 12 ? 1 : 0), table.month() === 12 ? 0 : table.month(), 1));
    });

    return table;
  };
})(jQuery);