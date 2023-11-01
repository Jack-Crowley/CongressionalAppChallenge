select `Group`.groupID, name
from `Group`, `Group Member`
where studentID = ?
and `Group`.groupID = `Group Member`.groupID