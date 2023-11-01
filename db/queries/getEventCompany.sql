SELECT Company.name as name
FROM Company, `Upcoming Event`
where eventID=?
and Company.companyID = `Upcoming Event`.companyID