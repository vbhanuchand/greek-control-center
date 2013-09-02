insert into store(active, displayName, store_address, operating_hrs, lease_copy_loc, updated_by, updated_date)
values ('Y', 'Downtown', 'Downtown SLC, 404 East 300 South, (801) 322-2062', 'Monday - Saturday -- 11 a.m. - 10 p.m. Sunday 12 p.m. - 8 p.m.', './downtown.pdf', 1, null);
insert into store(active, displayName, store_address, operating_hrs, lease_copy_loc, updated_by, updated_date)
values ('Y', 'West Valley', 'West Valley, 2192 West 3500 South (801) 973-4976', 'Monday - Saturday 11 a.m. - 10 p.m. Sunday 12 p.m. - 8 p.m.', './westValley.pdf', 1, null);
insert into store(active, displayName, store_address, operating_hrs, lease_copy_loc, updated_by, updated_date)
values ('Y', 'Murray', 'Murray, 5692 South 900 East (801) 266-3336', 'Monday - Saturday 11 a.m. - 10 p.m. Sunday 12 p.m. - 8 p.m.', './murray.pdf', 1, null);
insert into store(active, displayName, store_address, operating_hrs, lease_copy_loc, updated_by, updated_date)
values ('Y', 'South Jordan', 'South Jordan, 1067 West South Jordan Parkway (801) 849-0653', 'Monday - Saturday 11 a.m. - 10 p.m. Closed Sunday', './southJordan.pdf', 1, null);
insert into store(active, displayName, store_address, operating_hrs, lease_copy_loc, updated_by, updated_date)
values ('Y', 'Salt Lake', 'Salt Lake Airport SLC Airport, Terminal 2 Food Court (801) 575-2793', 'Everyday 6 a.m. - 10 p.m', './saltLake.pdf', 1, null);
update employee set mgr_id=1;
select * from employee_labor;
desc employee_salary; 
desc store;
select * from store_accounting;
delete from store_stock;
commit;
drop table store;
select * from blobs where linked_to_id=1 and tab='photo' order by updated_date desc;
select * from employee_role;
describe employee_role;
select * from store_stock;

select employee0_.id as col_0_0_, role1_.role_tab as col_1_0_, employee0_.fname as col_2_0_, employee0_.lname as col_3_0_, role1_.store_id as col_4_0_ from employee employee0_ cross join employee_role role1_ where employee0_.id=role1_.employee_id and employee0_.position='Manager' order by employee0_.id, role1_.store_id, role1_.role_tab;
select * from employee where position='Manager';
select * from employee_role where employee_id in (1, 7);

alter table blobs modify tab ENUM('store-lease', 'maintenance', 'photo', 'mgrContract') DEFAULT 'store-lease';

alter table employee add personalPhone VARCHAR(20) after phone;
alter table employee add emergencyContact VARCHAR(30) after personalPhone;
alter table employee add address VARCHAR(40) after emergencyContact;

alter table blobs modify tab ENUM('store-lease', 'maintenance','photo') DEFAULT 'store-lease';
commit;
select * from blobs;
select * from store_date;
commit;
update store_date set notes = 'Sample Notes for this date';
alter table store_date add notes VARCHAR(100) after imp_date;

