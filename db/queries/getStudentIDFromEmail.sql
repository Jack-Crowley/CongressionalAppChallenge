SELECT Student.studentID
FROM Student, Account
WHERE Student.accountID = Account.accountID
AND Account.email=? 