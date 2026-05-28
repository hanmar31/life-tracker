# Requirements Specification - Life Tracker

## Project Overview
Life Tracker is a habit tracking web application where users can create, manage and track daily, weekly, and monthly habits through interactive calendar-based views.

The goal of the application is to help users build routines and maintain long-term consistency by providing clear visual tracking and navigation between differnet time periods.

## Funtional Requirements

#21 Create Habit

Users must be able to create a habit with a name and frequency (daily, weekly, monthly).

Acceptance criteria:

- User can enter a habit name.
- User can select a frequency (daily, weekly monthly)
- Daily habits are tracked per day.
- Weekly habits are tracked per week.
- Monthly habits are tracked per month.
- Habit name is required.
- The habit is saved after submission.
- The habit appears in the correct view based on its frequency.

#22 Mark habit as completed

Users must be able to mark a habit as completed.

Acceptance criteria:

- User can mark a daily habit as completed for a specific day.
- User can mark a weekly habit as completed once per week.
- User can mark a monthly habit as completed once per month.
- Completed habits are visually distinguishable.
- The completion state is saved.

#23 View daily habits

Users must be able to view a list of their habits for a selected day.

Acceptance criteria:

- The system displays all habits for the selected day.
- Each habit shows its name and status (completed/not completed)
- The list updates when navigating between days.

#24 Navigate between dates


Acceptance criteria:

- User can move to previous and next day.
- User can move between weeks and months.
- The displayed habits update based on the selected period.
- The selected date or period is clearly shown in the interface.

#26 Edit/Delete habit

Users must be able to edit and delete habits.

Acceptance criteria:

- User can update habit name.
- User can change the frequency.
- User can delete a habit.
- Changes are saved immediately.
- Deleted habits are removed from the list.

#54 View weekly habits

Users must be able to view their habits in a weekly view.

Acceptance criteria:

- A calendar view shows 7 days of the current week.
- Daily habits are shown per day with completion status.
- Weekly habits are shown in a separate list.
- Each weekly habit shows completion status for the current week.
- User can mark weekly habits as completed.
- User can navigate between weeks.

#55 View monthly habits

User must be able to view their habits in a monthly view.

Acceptance criteria:

- A calendar view shows all days of the current month.
- Daily habits are shown per day with completion status.
- Monthly habits are shown in a separate list.
- Each monthly habit shows completion status for the current month.
- User can mark monthly habits as completed.
- User can navigate between months.

#56 Create habit for specific day

User must be able to create habits for specific days of the week.

Acceptance criteria:

- User can select specific days (e.g. Monday, Wednesday)
- Habit only appears on selected days.
- Habit does not appear on other days.
- Selection is saved.
