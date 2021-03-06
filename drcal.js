// Dr.Cal 2.1 - a minimalist javascript calendar (not a date picker)

// Copyright 2011, 2012, 2013, 2014, 2015 Chris Forno
// Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).

// Here's the general approach: we build the entire calendar as a single table
// and then provide a viewport into it (like longtable). This has some
// implications:
// - Full weeks are always displayed.
// - "Extra" days (days that aren't part of the current month but are displayed
//   in order to make the calendar display full weeks) can become normal days
//   when the month is switched.

// Unsupported browsers:
// Internet Explorer <= 8

(function () {

  // Fire a custom event named "name" from element "element" with
  // extra data "data" attached to the details of the event.
  function customEvent(name, element, data) {
    var evt;
    try {
      evt = new CustomEvent(name, {detail: data});
    } catch(e) {
      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(name, true, true, data);
    }
    element.dispatchEvent(evt);
  }

  function pad(n) {
    var n_ = n.toString();
    return new Array(3 - n_.length).join('0') + n_;
  }

  function iso8601(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  }

  function renderWeek(date, table) {
    var day = date;
    var row = document.createElement('tr');
    for (var i = 1; i <= 7; i++) {
      var td = document.createElement('td');
      td.setAttribute('date', iso8601(day));
      td.setAttribute('year', day.getFullYear());
      td.setAttribute('month', day.getMonth() + 1);
      td.setAttribute('day', day.getDate());
      row.appendChild(td);
      customEvent('drcal.renderDay', table, {'element': td,
                                             'date': day});
      day = new Date(day);
      day.setDate(day.getDate() + 1);
    }
    return row;
  }

  window.drcal = function (options) {
    var weekdays = options !== undefined && 'weekdays' in options ? options.weekdays :
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = options !== undefined && 'months' in options ? options.months :
      ['January', 'February', 'March', 'April', 'May', 'June',
       'July', 'August', 'September', 'October', 'November', 'December'];;
    var startDay = options !== undefined && 'startDay' in options ? options.startDay : 0;

    var weeks = []; // cache

    var prev = document.createElement('button');
    prev.className = 'prev';
    prev.setAttribute('aria-label', 'Previous month');
    var next = document.createElement('button');
    next.className = 'next';
    next.setAttribute('aria-label', 'Next month');
    var monthyear = document.createElement('span');
    monthyear.className = 'monthyear';
    var monthHeader = document.createElement('th');
    monthHeader.colSpan = 7;
    monthHeader.appendChild(prev);
    monthHeader.appendChild(monthyear);
    monthHeader.appendChild(next);

    var weekdayHeader = document.createElement('tr');
    for (var i = 0, j = weekdays.length; i < j; i++) {
      var th = document.createElement('th');
      th.appendChild(document.createTextNode(weekdays[(i + startDay) % j]));
      weekdayHeader.appendChild(th);
    }

    var table = document.createElement('table');
    table.className = 'calendar';
    table.createTHead().insertRow().appendChild(monthHeader);
    table.createTHead().appendChild(weekdayHeader);
    var tbody = document.createElement('tbody')
    table.appendChild(tbody);

    table.year = function () {return table.getAttribute('year') ? parseInt(table.getAttribute('year'), 10) : null;};
    table.month = function () {return table.getAttribute('month') ? parseInt(table.getAttribute('month'), 10) : null;};
    table.findCell = function (date) {return table.querySelector('[date="' + iso8601(date) + '"]');};
    table.changeMonth = function (date) {
      // Find the week that this month begins on.
      var first = new Date(date.getFullYear(), date.getMonth(), 1);
      var dif = first.getDay() - startDay;
      if (dif < 0)
        dif += 7;
      var weekStart = new Date(first);
      weekStart.setDate(weekStart.getDate() - dif);
      var week = weekStart;
      var now = new Date();
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var year = date.getFullYear();
      var month = date.getMonth();

      table.setAttribute('year', year);
      table.setAttribute('month', month + 1);

      customEvent('drcal.monthChange', table, {});

      // Remove any existing weeks from the table body.
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
      do {
        // If this week has already been rendered in the cache, use it.
        var tr = weeks[iso8601(week)];
        if (!tr) { // Render.
          tr = renderWeek(week, table);
          weeks[iso8601(week)] = tr;
        }
        // Either way, we need to run through each day and set some classes.
        for (var i = 0, j = tr.children.length; i < j; i++) {
          tr.children[i].className = tr.children[i].getAttribute('month') == month + 1 ? 'current' : 'extra'
          tr.children[i].className += tr.children[i].getAttribute('date') === iso8601(today) ? ' today' : ''
        }
        table.tBodies[0].appendChild(tr);
        
        week = new Date(week);
        week.setDate(week.getDate() + 7);
      } while (week.getMonth() === date.getMonth());

      while (monthyear.firstChild) {
        monthyear.removeChild(monthyear.firstChild);
      }
      monthyear.appendChild(document.createTextNode(months[month] + ' ' + year));
    };

    prev.addEventListener('click', function () {
      table.changeMonth(new Date(table.year() - (table.month() === 1  ? 1 : 0), table.month() === 1 ? 11 : table.month() - 2, 1));
    });
    next.addEventListener('click', function () {
      table.changeMonth(new Date(table.year() + (table.month() === 12 ? 1 : 0), table.month() === 12 ? 0 : table.month(), 1));
    });

    return table;
  };
})();
