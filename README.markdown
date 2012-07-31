Dr.Cal - a minimalistic javascript calendar (not a date picker) - version 1.1

# Features

Dr.Cal generates a calendar in a `<table>`. It leaves most of the rest of the work to you.

# How to Use

```
var cal = $.cal(); // returns a <table>
$('body').append(cal);
```

# Functions

`year()`
 :  return the current year (as a 4-digit integer)
`month()`
 :  return the current month (as an integer in the range [1,12])
`findCell(date)`
 :  return the cell containing the given JavaScript date
`changeMonth(date)`
 :  change to the month containing the given JavaScript date

# Events

`drcal.weekRender`
 :  triggered when a month is rendered for the first time; passed the newly rendered tr
`drcal.monthChange`
 :  triggered every time the month is changed

# Tips

First day displayed
 :  `cal.find('[date]:first')`
Last day displayed
 :  `cal.find('[date]:last')`
First day of the displayed month
 :  `cal.find('[date]:not([class="extra"]):first')`
Last day of the displayed month
 :  `cal.find('[date]:not([class="extra"]):last')`
