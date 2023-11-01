SELECT Location.address as address
FROM Location, upcomingEvent
where eventID=?
and locationID = location