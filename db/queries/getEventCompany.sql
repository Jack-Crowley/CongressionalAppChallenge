SELECT Company.name as name
FROM Company, upcomingEvent
where eventID=?
and Company.companyID = upcomingEvent.eventID