select store0_.id as id6_4_, store0_.active as active6_4_, store0_.contact_details as contact3_6_4_, store0_.displayName as displayN4_6_4_, store0_.lease_copy_loc as lease5_6_4_, store0_.operating_hrs as operating6_6_4_, store0_.store_address as store7_6_4_, store0_.store_notes as store8_6_4_, store0_.updated_by as updated9_6_4_, store0_.updated_date as updated10_6_4_, storealarm1_.store_id as store7_6_6_, storealarm1_.id as id7_6_, storealarm1_.id as id7_0_, storealarm1_.active as active7_0_, storealarm1_.code as code7_0_, storealarm1_.name as name7_0_, storealarm1_.notes as notes7_0_, storealarm1_.position as position7_0_, storealarm1_.store_id as store7_7_0_, storealarm1_.updated_by as updated8_7_0_, storealarm1_.updated_date as updated9_7_0_, storedater2_.store_id as store4_6_7_, storedater2_.id as id8_7_, storedater2_.id as id8_1_, storedater2_.active as active8_1_, storedater2_.imp_date as imp3_8_1_, storedater2_.store_id as store4_8_1_, storedater2_.updated_by as updated5_8_1_, storedater2_.updated_date as updated6_8_1_, storekeyre3_.store_id as store6_6_8_, storekeyre3_.id as id9_8_, storekeyre3_.id as id9_2_, storekeyre3_.active as active9_2_, storekeyre3_.name as name9_2_, storekeyre3_.notes as notes9_2_, storekeyre3_.position as position9_2_, storekeyre3_.store_id as store6_9_2_, storekeyre3_.type as type9_2_, storekeyre3_.updated_by as updated8_9_2_, storekeyre3_.updated_date as updated9_9_2_, storemaint4_.store_id as store8_6_9_, storemaint4_.id as id10_9_, storemaint4_.id as id10_3_, storemaint4_.active as active10_3_, storemaint4_.m_company as m3_10_3_, storemaint4_.date as date10_3_, storemaint4_.notes as notes10_3_, storemaint4_.m_phone as m6_10_3_, storemaint4_.m_problem as m7_10_3_, storemaint4_.store_id as store8_10_3_, storemaint4_.updated_by as updated9_10_3_, storemaint4_.updated_date as updated10_10_3_ from store store0_ left outer join store_alarm storealarm1_ on store0_.id=storealarm1_.store_id left outer join store_date storedater2_ on store0_.id=storedater2_.store_id left outer join store_key storekeyre3_ on store0_.id=storekeyre3_.store_id left outer join store_maintenance storemaint4_ on store0_.id=storemaint4_.store_id where store0_.id=3;
select employeela0_.id as col_0_0_, employee1_.id as col_1_0_, employee1_.fname as col_2_0_, employeela0_.on_date as col_3_0_, employeela0_.position as col_4_0_, employeela0_.time_from_hr_min as col_5_0_, employeela0_.time_to_hr_min as col_6_0_, employeela0_.total_hrs as col_7_0_ from employee_labor employeela0_ cross join employee employee1_ where employee1_.id=employeela0_.employee_id and employeela0_.store_id=3 order by employeela0_.on_date;
SHOW VARIABLES LIKE "%version%";
show tables;
select * from employee where id=1;
update employee_labor set total_hrs = (time_to_hr_min - time_from_hr_min)/100;
commit;
select * from employee_labor order by updated_date desc;
select on_date, position, sum(total_hrs) from employee_labor group by on_date, position, store_id having store_id=3 order by on_date desc;
commit;

select employeela0_.on_date as col_0_0_, employeela0_.position as col_1_0_, sum(employeela0_.total_hrs) as col_2_0_ from employee_labor employeela0_ group by employeela0_.on_date , employeela0_.position , employeela0_.store_id having employeela0_.store_id=3 order by col_0_0_ desc


select employeela0_.on_date as col_0_0_, employeela0_.position as col_1_0_, sum(employeela0_.total_hrs) as col_2_0_ from employee_labor employeela0_ group by employeela0_.on_date , employeela0_.position , employeela0_.store_id having employeela0_.store_id=3 order by col_0_0_ desc;

alter table employee_labor add total_hrs DECIMAL(4,2) after time_to_hr_min;
rename table employees to employee;
select * from employee;
select * from employee_role;
alter table employee_discipline add date DATE after store_id;
alter table employee_salary modify increment_amt decimal(8,2);
alter table employee_salary modify salary_aft_inc decimal(8,2);
ALTER TABLE employee ADD mgr_id INT UNSIGNED AFTER id;
ALTER TABLE employee ADD hired_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER mgr_id;
update store set displayName='Downtown' where store_id=1;
update store set displayName='West Valley' where store_id=2;
update store set displayName='Murray' where store_id=3;
update store set displayName='South Jordan' where store_id=4;
update store set displayName='Salt Lake City' where store_id=5;

