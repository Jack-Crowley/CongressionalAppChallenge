select name, date
from `Group Event`, `Upcoming Event`
WHERE `Group Event`.groupID = ?
AND  `Group Event`.upcomingEventID = `Upcoming Event`.eventID