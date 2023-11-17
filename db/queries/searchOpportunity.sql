SELECT `Upcoming Event`.*
FROM `Upcoming Event`
LEFT JOIN Location ON `Upcoming Event`.location = Location.locationID
LEFT JOIN KeywordManager ON `Upcoming Event`.eventID = KeywordManager.upcomingEventID
LEFT JOIN Keywords ON KeywordManager.wordID = Keywords.keywordID
WHERE (UPPER(`Upcoming Event`.name) LIKE UPPER(?)
OR UPPER(`Upcoming Event`.description) LIKE UPPER(?)
OR UPPER(Keywords.keyword) LIKE UPPER(?))
AND (? = '' OR DATEDIFF(date, ?) = 0)
AND (? = '' OR Location.zipcode LIKE (?))