update employee set password='5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8';
select count(*) from employee;
update employee set hired_date = sysdate();
select * from store;
--Maintenance Table Related Data
drop table maintenance;
select * from maintenance;
commit;
insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(1, sysdate(), 'Problem with Electricity', 'Telstar Company', '123-875-2222', '', 1);


insert into store_key(store_id, name, type, position, notes, updated_by)
values (1, 'Chris Gayle', 'Master Key', 'Owner', 'Gave it for House Keeping', 1);


insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(1, 'Chris Paulos', '9848', 'Owner', 'Master Code to set off the  Smoke Alarm', 1);

select * from store_date;
insert into store_date(store_id, imp_date, updated_by)
values(1, sysdate(), 1);

insert into store_date(store_id, imp_date, updated_by)
values(2, sysdate()-3, 1);

insert into store_date(store_id, imp_date, updated_by)
values(1, sysdate()+3, 1);

insert into store_date(store_id, imp_date, updated_by)
values(2, sysdate()-4, 1);

insert into store_date(store_id, imp_date, updated_by)
values(2, sysdate()+6, 1);
commit;



select * from store_date;




insert into employee(username, fname, lname, password, phone, active, updated_by)
values ('test1', 'FName 1', 'LName 1', 'password', '1234', 'Y', 1)
insert into employee(username, fname, lname, password, phone, active, updated_by)
values ('test2', 'FName 2', 'LName 2', 'password', '1234', 'Y', 1)
insert into employee(username, fname, lname, password, phone, active, updated_by)
values ('test3', 'FName 3', 'LName 3', 'password', '1234', 'Y', 1)
insert into employee(username, fname, lname, password, phone, active, updated_by)
values ('test4', 'FName 4', 'LName 4', 'password', '1234', 'Y', 1)
insert into employee(username, fname, lname, password, phone, active, updated_by)
values ('test5', 'FName 5', 'LName 5', 'password', '1234', 'Y', 1)
commit;
select * from employee;
alter table store change store_id id INT UNSIGNED NOT NULL AUTO_INCREMENT;
update employees set updated_by=0;

alter table store add contact_details VARCHAR(100) NULL default 'Contact Details in DB';



alter table labor change status active VARCHAR(10);
update labor set active="Y";
alter table labor change active active CHAR(1) DEFAULT 'Y' NOT  NULL;

alter table employee_audit add active CHAR(1) DEFAULT 'Y' NOT  NULL;

commit;

update employee set active="Y";
select * from store;

insert into employee_role(employee_id, store_id, updated_by)
values (6, 1, 0);
insert into employee_role(employee_id, store_id, updated_by)
values (6, 2, 0);
insert into employee_role(employee_id, store_id, updated_by)
values (6, 3, 0);
insert into employee_role(employee_id, store_id, updated_by)
values (6, 4, 0);
insert into employee_role(employee_id, store_id, updated_by)
values (2, 1, 0);
insert into employee_role(employee_id, store_id, updated_by)
values (2, 2, 0);
insert into employee_role(employee_id, store_id, updated_by)
values (2, 3, 0);
insert into employee_role(employee_id, store_id, updated_by)
values (3, 2, 0);
insert into employee_role(employee_id, store_id, updated_by)
values (3, 3, 0);
insert into employee_role(employee_id, store_id, updated_by)
values (3, 4, 0);
insert into employee_role(employee_id, store_id, updated_by)
values (4, 1, 0);
insert into employee_role(employee_id, store_id, updated_by)
values (4, 3, 0);
commit;

