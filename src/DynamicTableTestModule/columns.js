export const userColumn = [
  {
    Header: () => (
      <div
        style={{
          width: 10,
        }}
      >
        #
      </div>
    ),
    accessor: "lineNumber",
    Ctype: "span"
    /* Cell: ({ row }) => <div>{row.index + 1}</div> */
  },
  {
    Header: "Description",
    accessor: "description",
    Csize: 50
  },
  {
    Header: "QUANTITY",
    accessor: "quantity",
    Ctype: "number",
    Csize: 5
  },
  {
    Header: "UNIT PRICE",
    accessor: "unitPrice",
    Ctype: "number",
    Csize: 15
  },
  {
    Header: "CURRENCY",
    accessor: "currency",
    Ctype: "ddl",
    Coptions: [
      {k: 'PhP', v: 'PhP'},
      {k: 'USD', v: 'USD'}
    ]
  }
  ,
  {
    Header: "AMOUNT",
    accessor: "amount",
    Ctype: "span",
    Cell: ({ row }) => <div style={{textAlign: "right"}}>{Number(row.original.amount).toFixed(2)}</div>
  }
  ];
  