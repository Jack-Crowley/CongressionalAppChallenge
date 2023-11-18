select `Upcoming Event`.name, date, address, Company.name as company, `Upcoming Event`.eventID as ID
from `Group Event`, `Upcoming Event`, Location, Company
WHERE `Group Event`.groupID = ?
AND  `Group Event`.upcomingEventID = `Upcoming Event`.eventID
AND location = locationID
and `Upcoming Event`.companyID = Company.companyID