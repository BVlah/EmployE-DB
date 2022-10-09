const db = require('./db/connection');
const inquirer = require('inquirer'); 
const cTable = require('console.table'); 

db.connect((err) => {
    if (err) throw err;
    console.log(`
    ======================
    Welcome to EmployE-DB
    ======================
    `);

    dbMenu();
});


const dbMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action', 
            message: 'What would you like to do?',
            choices: [
                        'View all departments', 
                        'View all roles', 
                        'View all employees', 
                        'Add a department', 
                        'Add a role', 
                        'Add an employee', 
                        'Update an employee role',
                        "Update an employee's manager",
                        'View employees by manager',
                        'View employees by department',
                        'Delete a department',
                        'Delete a role',
                        'Delete an employee',
                        'View department budgets',
                        'Exit'
                    ]
        }
    ])
    .then((choice) => {
        const {action} = choice;

        if (action === 'View all departments') {
            viewDepartments();
        }
        if (action === 'View all roles') {
            viewRoles();
        }
        if (action === 'View all employees') {
            viewEmployees();
        }
        if (action === 'Add a department') {
            addDepartment();
        }
        if (action === 'Add a role') {
            addRole();
        }
        if (action === 'Add an employee') {
            addEmployee();
        }
        if (action === 'Update an employee role') {
            updateEmployeeRole();
        }
        if (action === "Update an employee's manager") {
            updateEmployeeManager();
        }
        if (action === 'View employees by manager') {
            viewManagerEmployees();
        }
        if (action === 'View employees by department') {
            viewDepartmentEmployees();
        }
        if (action === 'Delete a department') {
            deleteDepartment();
        }
        if (action === 'Delete a role') {
            deleteRole();
        }
        if (action === 'Delete an employee') {
            deleteEmployee();
        }
        if (action === 'View department budgets') {
            viewBudgets();
        }
        if (action === 'Exit') {
            console.log('Thanks for using EmployE-DB! Goodbye!')
            db.end()
        };
    });
};

// FUNCTIONS //
viewDepartments = () => {
    const sql = `SELECT * FROM department;`
    db.query(sql, function (err, res) {
        if (err) throw err;
        console.table(res);
        dbMenu();
    });
};

viewRoles = () => {
    const sql = `SELECT r.id, r.title, r.salary, d.name as department 
                 FROM role r 
                    JOIN department d on d.id = r.department_id;`
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        dbMenu();
    });
};

viewEmployees = () => {
    const sql = `SELECT e.id, e.first_name, e.last_name, d.name as department, r.title as job_title, r.salary, CONCAT(m.first_name, ' ', m.last_name) as manager
                 FROM employee e
                    JOIN role r on e.role_id = r.id
                    JOIN department d on r.department_id = d.id
                    LEFT JOIN employee m on e.manager_id = m.id;`
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        dbMenu();
    });
};

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDept',
            message: 'What is the name of the new department?',
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Please enter the new department');
                    return false;
                }
            }
        }
    ])
    .then((answer) => {
        db.query(`INSERT into department (name) VALUES (?);`, answer.newDept, (err, res) => {
            if (err) throw err;
            console.log(answer.newDept + ' added to departments!');
            dbMenu();
        });
    });
};

addRole = () => {
    const deptSQL = `SELECT id, name from department;`
    db.query(deptSQL, (err, data) => {
        if (err) throw err; 
        const deptList = data.map(({ id, name }) => ({ name: name, value: id }));
        
        inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'What role would you like to add?',
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter the new role');
                    return false;
                }
            }
        },
        {
            type: 'input', 
            name: 'roleSalary',
            message: "What is the salary of this role?",
            validate: addSalary => {
              if (addSalary) {
                  return true;
              } else {
                  console.log('Please enter a salary');
                  return false;
              }
            }
        },
        {
            type: 'list', 
            name: 'roleDept',
            message: "What is the department of this role?",
            choices: deptList
        }
    ])
        .then((answer) => {
            db.query(`INSERT into role (title, salary, department_id) VALUES (?, ?, ?);`, [answer.roleName, answer.roleSalary, answer.roleDept], (err, res) => {
                if (err) throw err;
                console.log(answer.roleName + ' added to roles!');
                viewRoles();
            });
        });
    });
};

