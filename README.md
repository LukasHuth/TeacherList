# Teacher List

## Overview

This website provides semi real-time information about the current location of teachers.

## Usage

### Parameters

You can customize the display of teacher information using the followingparameters in the URL:

- **hide_null_teachers**: Controls whether teachers who are registered at the school but do not
have courses scheduled for the current year are displayed. Default value is true, meaning they
are hidden.
- **hide_gone**: Determines whether teachers who have finished their courses for the day are
displayed. Default value is true, meaning they are hidden.
- **hide_no_data**: Decides whether teachers who have no courses scheduled for the current day
are displayed. Default value is true, meaning they are hidden.
- **only_currently**: Determines whether teachers who currently have no course should be displayed
or not. Default value is true, meaning they are hidden.
- **update_time**: Sets the interval in which the data is updated. Default value is 900000 (15min)
- **offset_to_next_course**: Defines the amount in ms that the beginning of the next course of
an not teaching teacher can be away to still be displayed. Default is 1800000 (30min)
- **sort_type**: Sets the sort order, how the teachers should be sorted, possible options are
*ByRoom* and *ByName*. Default value is ByName.
- **show_classes**: Decides whether the classes of a course should be shown in the table.
Default value is true, meaning they are shown.
- **show_start_time**: Decides whether the start of the next course should be shown.
Default value is true, meaning the start time is shown.
- **classes_trim_at**: Sets the offset where the classes will be considerred to be too long and
will be trimmed down with `...`. Default value is 13, meaning `13G,13B,13E,13D` will be 
`13G,13B,13...`
- **convert_moved_room**: Determines whether the moved should be converted to just show the new
room or if the whole string with the old room should be shown aswell.
Default value is true, meaning only the new room is shown.
- **hide_cancelled**: Decides whether a cancelled course should be displayed or not.
Default value is true, meaning cancelled courses are hidden.

### Example usage

To customize the display, simple append the desired parameters to the URL. For example:

```
https://example.com/teacher-availability?hide_null_teachers=false
```

This URL will display teacher information, including teachers who do not have courses schedules for the current year.

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

# Input structure

The input can be pointed to every file consisting of a list following this structure on each line
where every element is seperated by a `|`:

- Teacher name
- Lesson Start (YYYY-MM-DD HH:MM:SS)
- Lesson End (YYYY-MM-DD HH:MM:SS)
- Room (if a movement occured it should be structured like this)
  - from `A209` to `A201` should look like `+A201(A209)`
- List of all teachers teaching this course (in the same room at the same time)
- List of Classes attending the course (Comma seperation adviced)
- Course Name (e.g. `E`)
- Status:
  - Unterricht: The teacher has a course currently
  - cancelled: The course is cancled
  - Gone: The last lesson of the teacher of today is over
  - None: The teacher had no lesson today

## To-Do

- [ ] change background image

## Contributers
- [Lukas Huth](https://github.com/LukasHuth)
