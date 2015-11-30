# Dr.Cal 2.0 - A Minimalist JavaScript Calendar (not a date picker)

Demo at http://www.minjs.com/#drcal

## Features

Dr.Cal generates a calendar in a `<table>`. It leaves most of the rest of the work to you.

## How to Use

```JavaScript
var cal = drcal(); // returns a <table>
document.body.appendChild(cal);
```

## Options

To display weekday/month names in a language other than english, pass them in as options. Note that weeks begin on Sunday for Dr.Cal.

```JavaScript
var cal = drcal({'weekdays': ['日', '一', '二', '三', '四', '五', '六'],
                 'months': ['1月', '2月', '3月', '4月', '5月', '6月',
                            '7月', '8月', '9月', '10月', '11月', '12月']});
```

## Functions

* `year()` - return the current year (as a 4-digit integer)
* `month()` - return the current month (as an integer in the range [1,12])
* `findCell(date)` - return the cell containing the given JavaScript date
* `changeMonth(date)` - change to the month containing the given JavaScript date

## Events

* `drcal.renderDay` - triggered when a day is rendered for the first time
* `drcal.monthChange` - triggered every time the month is changed

## Rendering

Dr.Cal renders a basic table and attaches some attributes to each day (a table cell (`<td>`)). The contents of the cell are up to you. The event's detail will contain:

* `element` - the `<td>`/date DOM element that we're rendering
* `date` - the JavaScript date for the date we're rendering

For example, to add the day number to each cell that's rendered:

```JavaScript
cal.addEventListener('drcal.renderDay', function (event) {
  event.detail.element.appendChild(document.createTextNode(event.detail.date.getDate()));
});
```

## Tips

* First day displayed - `cal.querySelector('td')`
* First day of the displayed month - `cal.querySelector('td.current')`

## Unsupported Browsers

* Internet Explorer <= 8
