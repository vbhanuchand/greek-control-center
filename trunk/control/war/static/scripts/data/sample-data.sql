Insert into "employee" ("id","mgr_id","hired_date","position","username","fname","lname","password","phone","active","updated_by","updated_date") values (1,1,null,'Front','test1','FName 1','LName 1','5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8','1234','Y','0',to_timestamp('2013-05-14 23:35:49.0','null'));
Insert into "employee" ("id","mgr_id","hired_date","position","username","fname","lname","password","phone","active","updated_by","updated_date") values (2,1,null,'Front','test2','FName 2','LName 2','5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8','1234','Y','0',to_timestamp('2013-05-14 23:35:49.0','null'));
Insert into "employee" ("id","mgr_id","hired_date","position","username","fname","lname","password","phone","active","updated_by","updated_date") values (3,1,null,'Front','test3','FName 3','LName 3','5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8','1234','Y','0',to_timestamp('2013-05-14 23:35:49.0','null'));
Insert into "employee" ("id","mgr_id","hired_date","position","username","fname","lname","password","phone","active","updated_by","updated_date") values (4,1,null,'Front','test4','FName 4','LName 4','5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8','1234','Y','0',to_timestamp('2013-05-14 23:35:49.0','null'));
Insert into "employee" ("id","mgr_id","hired_date","position","username","fname","lname","password","phone","active","updated_by","updated_date") values (5,1,null,'Front','test5','FName 5','LName 5','5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8','1234','Y','0',to_timestamp('2013-05-14 23:35:49.0','null'));

insert into employee_salary(employee_id, store_id, increment_amt, increment_date, salary_bef_inc, salary_aft_inc, notes, updated_by)
values(1, 1, 30, sysdate(), 130, 160, "Test Notes", 1);
commit;
select * from employee_discipline;
drop table labor;
select * from employee_leaves;
insert into employee_leaves(employee_id, store_id, on_date, reason, excused, hrs_active, updated_by)
values(1, 2, sysdate(), 'Test Reason', 'Y', 10, 1);
insert into employee_discipline(employee_id, store_id, date, info, info_type, updated_by)
values(1, 2, sysdate(), 'Test Info', 'good', 1);
commit;

insert into employee(mgr_id, position, username, fname, lname, password, phone, active, updated_by)
values (1,'Owner','owner','Chris','Paulos','5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8','1234','Y', 0); 

insert into employee(mgr_id, position, username, fname, lname, password, phone, active, updated_by)
values (1,'Manager','manager','Murali','Chand','5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8','1234','Y', 0); 

insert into employee(mgr_id, position, username, fname, lname, password, phone, active, updated_by)
values (1,'Employee (Front)','employee','Frank','James','5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8','1234','Y', 0); 

insert into store (displayName,active,store_address,operating_hrs,lease_copy_loc,updated_by,updated_date,store_notes,contact_details) 
values ('Downtown','Y','Downtown SLC, 404 East 300 South ','Monday - Saturday -- 11 a.m. - 10 p.m. Sunday 12 p.m. - 8 p.m.','Downtown SLC, 404 East 300 South ',
0,null,'Store Notes in DB','+1 (801) 322-2062');

insert into store (displayName,active,store_address,operating_hrs,lease_copy_loc,updated_by,updated_date,store_notes,contact_details) 
values ('West Valley','Y','West Valley, 2192 West 3500 South (801) 973-4976','Monday - Saturday 11 a.m. - 10 p.m. Sunday 12 p.m. - 8 p.m.','./westValley.pdf',0,null,'Store Notes in DB','Contact Details in DB');

insert into store (displayName,active,store_address,operating_hrs,lease_copy_loc,updated_by,updated_date,store_notes,contact_details) 
values ('Murray','Y','Murray, 5692 South 900 East ','Monday - Saturday 11 a.m. - 10 p.m. Sunday 12 p.m. - 8 p.m.','Murray, 5692 South 900 East ',0, null,'Store Notes in DB','+1 (801) 266-3336');

insert into store (displayName,active,store_address,operating_hrs,lease_copy_loc,updated_by,updated_date,store_notes,contact_details) 
values ('South Jordan','Y','South Jordan, 1067 West South Jordan Parkway ','Monday - Saturday 11 a.m. - 10 p.m. Closed Sunday and Public Holidays','South Jordan, 1067 West South Jordan Parkway ',0, null,'Store Notes in DB Notes','+1 (801) 849-0653');

