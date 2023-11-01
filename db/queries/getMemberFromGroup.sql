SELECT firstName, lastName
FROM Student, `Group Member`
WHERE ? = `Group Member`.groupID
AND Student.studentID = `Group Member`.studentID