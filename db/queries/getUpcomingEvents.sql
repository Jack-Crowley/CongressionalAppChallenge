SELECT name, description, date
FROM `Upcoming Event`, Registration
WHERE `Upcoming Event`.eventID = Registration.eventID
AND studentID=?