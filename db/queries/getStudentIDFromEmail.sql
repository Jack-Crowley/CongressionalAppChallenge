SELECT studentID
FROM Student, Account
WHERE Student.accountID = account.accountID
AND email=? 