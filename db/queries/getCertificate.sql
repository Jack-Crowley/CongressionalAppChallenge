SELECT Account.accountID as id, eventName, hoursServed, firstName, lastName, Account.email
FROM `Volunteer Event`, Student, Account
WHERE Student.studentID = `Volunteer Event`.studentID
AND `Volunteer Event`.volunteerID = ?
AND Account.accountID = Student.accountID