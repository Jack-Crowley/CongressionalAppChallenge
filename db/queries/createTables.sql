CREATE TABLE `CommuniTeen`.`Student` (
  `studentID` INT NOT NULL,
  `email` VARCHAR(45) NULL,
  `schoolID` INT NULL,
  `firstName` VARCHAR(45) NULL,
  `lastName` VARCHAR(45) NULL,
  `dob` DATETIME NULL,
  `gradYear` INT NULL,
  `interests` VARCHAR(145) NULL,
  `phoneNumber` VARCHAR(20) NULL,
  PRIMARY KEY (`studentID`));

CREATE TABLE `CommuniTeen`.`School` (
  `schoolID` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `gradHours` INT NULL,
  `location` INT NULL,
  PRIMARY KEY (`schoolID`));

CREATE TABLE `CommuniTeen`.`Location` (
  `locationID` INT NOT NULL,
  `zipcode` INT NULL,
  `streetNum` INT NULL,
  `streetName` VARCHAR(45) NULL,
  `town` VARCHAR(45) NULL,
  PRIMARY KEY (`locationID`));

CREATE TABLE `CommuniTeen`.`Company` (
  `companyID` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  PRIMARY KEY (`companyID`));

CREATE TABLE `CommuniTeen`.`Volunteer Event` (
  `volunteerID` INT NOT NULL,
  `date` DATE NULL,
  `hoursServed` INT NULL,
  `companyID` INT NULL,
  `evemtName` VARCHAR(45) NULL,
  `location` INT NULL,
  `studentID` INT NOT NULL,
  PRIMARY KEY (`volunteerID`));

CREATE TABLE `CommuniTeen`.`Upcoming Event` (
  `eventID` INT NOT NULL,
  `date` DATETIME NULL,
  `location` INT NULL,
  PRIMARY KEY (`eventID`));

CREATE TABLE `CommuniTeen`.`Group` (
  `groupID` INT NOT NULL,
  `email` VARCHAR(45) NULL,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`groupID`));

CREATE TABLE `CommuniTeen`.`Group Member` (
  `studentID` INT NOT NULL,
  `groupID` INT NOT NULL);

CREATE TABLE `CommuniTeen`.`Registration` (
  `eventID` INT NULL,
  `studentID` INT NULL);

ALTER TABLE `CommuniTeen`.`Student` 
ADD INDEX `f_student_school_idx` (`schoolID` ASC) VISIBLE;
ALTER TABLE `CommuniTeen`.`Student` 
ADD CONSTRAINT `f_student_school`
  FOREIGN KEY (`schoolID`)
  REFERENCES `CommuniTeen`.`School` (`schoolID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `CommuniTeen`.`School` 
ADD INDEX `f_school_location_idx` (`location` ASC) VISIBLE;
ALTER TABLE `CommuniTeen`.`School` 
ADD CONSTRAINT `f_school_location`
  FOREIGN KEY (`location`)
  REFERENCES `CommuniTeen`.`Location` (`locationID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `CommuniTeen`.`Volunteer Event` 
ADD INDEX `f_volunteer_company_idx` (`companyID` ASC) VISIBLE,
ADD INDEX `f_volunteer_location_idx` (`location` ASC) VISIBLE,
ADD INDEX `f_volunteer_student_idx` (`studentID` ASC) VISIBLE;
ALTER TABLE `CommuniTeen`.`Volunteer Event` 
ADD CONSTRAINT `f_volunteer_company`
  FOREIGN KEY (`companyID`)
  REFERENCES `CommuniTeen`.`Company` (`companyID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `f_volunteer_location`
  FOREIGN KEY (`location`)
  REFERENCES `CommuniTeen`.`Location` (`locationID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `f_volunteer_student`
  FOREIGN KEY (`studentID`)
  REFERENCES `CommuniTeen`.`Student` (`studentID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `CommuniTeen`.`Upcoming Event` 
ADD INDEX `f_event_location_idx` (`location` ASC) VISIBLE;
ALTER TABLE `CommuniTeen`.`Upcoming Event` 
ADD CONSTRAINT `f_event_location`
  FOREIGN KEY (`location`)
  REFERENCES `CommuniTeen`.`Location` (`locationID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `CommuniTeen`.`Registration` 
ADD INDEX `f_register_event_idx` (`eventID` ASC) VISIBLE,
ADD INDEX `f_register_student_idx` (`studentID` ASC) VISIBLE;
ALTER TABLE `CommuniTeen`.`Registration` 
ADD CONSTRAINT `f_register_event`
  FOREIGN KEY (`eventID`)
  REFERENCES `CommuniTeen`.`Upcoming Event` (`eventID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `f_register_student`
  FOREIGN KEY (`studentID`)
  REFERENCES `CommuniTeen`.`Student` (`studentID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `CommuniTeen`.`Group Member` 
ADD INDEX `f_groupMember_group_idx` (`groupID` ASC) VISIBLE,
ADD INDEX `f_groupMember_student_idx` (`studentID` ASC) VISIBLE;
;
ALTER TABLE `CommuniTeen`.`Group Member` 
ADD CONSTRAINT `f_groupMember_group`
  FOREIGN KEY (`groupID`)
  REFERENCES `CommuniTeen`.`Group` (`groupID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `f_groupMember_student`
  FOREIGN KEY (`studentID`)
  REFERENCES `CommuniTeen`.`Student` (`studentID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