addEmployee = () => {
    const roleSQL = `SELECT id, title from role;`
    const managerSQL = `SELECT id, CONCAT(first_name, ' ', last_name) as name from employee;`

    db.query(roleSQL, (err, data) => {
        if (err) throw err; 
        const roleList = data.map(({id, title}) => ({name: title, value: id}));
        
        db.query(managerSQL, (err, data2) => {
            if (err) throw err; 
            const managerList = data2.map(({id, name}) => ({name: name, value: id}));
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: "What is the new employee's first name?",
                    validate: firstName => {
                        if (firstName) {
                            return true;
                        } else {
                            console.log("Please enter the employee's first name");
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "What is the new employee's last name?",
                    validate: lastName => {
                        if (lastName) {
                            return true;
                        } else {
                            console.log("Please enter the employee's last name");
                            return false;
                        }
                    }
                },
                {
                    type: 'list', 
                    name: 'employeeRole',
                    message: "What is the new employee's role?",
                    choices: roleList
                },
                {
                    type: 'confirm', 
                    name: 'confirmManager',
                    message: "Does the employee have a manager?",
                    default: true
                },
                {
                    type: 'list', 
                    name: 'employeeManager',
                    message: "What is the new employee's manager?",
                    choices: managerList,
                    when: ({confirmManager}) => {
                        if (confirmManager) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            ])
            .then((answer) => {
                db.query(`INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, [answer.firstName, answer.lastName, answer.employeeRole, answer.employeeManager], (err, res) => {
                    if (err) throw err;
                    console.log(answer.firstName + ' ' + answer.last_name + ' added to roles!');
                    viewEmployees();
                });
            });
        });
    });  
};

updateEmployeeRole = () => {
    const employeeSQL = `SELECT id, CONCAT(first_name, ' ', last_name) as name from employee;`
    const roleSQL = `SELECT id, title from role;`
    
    db.query(roleSQL, (err, data) => {
        if (err) throw err; 
        const roleList = data.map(({id, title}) => ({name: title, value: id}));
        
        db.query(employeeSQL, (err, data2) => {
            if (err) throw err; 
            const employeeList = data2.map(({id, name}) => ({name: name, value: id}));
            
            inquirer.prompt([
                {
                    type: 'list', 
                    name: 'employee',
                    message: "Which employee would you like to update?",
                    choices: employeeList
                },
                {
                    type: 'list', 
                    name: 'employeeRole',
                    message: "What is the employee's new role?",
                    choices: roleList
                }
            ])
            .then((answer) => {
                db.query(`UPDATE employee set role_id = ? where id = ?;`, [answer.employeeRole, answer.employee], (err, res) => {
                    if (err) throw err;
                    console.log("The employee's role has been updated!");
                    viewEmployees();
                });
            });
        });
    });
};

updateEmployeeManager = () => {
    const employeeSQL = `SELECT id, CONCAT(first_name, ' ', last_name) as name from employee;`
    const managerSQL = `SELECT id, CONCAT(first_name, ' ', last_name) as name from employee;`
    
    db.query(managerSQL, (err, data) => {
        if (err) throw err; 
        const managerList = data.map(({id, name}) => ({name: name, value: id}));
        managerList.push({name: 'No Manager', value: 0});
        console.log(managerList);
        
        db.query(employeeSQL, (err, data2) => {
            if (err) throw err; 
            const employeeList = data2.map(({id, name}) => ({name: name, value: id}));
            
            inquirer.prompt([
                {
                    type: 'list', 
                    name: 'employee',
                    message: "Which employee would you like to update?",
                    choices: employeeList
                },
                {
                    type: 'list', 
                    name: 'employeeManager',
                    message: "Who is the employee's new manager?",
                    choices: managerList
                }
            ])
            .then((answer) => {
                const {choice} = answer;
                if (choice === 'No Manager') {
                    db.query(`UPDATE employee set manager_id = null where id = ?;`, answer.employee, (err, res) => {
                        if (err) throw err;
                        console.log("The employee's manager has been removed!");
                        viewEmployees();
                    });
                }
                db.query(`UPDATE employee set manager_id = ? where id = ?;`, [answer.employeeManager, answer.employee], (err, res) => {
                    if (err) throw err;
                    console.log("The employee's manager has been updated!");
                    viewEmployees();
                });
            });
        });
    });
};

viewManagerEmployees = () => {
    const managerSQL = `SELECT id, CONCAT(first_name, ' ', last_name) as name from employee where id in (SELECT DISTINCT manager_id from employee);`

    db.query(managerSQL, (err, data) => {
        if (err) throw err; 
        const managerList = data.map(({id, name}) => ({name: name, value: id}));

        inquirer.prompt([
            {
                type: 'list', 
                name: 'manager',
                message: "Which manager would you like to view the employees of?",
                choices: managerList
            }
        ])
        .then((answer) => {
            db.query(`SELECT CONCAT(m.first_name, ' ', m.last_name) as manager, CONCAT(e.first_name, ' ', e.last_name) as employee, d.name as department, r.title as role
                      FROM employee e
                        JOIN role r on e.role_id = r.id
                        JOIN department d on r.department_id = d.id
                        LEFT JOIN employee m on e.manager_id = m.id
                      WHERE m.id = ?`, 
                      answer.manager, (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        dbMenu();
            });
        });
    });
};

viewDepartmentEmployees = () => {
    const departmentSQL = `SELECT id, name from department;`

    db.query(departmentSQL, (err, data) => {
        if (err) throw err; 
        const departmentList = data.map(({id, name}) => ({name: name, value: id}));

        inquirer.prompt([
            {
                type: 'list', 
                name: 'department',
                message: "Which department would you like to view the employees of?",
                choices: departmentList
            }
        ])
        .then((answer) => {
            db.query(`SELECT d.name as department, CONCAT(e.first_name, ' ', e.last_name) as employee, r.title, r.salary
                      FROM department d
                        JOIN role r on r.department_id = d.id
                        JOIN employee e on e.role_id = r.id
                      WHERE d.id = ?`, 
                      answer.department, (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        dbMenu();
            });
        });
    });
};


deleteDepartment = () => {
    const departmentSQL = `SELECT id, name from department;`

    db.query(departmentSQL, (err, data) => {
        if (err) throw err; 
        const departmentList = data.map(({id, name}) => ({name: name, value: id}));

        inquirer.prompt([
            {
                type: 'list', 
                name: 'department',
                message: "Which department would you like to delete?",
                choices: departmentList
            }
        ])
        .then((answer) => {
            db.query(`DELETE from department where id = ?`, answer.department, (err, res) => {
                if (err) throw err;
                console.log('The department has been deleted!');
                viewDepartments();
            });
        });
    });
};

deleteRole = () => {
    const roleSQL = `SELECT id, title from role;`

    db.query(roleSQL, (err, data) => {
        if (err) throw err; 
        const roleList = data.map(({id, title}) => ({name: title, value: id}));

        inquirer.prompt([
            {
                type: 'list', 
                name: 'role',
                message: "Which role would you like to delete?",
                choices: roleList
            }
        ])
        .then((answer) => {
            db.query(`DELETE from role where id = ?`, answer.role, (err, res) => {
                if (err) throw err;
                console.log('The role has been deleted!');
                viewRoles();
            });
        });
    });
};

deleteEmployee = () => {
    const employeeSQL = `SELECT id, CONCAT(first_name, ' ', last_name) as name from employee;`

    db.query(employeeSQL, (err, data) => {
        if (err) throw err; 
        const employeeList = data.map(({id, name}) => ({name: name, value: id}));

        inquirer.prompt([
            {
                type: 'list', 
                name: 'employee',
                message: "Which employee would you like to delete?",
                choices: employeeList
            }
        ])
        .then((answer) => {
            db.query(`DELETE from employee where id = ?`, answer.employee, (err, res) => {
                if (err) throw err;
                console.log('The employee has been deleted!');
                viewEmployees();
            });
        });
    });
};

viewBudgets = () => {
    const sql = `SELECT d.id, d.name, SUM(r.salary) as total_budget
                 FROM role r
                    JOIN department d on d.id = r.department_id
                 GROUP BY d.id, d.name`
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        dbMenu();
    });
};