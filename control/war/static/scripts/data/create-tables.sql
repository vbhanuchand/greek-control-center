CREATE TABLE blobs(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
linked_to_id INT UNSIGNED NOT NULL,
fileName VARCHAR(100) NOT NULL,
blobKey VARCHAR(250) NOT NULL,
tab ENUM('store-lease','photo','mgrContract','healthInspection','employee-docs', 'maintenance', 'accMonthlyDocument', 'store-template', 'airportSectionDocs') DEFAULT 'store-lease',
active CHAR(1) DEFAULT 'Y' NOT  NULL,
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table items(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
item_category varchar(10),
item_code INT,
item_color VARCHAR(10),
item_name VARCHAR(50),
item_par VARCHAR(10),
item_units VARCHAR(10),
item_type ENUM('distributor', 'stock-item'),
category VARCHAR(10),
store_id INT UNSIGNED NOT NULL,
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table meeting(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
summary VARCHAR(100),
agenda VARCHAR(250),
email CHAR(1) DEFAULT 'N' NOT NULL,
email_text VARCHAR(250),
fromTime TIMESTAMP,
toTime TIMESTAMP,
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP,  
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table meeting_participants(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
meeting_id INT UNSIGNED NOT NULL,
participant_email VARCHAR(50),
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE employee_role(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
employee_id INT UNSIGNED NOT NULL,	
store_id INT UNSIGNED NOT NULL,
active CHAR(1) DEFAULT 'Y' NOT  NULL,
role_tab ENUM('manage-tab','store-tab','emp-tab','inventory-tab','labor-tab','area-mgr','store-mgr', 'asst-mgr', 'shift-lead', 'store-ownr') DEFAULT 'store-tab' NOT NULL,
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE employee (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL,
  fname VARCHAR(25) NOT NULL,
  lname VARCHAR(25) NOT NULL,
  password VARCHAR(40) BINARY DEFAULT NULL,
  phone VARCHAR(20) NOT NULL,
  personalPhone VARCHAR(20),
  emergencyContact VARCHAR(30),
  address VARCHAR(100),
  active CHAR(1) DEFAULT 'Y' NOT  NULL,
  mgr_id INT UNSIGNED,
  position VARCHAR(20),
  hired_date DATE,
  updated_by INT UNSIGNED NOT NULL,
  updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE employee_discipline(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
employee_id INT UNSIGNED NOT NULL,
store_id INT UNSIGNED NOT NULL,
date DATE, 
info VARCHAR(100),
info_type ENUM('disc','good') DEFAULT 'disc',
active CHAR(1) DEFAULT 'Y' NOT  NULL,
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE employee_labor(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
employee_id INT UNSIGNED NOT NULL,
store_id INT UNSIGNED NOT NULL,
on_date DATE,
time_from_hr_min INT UNSIGNED,
time_to_hr_min INT UNSIGNED,
total_hrs DECIMAL(4,2),
position VARCHAR(20),
active CHAR(1) DEFAULT 'Y' NOT  NULL,
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE employee_leaves(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
employee_id INT UNSIGNED NOT NULL,
store_id INT UNSIGNED NOT NULL,
on_date DATE,
reason VARCHAR(100),
excused VARCHAR(100),
hrs_active INT UNSIGNED,
active CHAR(1) DEFAULT 'Y' NOT  NULL,
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE employee_review(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
employee_id INT UNSIGNED NOT NULL,
store_id INT UNSIGNED NOT NULL,
quarter INT UNSIGNED NOT NULL,
yyyy INT UNSIGNED NOT NULL,
on_date DATE,
possible_bonus DECIMAL(8,2),
bonus DECIMAL(8,2),
notes VARCHAR(100),
active CHAR(1) DEFAULT 'Y' NOT  NULL,
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE employee_salary(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
employee_id INT UNSIGNED NOT NULL,
store_id INT UNSIGNED NOT NULL,
increment_amt DECIMAL(8,2),
increment_date DATE,
salary_bef_inc DECIMAL(8,2),
salary_aft_inc DECIMAL(8,2),
notes VARCHAR(100),
active CHAR(1) DEFAULT 'Y' NOT  NULL,
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE store(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
displayName VARCHAR(50) NOT NULL,
active CHAR(1) DEFAULT 'Y' NOT  NULL,
store_address VARCHAR(100) NOT NULL,
operating_hrs VARCHAR(100) NOT NULL,
lease_copy_loc VARCHAR(100) NOT NULL,
store_notes VARCHAR(100) default 'Store Notes in DB',
contact_details VARCHAR(100) default 'Contact Details in DB',
property_info varchar(100) default 'Property Info in DB',
lease_info varchar(100) default 'Contact Details in DB',
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE store_accounting(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
store_id INT UNSIGNED NOT NULL,
quarter INT UNSIGNED NOT NULL,
yyyy INT UNSIGNED NOT NULL,
laborAmt DECIMAL(8,2),
foodCostAmt DECIMAL(8,2),
advtAmt DECIMAL(8,2),
miscAmt DECIMAL(8,2),
profitAmt DECIMAL(8,2),
totalSales DECIMAL(8,2),
totalOpExp DECIMAL(8,2),
totalProfits DECIMAL(8,2),
active CHAR(1) DEFAULT 'Y' NOT  NULL,
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table store_alarm(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
store_id INT UNSIGNED NOT NULL,
name VARCHAR(30),
code VARCHAR(10),
position VARCHAR(20),
notes VARCHAR(100),
user_number varchar(10),
active CHAR(1) DEFAULT 'Y' NOT  NULL,
updated_by INT UNSIGNED NOT NULL DEFAULT 1,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table store_date(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
store_id INT UNSIGNED NOT NULL,
imp_date DATE,
notes varchar(100),
active CHAR(1) DEFAULT 'Y' NOT  NULL,
updated_by INT UNSIGNED NOT NULL DEFAULT 1,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE store_invoice(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
store_id INT UNSIGNED NOT NULL,
invoice_date DATE,
category varchar(10),
locked CHAR(1) DEFAULT 'N' NOT  NULL,
active CHAR(1) DEFAULT 'Y' NOT  NULL,
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE store_invoice_details(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
invoice_id INT UNSIGNED NOT NULL,
item_id INT UNSIGNED NOT NULL,
item_stock INT UNSIGNED NOT NULL,
item_order INT UNSIGNED NOT NULL,
item_ppu DECIMAL(8,2),
item_gs_charge DECIMAL(8,2),
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table store_key(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
store_id INT UNSIGNED NOT NULL,
name VARCHAR(20),
type VARCHAR(30),
position VARCHAR(20),
notes VARCHAR(100),
active CHAR(1) DEFAULT 'Y' NOT  NULL,
updated_by INT UNSIGNED NOT NULL DEFAULT 1,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE store_maintenance(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
store_id INT UNSIGNED NOT NULL,
date DATE,
notes VARCHAR(200),
m_problem VARCHAR(50),
m_company VARCHAR(50),
m_phone VARCHAR(20),
active CHAR(1) DEFAULT 'Y' NOT  NULL,
updated_by INT UNSIGNED NOT NULL DEFAULT 1,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE store_stock(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
store_id INT UNSIGNED NOT NULL,
item_id INT UNSIGNED NOT NULL,
item_stock INT UNSIGNED NOT NULL,
item_order INT UNSIGNED NOT NULL,
item_ppu DECIMAL(8,2),
item_gs_charge DECIMAL(8,2),
category varchar(10),
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table upload_docs_notes(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
linked_id INT UNSIGNED NOT NULL,
purpose ENUM('healthInspection','employee-docs', 'store-template'),
purpose_date DATE,
purpose_notes VARCHAR(100),
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into store(active, displayName, store_address, operating_hrs, lease_copy_loc, updated_by, updated_date)
values ('Y', 'Downtown', 'Downtown SLC, 404 East 300 South salt lake city, ut', 'Monday - Saturday -- 11 a.m. - 10 p.m. Sunday 12 p.m. - 8 p.m.', './downtown.pdf', 1, null);
insert into store(active, displayName, store_address, operating_hrs, lease_copy_loc, updated_by, updated_date)
values ('Y', 'West Valley', 'West Valley, 2192 West 3500 South (801) 973-4976', 'Monday - Saturday 11 a.m. - 10 p.m. Sunday 12 p.m. - 8 p.m.', './westValley.pdf', 1, null);
insert into store(active, displayName, store_address, operating_hrs, lease_copy_loc, updated_by, updated_date)
values ('Y', 'Murray', 'Murray, 5692 South 900 East', 'Monday - Saturday 11 a.m. - 10 p.m. Sunday 12 p.m. - 8 p.m.', './murray.pdf', 1, null);
insert into store(active, displayName, store_address, operating_hrs, lease_copy_loc, updated_by, updated_date)
values ('Y', 'South Jordan', 'South Jordan, 1067 West South Jordan Parkway (801) 849-0653', 'Monday - Saturday 11 a.m. - 10 p.m. Closed Sunday', './southJordan.pdf', 1, null);
insert into store(active, displayName, store_address, operating_hrs, lease_copy_loc, updated_by, updated_date)
values ('Y', 'Salt Lake City', 'Salt Lake Airport SLC Airport, Terminal 2 Food Court (801) 575-2793', 'Everyday 6 a.m. - 10 p.m', './saltLake.pdf', 1, null);

insert into employee(username, fname, lname, password, phone, active, updated_by)
values ('owner', 'Chris', 'Paulos', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', '1234', 'Y', 1);

insert into employee_role(employee_id, store_id, active, role_tab, updated_by)
values (1, 1, 'Y', 'store-ownr', 0);





---CODE INTO PRODUCTION UNTIL HERE (13 Jan 2013)


















mvn archetype:generate -DgroupId=com.project.core -DartifactId=ControlCenter -DarchetypeArtifactId=maven-archetype-webapp -DinteractiveMode=false

mvn -Declipse.workspace="C:\Users\bchand\workspace-Oct15" eclipse:configure-workspace

mvn eclipse:eclipse -Dwtpversion=2.0

bhanutestinstance

DROP SCHEMA IF EXISTS control-center;
CREATE SCHEMA control-center;

create database greekapp;

USE controlcenter;

select si.id as invoiceId, si.invoiceDate as invoiceDate, s1.invTotal, s1.invGSCharges
from StoreInvoice si, (select s1.id as inv_id, sum(s1.total) as invTotal, sum(gs_total) as invGSCharges from 
(select invoiceId as id, ((itemOrder * itemPricePerUnit) + ((itemGSPercent * (itemOrder * itemPricePerUnit))/100)) as total, ((itemGSPercent * (itemOrder * itemPricePerUnit))/100) as gs_total from StoreInvoiceDetails) s1 group by s1.id) s1
where si.id = s1.inv_id and si.storeId = :storeId;


select si.id as invoiceId, si.invoiceDate as invoiceDate, sum(sid.itemPricePerUnit * sid.itemOrder) as invTotal, sum((sid.itemGSPercent * (sid.itemOrder * sid.itemPricePerUnit))/100) as invGSCharges
from StoreInvoice si, StoreInvoiceDetails sid
where si.id = sid.invoiceId and si.storeId = :storeId
group by si.id, invoiceDate;

/*DBS Cashline - Late Charges*/
/*DBS Credit Card - Late Charges*/







commit;





