import { EditOutlined } from "@mui/icons-material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import PropTypes from "prop-types";
import * as React from "react";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import Radio from "@mui/material/Radio";
import { Logger } from "../Logger/Logger";

import { MenuItem, Pagination, Select, Stack, Tooltip } from "@mui/material";
import "./TableComponent.css";

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    tableHead,
    numSelected,
    rowCount,
    onRequestSort,
    setCheckBoxes,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {setCheckBoxes && (
          <TableCell padding="checkbox" className="table-checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
              className="checkbox-mui"
            />
          </TableCell>
        )}
        {tableHead.map((headCell) => (
          <TableCell
            key={headCell.id}
            width={headCell?.width}
            align="left"
            padding={headCell.disablePadding ? "none" : "normal"}
            // sortDirection={orderBy === headCell.id ? order : false}
            className="table-header"
          >
            {headCell.id !== "action" && (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                className="sorted-blk"
              >
                {headCell.label}
              </TableSortLabel>
            )}
            {headCell.id === "action" && (
              <span className="sorted-blk">{headCell.label}</span>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function TableComponent({
  tableHead,
  records,
  page = 1,
  rowsPerPage = 10,
  handleChangeRowsPerPage1,
  handleChangePage1,
  totalRecords,
  orderBy,
  setOrderBy,
  icons,
  onClickVisibilityIconHandler1,
  onClickDeleteIconHandler1,
  selected = [],
  setSelected,
  order = "asc",
  setOrder,
  setCheckBoxes = true,
  setSingleSelect = false,
  handleSingleUserSelect,
  selectedUser,
  onRowClick = false,
  isQuestionnare = false,
  onClickEditAssesmentFunction,
  onClickAssignAssesmentFunction,
  onClickFillAssessmentFunction,
  viewAssessment = false,
}) {
  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = records.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (_event, newPage) => {
    handleChangePage1(newPage);
  };

  const handleSingleSelect = (id) => {
    handleSingleUserSelect(id);
  };

  const handleChangeRowsPerPage = (event) => {
    handleChangeRowsPerPage1(event);
  };
  const onClickVisibilityIconHandler = (id, isOperationMember) => {
    Logger.debug("Inside on click handler", isOperationMember);
    onClickVisibilityIconHandler1(
      id,
      isOperationMember ? isOperationMember : false
    );
  };
  const onClickDeleteIconHandler = (id) => {
    onClickDeleteIconHandler1(id);
  };
  const onClickEditAssessmentHandler = (uuid) => {
    onClickEditAssesmentFunction(uuid);
  };

  const onClickFillAssessmentHandler = (uuid) => {
    onClickFillAssessmentFunction(uuid);
  };
  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty records.
  // const emptyRows =
  //   page > 1 ? Math.max(0, page * rowsPerPage - totalRecords) : 0;
  // Logger.debug("selected rows",selected)
  return (
    <>
      <Box
        sx={{ width: "100%" }}
        className={
          setCheckBoxes ? "table-blk" : "table-blk table-blk-without-checkbox"
        }
      >
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                tableHead={tableHead}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={records.length}
                setCheckBoxes={setCheckBoxes}
              />
              {records?.length > 0 ? (
                <TableBody>
                  {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                   records.slice().sort(getComparator(order, orderBy)) */}
                  {records.map((row, index) => {
                    Logger.debug("row", row);
                    const isItemSelected = isSelected(row._id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={() =>
                          onRowClick &&
                          onClickVisibilityIconHandler(
                            isQuestionnare ? row.uuid : row._id,
                            row?.isOperationMember ||
                              row?.isMemberRepresentative
                          )
                        }
                        style={{
                          cursor: onRowClick && "pointer",
                        }}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row?._id}
                        selected={isItemSelected}
                      >
                        {setCheckBoxes && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              className="table-checkbox"
                              color="primary"
                              onClick={(e) => handleClick(e, row._id)}
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>
                        )}
                        {setSingleSelect && (
                          <TableCell>
                            <div className="radio-btn-field">
                              <Radio
                                className="radio-btn"
                                color="primary"
                                value={row._id}
                                onChange={() => handleSingleSelect(row._id)}
                                checked={selectedUser == row._id}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            </div>
                          </TableCell>
                        )}
                        {Object.keys(row).map((cell, _id) => {
                          if (
                            cell !== "_id" &&
                            cell !== "uuid" &&
                            cell !== "isActive" &&
                            cell !== "isUserAuthorizedToFillAssessment" &&
                            cell !== "isOperationMember" &&
                            cell !== "isMemberRepresentative" &&
                            cell !== "dueDate"
                          ) {
                            return row[cell]?.length <= 28 ||
                              typeof row[cell] === "undefined" ? (
                              <TableCell key={cell}>
                                {" "}
                                {(typeof row[cell] === "undefined" || row[cell] === "") && "N/A"}
                                {typeof row[cell] === "string" && row[cell]?.length > 0 &&
                                cell !== "email"
                                  ? row[cell][0].toUpperCase() +
                                    row[cell]?.slice(1)
                                  : row[cell]}
                              </TableCell>
                            ) : (
                              <Tooltip
                                key={cell}
                                placement="bottom-start"
                                enterDelay={1000}
                                title={row[cell]}
                              >
                                <TableCell key={cell}>
                                  {typeof row[cell] === "string" &&
                                  cell !== "email"
                                    ? row[cell][0].toUpperCase() +
                                      `${row[cell]?.slice(1, 28)}...`
                                    : `${row[cell]?.slice(0, 28)}...`}
                                </TableCell>
                              </Tooltip>
                            );
                          } else if (cell === "isActive") {
                            return (
                              <TableCell
                                className={`button-style ${
                                  row[cell] && "button-style-success"
                                }`}
                                key={cell}
                              >
                                <span>{row[cell] ? "Active" : "Inactive"}</span>
                              </TableCell>
                            );
                          } else if (cell === "dueDate") {
                            Logger.debug(
                              "due date  = ",
                              new Date(row[cell]).toLocaleDateString("en")
                            );
                            Logger.debug(
                              "current date  = ",
                              new Date().toLocaleDateString("en")
                            );
                            Logger.debug(
                              "Comparison = ",
                              new Date(
                                new Date(row[cell]).toLocaleDateString("en")
                              ).getTime() >=
                                new Date(
                                  new Date().toLocaleDateString("en")
                                ).getTime()
                            );
                            return (
                              <TableCell
                                className={`due-date-style ${
                                  new Date(
                                    new Date(row[cell]).toLocaleDateString("en")
                                  ).getTime() >=
                                    new Date(
                                      new Date().toLocaleDateString("en")
                                    ).getTime() && "due-date-style-success"
                                }`}
                                key={cell}
                              >
                                <span>{row[cell] ?? row[cell]}</span>
                              </TableCell>
                            );
                          }
                        })}
                        {icons?.length > 0 && (
                          <TableCell
                          // width={`${100 / (tableHead ? tableHead.length : 1)}%`}
                          >
                            {icons.includes("visibility") && (
                              <span className="icon">
                                <Tooltip title="View Assessment">
                                  <VisibilityOutlinedIcon
                                    onClick={() =>
                                      onClickVisibilityIconHandler(
                                        viewAssessment ? row.uuid : row._id
                                      )
                                    }
                                  />
                                </Tooltip>
                              </span>
                            )}
                            {icons.includes("delete") && (
                              <span className="icon">
                                <Tooltip title="Delete">
                                  {/* <DeleteIcon
                                                                        onClick={() =>
                                                                            onClickDeleteIconHandler(
                                                                                row._id
                                                                            )
                                                                        }
                                                                    /> */}
                                  <img
                                    src={"/images/delete-icon.svg"}
                                    onClick={() =>
                                      onClickDeleteIconHandler(row._id)
                                    }
                                  />
                                </Tooltip>
                              </span>
                            )}
                            {icons.includes("edit") && (
                              <span className="icon">
                                <Tooltip title="Edit">
                                  <EditOutlined
                                    onClick={() =>
                                      onClickEditAssessmentHandler(row.uuid)
                                    }
                                  />
                                  {/* <img
                                                                        src={
                                                                            "/images/delete-icon.svg"
                                                                        }
                                                                        
                                                                        }
                                                                    /> */}
                                </Tooltip>
                              </span>
                            )}
                            {icons.includes("send") &&
                              (row?.assessmentStatus == "In Progress" ||
                                row?.assessmentStatus == "Re-opened" ||
                                row?.assessmentStatus == "Accepted") &&
                              row.isUserAuthorizedToFillAssessment && (
                                <span className="icon">
                                  <Tooltip title="Assign to Operation Member">
                                    <GroupAddOutlinedIcon
                                      onClick={() =>
                                        onClickAssignAssesmentFunction(row.uuid)
                                      }
                                    />
                                    {/* <img
                                                                        src={
                                                                            "/images/delete-icon.svg"
                                                                        }
                                                                        
                                                                        }
                                                                    /> */}
                                  </Tooltip>
                                </span>
                              )}
                            {icons.includes("fill") &&
                              row.isUserAuthorizedToFillAssessment && (
                                <span className="icon">
                                  <Tooltip title="Fill Assessment">
                                    <PostAddIcon
                                      onClick={() =>
                                        onClickFillAssessmentHandler(row.uuid)
                                      }
                                    />
                                    {/* <img
                                                                        src={
                                                                            "/images/delete-icon.svg"
                                                                        }
                                                                        
                                                                        }
                                                                    /> */}
                                  </Tooltip>
                                </span>
                              )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              ) : (
                <TableBody>
                  <tr>
                    <td colSpan="10">
                      <div className="no-records-blk">
                        <h2 className="heading2">No records available</h2>
                      </div>
                    </td>
                  </tr>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      {records?.length > 0 && (
        <div className="table-footer flex-between">
          <div className="table-footer-left">
            <div className="per-page-blk">
              <span className="per-page-txt">Records</span>
              <div className="per-page-dropdown">
                <div className="per-page-select-field">
                  <Select
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                  >
                    <MenuItem value="5">05</MenuItem>
                    <MenuItem value="10" selected>
                      10
                    </MenuItem>
                    <MenuItem value="20">20</MenuItem>
                    {/* <MenuItem value="50">50</MenuItem> */}
                  </Select>
                </div>
              </div>
            </div>
            <div className="show-entries-txt">
              showing {(page - 1) * rowsPerPage + 1}-
              {(page - 1) * rowsPerPage + records?.length} out of {totalRecords}
            </div>
          </div>
          <div className="table-footer-right">
            <Stack spacing={2} className="pagination-blk">
              <Pagination
                page={page}
                count={Math.ceil(totalRecords / rowsPerPage)}
                onChange={(event, value) => handleChangePage(event, value)}
                variant="outlined"
                shape="rounded"
              />
            </Stack>
          </div>
        </div>
      )}
    </>
  );
}

TableComponent.propTypes = {
  tableHead: PropTypes.array.isRequired,
  records: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  handleChangeRowsPerPage1: PropTypes.func.isRequired,
  handleChangePage1: PropTypes.func.isRequired,
  totalRecords: PropTypes.number.isRequired,
  icons: PropTypes.array,
  onClickVisibilityIconHandler1: PropTypes.func,
  onClickDeleteIconHandler1: PropTypes.func,
  selected: PropTypes.array,
  setSelected: PropTypes.func,
  order: PropTypes.string.isRequired,
  setOrder: PropTypes.func.isRequired,
  orderBy: PropTypes.string.isRequired,
  setOrderBy: PropTypes.func.isRequired,
  setCheckBoxes: PropTypes.bool,
  onRowClick: PropTypes.bool,
  isQuestionnare: PropTypes.bool,
  viewAssessment: PropTypes.bool,
};
