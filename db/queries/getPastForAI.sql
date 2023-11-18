SELECT `Volunteer Event`.volunteerID as ID, date, Location.zipcode as zipcode, GROUP_CONCAT(Keywords.keywordID) AS keywords 
FROM `Volunteer Event`
LEFT JOIN Location ON `Volunteer Event`.location = Location.locationID
LEFT JOIN KeywordManager ON `Volunteer Event`.volunteerID = KeywordManager.pastEventID
LEFT JOIN Keywords ON KeywordManager.wordID = Keywords.keywordID
GROUP BY `Volunteer Event`.volunteerID;