SELECT `Upcoming Event`.eventID as ID, date, Location.zipcode as zipcode, GROUP_CONCAT(Keywords.keywordID) AS keywords, COUNT(Registration.eventID) AS registrationCount
FROM `Upcoming Event`
JOIN Registration ON `Upcoming Event`.eventID = Registration.eventID AND Registration.studentID = ?
LEFT JOIN Location ON `Upcoming Event`.location = Location.locationID
LEFT JOIN KeywordManager ON `Upcoming Event`.eventID = KeywordManager.upcomingEventID
LEFT JOIN Keywords ON KeywordManager.wordID = Keywords.keywordID
GROUP BY `Upcoming Event`.eventID;