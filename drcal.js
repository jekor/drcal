// Dr.Cal - a minimalistic javascript calendar (not a date picker) - version 1.0

// Copyright 2011, 2012 Chris Forno
// Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).

// Requirements:
//  * jQuery >= 1.4.3

// Here's the general approach: we build the entire calendar as a single table
// and then provide a viewport into it (like longtable). This has some
// implications:
// - Full weeks are always displayed.
// - "Extra" days (days that aren't part of the current month but are displayed
//   in order to make the calendar display full weeks) can become normal days
//   when the month is switched.

(function ($) {
  var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var weeks = [];

  function pad(n) {
    var n_ = n.toString();
    return new Array(3 - n_.length).join('0') + n_;
  }

  function iso8601(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  }

  function renderWeek(date) {
    var day = date;
    var week = $('<tr></tr>');
    for (var i = 0; i < 7; i++) {
      var cell = $('<td date="' + iso8601(day) + '" year="' + day.getFullYear() + '" month="' + (day.getMonth() + 1) + '" day="' + day.getDate() + '"></td>').appendTo(week);
      day = new Date(day.getTime() + 86400000);
    }
    return week;
  }

  $.drcal = function (render) {
    var table = $(
      '<table class="calendar">'
      + '<thead>'
        + '<tr>'
          + '<th colspan="7">'
            + '<button class="prev"></button>'
            + '<span class="monthyear"></span>'
            + '<button class="next"></button>'
          + '</th>'
        + '</tr>'
      + '</thead>'
      + '<tbody></tbody>'
    + '</table>');

    $('<tr>' + $.map(weekdays, function (x) {return '<th>' + x + '</th>'}).join('') + '</tr>').appendTo(table.find('thead'));

    table.year = function () {return table.attr('year') ? parseInt(table.attr('year'), 10) : null;};
    table.month = function () {return table.attr('month') ? parseInt(table.attr('month'), 10) : null;};
    table.findCell = function (date) {return table.find('[date="' + iso8601(date) + '"]');};
    table.changeMonth = function (date) {
      // Find the week that this month begins on.
      var first = new Date(date.getFullYear(), date.getMonth(), 1);
      var weekStart = new Date(first.getTime() - (first.getDay() * 86400000));
      var week = weekStart;
      var now = new Date();
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var year = date.getFullYear();
      var month = date.getMonth();

      // Detach any existing weeks.
      $('tbody > tr', table).detach();
      do {
        // If this month has already been rendered in the cache, use it.
        var tr = weeks[iso8601(week)];
        var rendered = false;
        if (!tr) { // Render.
          rendered = true;
          tr = renderWeek(week);
          weeks[iso8601(week)] = tr;
        }
        // Either way, we need to run through each day and set some classes.
        $('td', tr).each(function (_, td) {
          $(td).removeClass('today').removeClass('extra');
          if ($(td).attr('date') === iso8601(today)) {
            $(td).addClass('today');
          }
          if ($(td).attr('month') != month + 1) {
            $(td).addClass('extra');
          }
        });
        $('tbody', table).append(tr);
        if (rendered) {
          table.trigger('drcal.weekRender', [tr]);
        }
        week = new Date(week.getTime() + 86400000 * 7);
      } while (week.getMonth() === date.getMonth());
      table.attr('year', year);
      table.attr('month', month + 1);
      table.find('.monthyear').empty().append(months[month] + ' ' + year);
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
