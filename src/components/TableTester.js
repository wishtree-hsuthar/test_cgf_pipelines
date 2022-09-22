import React, { useEffect } from "react";
import TableComponent from "./TableComponent";

//We need to pass from this file
const tableHead = [
    {
        id: "operationalMember",
        disablePadding: true,
        label: "Operational Member",
    },
    {
        id: "emailId",
        disablePadding: false,
        label: "Email Id",
    },
    {
        id: "assessments",
        disablePadding: false,
        label: "Assessments",
    },
    {
        id: "createdOn",
        disablePadding: false,
        label: "Created On",
    },
    {
        id: "status",
        disablePadding: false,
        label: "Status",
    },
    {
        id: "action",
        disablePadding: false,
        label: "Action",
    },
];
//Array of Object (idealy we will get this data from backend)
const rows = [
    {
        _id: "1",
        operationalMember: "jeff Hall",
        emailId: "jeffbezoz@gmail.com",
        assessments: "internal",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: true,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "2",
        operationalMember: "Edward Meaning",
        emailId: "EdwardMeaning53@gmail.com",
        assessments: "internal",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: false,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "3",
        operationalMember: "William Johnsan bhai",
        emailId: "WillianJohnbhai4509@gmail.com",
        assessments: "External",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: true,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "4",
        operationalMember: "harry robot son",
        emailId: "harrykakaji3209@zero.com",
        assessments: "External",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: true,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "5",
        operationalMember: "joe biden",
        emailId: "joeBidenladen@gmail.com",
        assessments: "internal",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: false,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "6",
        operationalMember: "Vladimir Putin",
        emailId: "vladputin007@gmail.com",
        assessments: "External",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: true,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "7",
        operationalMember: "Anderson James",
        emailId: "Andersonvirat65@gmail.com",
        assessments: "internal",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: true,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "8",
        operationalMember: "Virat Kohli",
        emailId: "ViratRunMachicne@icc.com",
        assessments: "internal",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: true,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "9",
        operationalMember: "Sachin Tendulkar",
        emailId: "SachinMumbaikar123@gmail.com",
        assessments: "internal",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: false,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "10",
        operationalMember: "Mahendra Singh Dhoni",
        emailId: "Mahikmatvalie@csk.com",
        assessments: "external",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: true,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "11",
        operationalMember: "SRK",
        emailId: "srkverse@gmail.com",
        assessments: "internal",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: false,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "12",
        operationalMember: "salman khan",
        emailId: "blackbug123@gmail.com",
        assessments: "internal",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: true,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "13",
        operationalMember: "Rishabh Pant",
        emailId: "rishabhPant234@gmail.com",
        assessments: "External",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: true,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "14",
        operationalMember: "Jasprit Bumrah",
        emailId: "yorkerking007@gmail.com",
        assessments: "internal",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: true,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "15",
        operationalMember: "Mohammad Shami",
        emailId: "mohammadshami002@gmail.com",
        assessments: "internal",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: true,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "16",
        operationalMember: "Rohit Sharma",
        emailId: "rosuperhitsharma234@gmail.com",
        assessments: "External",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: false,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
    {
        _id: "17",
        operationalMember: "Ravindra Jadeja",
        emailId: "sirjadeja123@gmail.com",
        assessments: "internal",
        createdOn: new Date().toLocaleDateString("en-GB"),
        isActive: true,
        createdBy: "rajkumar",
        updatedAt: new Date().toLocaleDateString("en-GB"),
    },
];
const TableTester = () => {
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    //array to get array of selected rows ids
    const [selected, setSelected] = React.useState([]);
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("operationalMember");

    //page change handler
    const handleTableTesterPageChange = (newPage) => {
        console.log("new Page", newPage);
        setPage(newPage);
    };

    //rows per page change handler
    const handleTableTesterRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    //on Click of visibility icon
    const onClickVisibilityIconHandler = (id) => {
        console.log("id", id);
    };

    //on Click of delete icon
    const onClickDeleteIconHandler = (id) => {
        console.log("member on Delete click", id);
    };

    //implemention of pagination on front-end
    let records = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    const tempRows = [...records];

    //deleting unneccesary fields
    tempRows.forEach((object) => {
        delete object["createdBy"];
        delete object["updatedAt"];
    });
    console.log(
        "page: ",
        page,
        "rows Per Page: ",
        rowsPerPage,
        "order: ",
        order,
        "order By: ",
        orderBy
    );

    return (
        <div>
            <TableComponent
                tableHead={tableHead}
                records={records}
                handleChangePage1={handleTableTesterPageChange}
                handleChangeRowsPerPage1={handleTableTesterRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                totalRecords={rows.length}
                orderBy={orderBy}
                icons={["visibility"]}
                onClickVisibilityIconHandler1={onClickVisibilityIconHandler}
                onClickDeleteIconHandler1={onClickDeleteIconHandler}
                order={order}
                setOrder={setOrder}
                setOrderBy={setOrderBy}
                selected={selected}
                setSelected={setSelected}
            />
        </div>
    );
};

export default TableTester;
