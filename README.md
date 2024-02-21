# Teacher List

## Overview

This website provides semi real-time information about the current location of teachers.

## Usage

### Parameters

You can customize the display of teacher information using the followingparameters in the URL:

- **table_amount**: Specifies the amount of tables (rows) used for displaying teacher information next
to each other. Default value is 2.
- **hide_null_teachers**: Controls whether teachers who are registered at the school but do not
have courses scheduled for the current year are displayed. Default value is true, meaning they
are hidden.
- **hide_gone**: Determines whether teachers who have finished their courses for the day are
displayed. Default value is true, meaning they are hidden.
- **hide_no_data**: Decides whether teachers who have no courses scheduled for the current day
are displayed. Default value is true, meaning they are hidden.
- **only_currently**: Determines whether teachers who currently have no course should be displayed
or not. Default value is true, meaing they are hidden.
- **update_time**: Sets the interval in which the data is updated. Default value is 900000 (15min)
- **offset_to_next_course**: Defines the amount in ms that the beginning of the next course of
an not teaching teacher can be away to still be displayed. Default is 1800000 (30min)
- **sort_type**: Sets the sort order, how the teachers should be sorted, possible options are
*ByRoom* and *ByName*. Default value is ByName.

### Example usage

To customize the display, simple append the desired parameters to the URL. For example:

```
https://example.com/teacher-availability?table_amount=3&hide_null_teachers=false
```

This URL will display teacher information in 3 rows, including teachers who do not have courses schedules for the current year.

## Development

### Used Technologies

- HTML
- CSS
- JavaScript

### Installation

Clone this repository with following command:
```bash
git clone git@github.com:LukasHuth/TeacherList.git <path to your webserver>
```
or:
```bash
cd <path to your webserver>
git clone git@github.com:LukasHuth/TeacherList.git
```

## Contributers
- [Lukas Huth](https://github.com/LukasHuth)