select * from employee_role;
update employee_role set role_tab ='' where id in (1, 3, 5);

select this_.ID as ID0_2_, this_.ACTIVE as ACTIVE0_2_, this_.FNAME as FNAME0_2_, this_.LNAME as LNAME0_2_, this_.MGR_ID as MGR5_0_2_, this_.PASSWORD as PASSWORD0_2_, this_.PHONE as PHONE0_2_, this_.UPDATED_BY as UPDATED8_0_2_, this_.UPDATED_DATE as UPDATED9_0_2_, this_.USERNAME as USERNAME0_2_, employeero2_.EMPLOYEE_ID as EMPLOYEE7_0_4_, employeero2_.ID as ID1_4_, employeero2_.ID as ID1_0_, employeero2_.ACTIVE as ACTIVE1_0_, employeero2_.EMPLOYEE_ID as EMPLOYEE7_1_0_, employeero2_.ROLE_TAB as ROLE3_1_0_, employeero2_.STORE_ID as STORE4_1_0_, employeero2_.UPDATED_BY as UPDATED5_1_0_, employeero2_.UPDATED_DATE as UPDATED6_1_0_, store3_.employee_ID as employee7_0_5_, store4_.id as store4_1_5_, store4_.id as id2_1_, store4_.ACTIVE as ACTIVE2_1_, store4_.displayName as displayN3_2_1_, store4_.lease_copy_loc as lease4_2_1_, store4_.operating_hrs as operating5_2_1_, store4_.store_address as store6_2_1_, store4_.updated_by as updated7_2_1_, store4_.updated_date as updated8_2_1_ from EMPLOYEE this_ left outer join EMPLOYEE_ROLE employeero2_ on this_.ID=employeero2_.EMPLOYEE_ID left outer join EMPLOYEE_ROLE store3_ on this_.ID=store3_.employee_ID left outer join STORE store4_ on store3_.store_id=store4_.id;

CREATE TABLE maintenance(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
type ENUM('imp-dates','notes-on-lease','maintenance','alarm-code','keys') NOT NULL DEFAULT 'maintenance',
active CHAR(1) DEFAULT 'Y' NOT  NULL,
store_id INT UNSIGNED NOT NULL,
date TIMESTAMP,
notes VARCHAR(250),
a_code_name VARCHAR(30),
a_code VARCHAR(10),
position VARCHAR(20),
k_name VARCHAR(20),
k_type VARCHAR(30),
m_problem VARCHAR(50),
m_company VARCHAR(50),
m_phone VARCHAR(20),
m_notes VARCHAR(200),
updated_by INT UNSIGNED NOT NULL,
updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


select si.id, si.invoice_date, sum(sid.item_ppu * ),  
from store_invoice si, store_invoice_details sid 
where si.invoice_id = sid.id and si.invoice_id = 1;

select si.id, si.invoice_date, s1.inv_total, s1.inv_gs_charges
from store_invoice si, 
(select s1.id as inv_id, sum(s1.total) as inv_total, sum(gs_total) as inv_gs_charges 
from (select invoice_id as id, ((item_order * item_ppu) + ((item_gs_charge * (item_order * item_ppu))/100)) as total, ((item_gs_charge * (item_order * item_ppu))/100) as gs_total
from store_invoice_details) s1
group by s1.id) s1
where si.id = s1.inv_id and si.store_id = 3;

select si.id, si.invoice_date, sum(sid.item_ppu * sid.item_order), sum((sid.item_gs_charge * (sid.item_order * sid.item_ppu))/100) 
from store_invoice si, store_invoice_details sid
where si.id = sid.invoice_id and si.store_id=3
group by si.id, invoice_date;



select * from store_invoice;
select * from store_invoice_details;
delete from store_invoice_details where invoice_id = 3;
commit;


select * from employee where username='owner';
select * from employee_role where employee_id=6;
desc employee_role;