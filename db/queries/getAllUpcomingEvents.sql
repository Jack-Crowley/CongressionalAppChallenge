SELECT date, `Upcoming Event`.name, address, Company.name as company, eventID
FROM `Upcoming Event`, Location, Company
WHERE `Upcoming Event`.location = locationID
AND Company.companyID = `Upcoming Event`.companyID