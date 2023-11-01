SELECT name, description, date, Registration.eventID
FROM `Upcoming Event`, Registration
WHERE `Upcoming Event`.eventID = Registration.eventID
AND studentID=?