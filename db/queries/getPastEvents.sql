SELECT eventName as name, hoursServed, date, Company.name as company
FROM `Volunteer Event`, Company
WHERE studentID = ?
AND `Volunteer Event`.companyID = Company.companyID