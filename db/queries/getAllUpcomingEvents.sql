SELECT `Upcoming Event`.eventID, `Upcoming Event`.name, description, date, address, Company.name as company, GROUP_CONCAT(Keywords.keywordID) AS keywords, COUNT(Registration.eventID) AS registrationCount
FROM `Upcoming Event`
LEFT JOIN Registration ON `Upcoming Event`.eventID = Registration.eventID
JOIN Company ON `Upcoming Event`.companyID = Company.companyID
JOIN Location ON location = locationID
LEFT JOIN KeywordManager ON `Upcoming Event`.eventID = KeywordManager.upcomingEventID
LEFT JOIN Keywords ON KeywordManager.wordID = Keywords.keywordID
GROUP BY `Upcoming Event`.eventID;