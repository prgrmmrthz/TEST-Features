export const userColumn = [
  {
    Header: "Employee ID",
    accessor: "emp_id",
  },
  {
    Header: "Name",
    accessor: "name",
    Csize: 40
  },
  {
    Header: "User Name",
    accessor: "user_name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Password",
    accessor: "pword",
    Ctype: "pass"
  },
  {
    Header: "User Type",
    accessor: "user_type",
    Ctype: "ddl",
    Coptions: [
      {k: 1, v: 'Admin'},
      {k: 2, v: 'User'}
    ]
  },
];