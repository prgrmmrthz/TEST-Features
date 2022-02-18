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
    /* Cell: ({ row }) => <div>{row.index + 1}</div> */
  },
  {
    Header: () => (
      <div
        style={{
          width: 220,
        }}
      >
        Description
      </div>
    ),
    accessor: "description",
  },
  {
    Header: () => (
      <div
        style={{
          width: 150,
        }}
      >
        Quantity
      </div>
    ),
    accessor: "quantity",
  },
  {
    Header: () => (
      <div
        style={{
          width: 150,
        }}
      >
        Unit Price
      </div>
    ),
    accessor: "unitPrice",
  },
  {
    Header: () => (
      <div
        style={{
          width: 150,
        }}
      >
        Currency
      </div>
    ),
    accessor: "currency",
  }
  ,
  {
    Header: () => (
      <div
        style={{
          width: 150,
        }}
      >
        Amount
      </div>
    ),
    accessor: "amount",
    Cell: ({ row }) => <div>{Number(row.original.amount).toFixed(2)}</div>
  }
  ];
  