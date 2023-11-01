SELECT Location.address as address
FROM `Location`, `Upcoming Event`
where eventID=?
and locationID = `Upcoming Event`.location