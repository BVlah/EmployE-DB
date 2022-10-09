USE employe_db;

INSERT INTO department (name)
VALUES  ('Ops'),
        ('Development'),
        ('HR'),
        ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES  ('Customer Support Rep', 50000, 1),
        ('Account Manager', 100000, 1),
        ('Back-End Developer', 100000, 2),
        ('Front-End Developer', 90000, 2),
        ('HR Coordinator', 60000, 3),
        ('Sales Rep', 75000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Brennan', 'Vlahcevic', 1, 4),
        ('Connor', 'Jones', 1, 4),
        ('Restaurant', 'Carl', 2, null),
        ('Manny', 'Head', 2, null),
        ('Kelly', 'Underwood', 6, null),
        ('Greg', 'Wanerayna', 3, null),
        ('Austin', 'Plastic', 4, null),
        ('Karen', 'Clark', 5, null);