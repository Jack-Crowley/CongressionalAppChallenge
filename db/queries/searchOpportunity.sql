SELECT `Upcoming Event`.eventID as ID, date, Location.address as address, `Upcoming Event`.name, Company.name as company 
FROM `Upcoming Event`
LEFT JOIN Location ON `Upcoming Event`.location = Location.locationID
LEFT JOIN Company ON `Upcoming Event`.companyID = Company.companyID
LEFT JOIN KeywordManager ON `Upcoming Event`.eventID = KeywordManager.upcomingEventID
LEFT JOIN Keywords ON KeywordManager.wordID = Keywords.keywordID
WHERE (UPPER(`Upcoming Event`.name) LIKE UPPER(?)
OR UPPER(`Upcoming Event`.description) LIKE UPPER(?)
OR UPPER(Keywords.keyword) LIKE UPPER(?))
AND (? = '' OR DATEDIFF(date, ?) = 0)
AND (? = '' OR Location.zipcode LIKE (?))