insert into store (displayName,active,store_address,operating_hrs,lease_copy_loc,updated_by,updated_date,store_notes,contact_details) 
values ('Salt Lake City','Y','Salt Lake Airport SLC Airport, Terminal 2 Food Court (801) 575-2793','Everyday 6 a.m. - 10 p.m','./saltLake.pdf',0, null,'Store Notes in DB','Contact Details in DB');


insert into employee_role (employee_id,store_id,active,role_tab,updated_by,updated_date) values (1,1,'Y','store-tab',0,null);
insert into employee_role (employee_id,store_id,active,role_tab,updated_by,updated_date) values (1,2,'Y','store-tab',0,null);
insert into employee_role (employee_id,store_id,active,role_tab,updated_by,updated_date) values (1,3,'Y','store-tab',0,null);
insert into employee_role (employee_id,store_id,active,role_tab,updated_by,updated_date) values (1,4,'Y','store-tab',0,null);
insert into employee_role (employee_id,store_id,active,role_tab,updated_by,updated_date) values (2,1,'Y','store-tab',0,null);
insert into employee_role (employee_id,store_id,active,role_tab,updated_by,updated_date) values (2,2,'Y','store-tab',0,null);
insert into employee_role (employee_id,store_id,active,role_tab,updated_by,updated_date) values (2,3,'Y','store-tab',0,null);
insert into employee_role (employee_id,store_id,active,role_tab,updated_by,updated_date) values (3,2,'Y','store-tab',0,null);
insert into employee_role (employee_id,store_id,active,role_tab,updated_by,updated_date) values (3,3,'Y','store-tab',0,null);
insert into employee_role (employee_id,store_id,active,role_tab,updated_by,updated_date) values (3,4,'Y','store-tab',0,null);
insert into employee_role (employee_id,store_id,active,role_tab,updated_by,updated_date) values (4,1,'Y','store-tab',0,null);
insert into employee_role (employee_id,store_id,active,role_tab,updated_by,updated_date) values (4,3,'Y','store-tab',0,null);







insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(1, sysdate(), 'Problem with Electricity', 'Telstar Company', '123-875-2222','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(1, sysdate()-1, 'Problem with water', 'Good Energy Company', '93502643','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(1, sysdate()-2, 'Problem with Aircon', ' NP Power Company', '83280451','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(1, sysdate()+1, 'Problem with Mechanical Maintenance', 'Lloyds TSB Company', '66566054','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(1, sysdate()+2, 'Problem with Manufacturing Machines', 'Southern Electric Company', '93113336','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(2, sysdate(), 'Problem with Water', 'NP Power Company', '66566054','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(2, sysdate()-1, 'Problem with Refrigerator', 'Telstar Company', '83280451','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(2, sysdate()-2, 'Problem with Electricity', 'Good Energy Company', '93116664','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(2, sysdate()+1, 'Problem with Manufacturing Maintenance', 'Country wide Company', '123-875-2222','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(3, sysdate()-2, 'Problem with Electricity', 'EDF Energy Company', '83280451','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(3, sysdate()+2, 'Problem with Aircon', 'Bluestar Company', '040-6332456','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(3, sysdate()-1, 'Problem with Washing Machine', 'LG Company', '93502643','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(3, sysdate()+1, 'Problem with Micro Wave ', 'Samsung Company', '93116664','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(4, sysdate()-1, 'Problem with Gas', ' Atlantic Electric and Gas Company', '66566054','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(4, sysdate()+1, 'Problem with Refrigerator', 'LG Company', '8985602245','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(4, sysdate()+2, 'Problem with Laptop', 'Lenovo Company', '9666265502','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(5, sysdate()+7, 'Problem with Playstation', 'Sony Company', '84289804','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(5, sysdate()-5, 'Problem with Mobile Phone', 'Apple Company', '8038956','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(5, sysdate()-25, 'Problem with Aircon', 'Samsung Company', '123-875-2222','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(5, sysdate()+30, 'Problem with Electricity', 'NP Power Company', '93112246','Notes', 1);

insert into store_maintenance(store_id, date, m_problem, m_company, m_phone, notes, updated_by) 
values(5, sysdate(), 'Problem with Gas', 'Esson Company', '91034782','Notes', 1);














insert into store_key(store_id, name, type, position, notes, updated_by)
values (1, 'Chris Gayle', 'Master Key', 'Owner', 'Gave it for House Keeping', 1);

insert into store_key(store_id, name, type, position, notes, updated_by)
values (1, 'Mahesh', 'Duplicate Key', 'C.E.O', 'Restaurant C.E.O', 1);

insert into store_key(store_id, name, type, position, notes, updated_by)
values (1, 'N.T.R', 'Third Key', 'Manager', 'Restaurant Manager', 1);

insert into store_key(store_id, name, type, position, notes, updated_by)
values (1, 'Samanta', 'Second Key', 'Project Lead', 'Project Details', 1);

insert into store_key(store_id, name, type, position, notes, updated_by)
values (1, 'Barun Sobthi', 'Fourth Key', 'Team Lead', 'Team Work', 1);

insert into store_key(store_id, name, type, position, notes, updated_by)
values (2, 'Saniya Irani', 'Master Key', 'Owner', 'Gave it for House Keeping', 1);

insert into store_key(store_id, name, type, position, notes, updated_by)
values (2, 'Jung So Min', 'Duplicate Key', 'Tenant', 'Gave it for Rent', 1);

insert into store_key(store_id, name, type, position, notes, updated_by)
values (2, 'Mamiji', 'Second Key', 'Maintenance', 'Gave it for House Maintenance', 1);

insert into store_key(store_id, name, type, position, notes, updated_by)
values (3, 'ASR Khusi', 'Master Key', 'Best couple', 'Won as Best Couple 2012', 1);

insert into store_key(store_id, name, type, position, notes, updated_by)
values (3, 'Shyamji', 'Second Key', 'Vilan', 'Worst Role 2012', 1);

insert into store_key(store_id, name, type, position, notes, updated_by)
values (3, 'Anjali', 'Third Key', 'Best Sister', 'Won Best Sister Award 2012', 1);

insert into store_key(store_id, name, type, position, notes, updated_by)
values (4, 'Dhoni', 'Master Key', 'Captain', 'CSK Captain', 1);

insert into store_key(store_id, name, type, position, notes, updated_by)
values (4, 'Khusi', 'Second Key', 'Maintenance', 'Gave it for House Maintenance', 1);

insert into store_key(store_id, name, type, position, notes, updated_by)
values (4, 'Mamiji', 'Third Key', 'Electrician', 'Gave it for Electric Purpose', 1);

insert into store_key(store_id, name, type, position, notes, updated_by)
values (4, 'Naniji', 'Fourth Key', 'Old Woman', 'ASR Grandma', 1);

insert into store_key(store_id, name, type, position, notes, updated_by)
values (4, 'NK', 'Duplicate Key', 'Good One', 'Good', 1);


insert into store_key(store_id, name, type, position, notes, updated_by)
values (5, 'Suma', 'Master Key', 'Manager', 'Look after all the Restaurant Details', 1);



----------------------------

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(1, 'Chris Paulos', '9848', 'Owner', 'Master Code to set off the  Smoke Alarm', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(1, 'Bhanu', '914674', 'Husband', 'Suma''s Husband', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(1, 'Ramesh Babu', '9823', 'Father-in-Law', 'Suma''s Father-in-law', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(1, 'Rani', '9234', 'Mother-in-Law', 'Suma''s Mother-in-law', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(1, 'Murali', '9127', 'Brother-in-Law', 'Suma''s Brother-in-law', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(1, 'Navya', '9564', 'Sister-in-Law', 'Suma''s Sister-in-law', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(1, 'Revanth', '92568', 'Brother', 'Suma''s Brother', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(1, 'Rama Krishna', '912674', 'Father', 'Suma''s Father', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(1, 'Padma', '95389', 'Mother', 'Suma''s Mother', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(2, 'Bhanu', '934785', 'C.E.O', 'Manage Company Details and Updates', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(2, 'Vinay', '9424', 'Project Lead', 'Handle project details', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(2, 'Phani', '9145', 'Team Lead', 'Handle Team Members', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(2, 'kalli', '9146775', 'senior developer', 'Able to do Coding', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(2, 'Sanjay', '9543665', 'Testing', 'Able to test Coding ', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(2, 'Mathew', '934785', 'Database', 'Maintain Dtabase', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(2, 'Shobha Ganesh', '91285', 'Tcs Member', 'Handle TCS projects', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(3, 'Rohitha', '9312355', 'Navya''s Friend', 'Doing her masters', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(3, 'Charan', '9134789', 'Cousin', 'Suma''s Cousin', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(3, 'Harika', '56789', 'Sister-in-law', 'Suma''s Sister-in-law', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(4, 'Swetha', '96784', 'Cousin', 'Suma''s Cousin', 1);

insert into store_alarm(store_id, name, code, position, notes, updated_by)
values(4, 'Nani', '9134789', 'Cousin', 'Suma''s Cousin', 1);