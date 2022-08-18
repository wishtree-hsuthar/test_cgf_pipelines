import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import "./TableComponent.css";
import { MenuItem, Pagination, Select, Stack } from "@mui/material";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy].toLowerCase() < a[orderBy].toLowerCase()) {
    return -1;
  }
  if (b[orderBy].toLowerCase() > a[orderBy].toLowerCase()) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    tableHead,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
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
        {tableHead.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            className="table-header"
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              IconComponent={ArrowDropUpIcon}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              className="sorted-blk"
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
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
  page,
  rowsPerPage,
  handleChangeRowsPerPage1,
  handleChangePage1,
  totalRecords,
  orderBy,
  setOrderBy,
  icons,
  onClickVisibilityIconHandler1,
  onClickDeleteIconHandler1,
  selected,
  setSelected
}) {
  //   console.log("records",records)
  const [order, setOrder] = React.useState("asc");

  const handleRequestSort = (_event,property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = records.map((n) => n.id);
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

  const handleChangePage = (_event,newPage) => {
    // console.log("page",event.target.value)
    handleChangePage1(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    handleChangeRowsPerPage1(event);
  };
  const onClickVisibilityIconHandler = (id) => {
    // console.log("Inside on click handler",e.target)
    onClickVisibilityIconHandler1(id)
  }
  const onClickDeleteIconHandler = (id) => {
    onClickDeleteIconHandler1(id)
  }
  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty records.
  const emptyRows =
    page > 0 ? Math.max(0, page * rowsPerPage - totalRecords) : 0;
  // console.log("selected rows",selected)
  return (
    <>
      <Box sx={{ width: "100%" }} className="table-blk">
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                tableHead={tableHead}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={records.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 records.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(records, getComparator(order, orderBy))
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        // onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.emailId}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            className="table-checkbox"
                            color="primary"
                            onClick={(e)=>handleClick(e,row.id)}
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        {Object.keys(row).map((cell, _id) => {
                          if(cell !== "id" && cell !== "status"){
                            return <TableCell key={cell}>{row[cell]}</TableCell>
                          }
                          else if(cell === 'status'){
                              return <TableCell className={`button-style ${row[cell] === 'active' && 'button-style-success'}`} key={cell}><span>{row[cell]}</span></TableCell>
                          }
                        })}
                        <TableCell>
                          {icons.includes("visibility") && <span className="icon"><VisibilityOutlinedIcon onClick={() => onClickVisibilityIconHandler(row.id)}/></span>}
                          {icons.includes("delete") && <span className="icon"><DeleteIcon onClick={() => onClickDeleteIconHandler(row.id)}/></span>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height:  69 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <div className="table-footer flex-between">
        <div className="table-footer-left">
          <div className="per-page-blk">
            <span className="per-page-txt">Records</span>
            <div className="per-page-dropdown">
              <div className="per-page-select-field">
                <Select value={rowsPerPage} onChange={handleChangeRowsPerPage}>
                  <MenuItem value="5" selected>
                    05
                  </MenuItem>
                  <MenuItem value="10">10</MenuItem>
                  <MenuItem value="20">20</MenuItem>
                  <MenuItem value="25">25</MenuItem>
                </Select>
              </div>
            </div>
          </div>
          <div className="show-entries-txt">Showing {(page - 1)*rowsPerPage + 1} to {(page)*rowsPerPage <= totalRecords?page*rowsPerPage : totalRecords} of {totalRecords} Entries</div>
        </div>
        <div className="table-footer-right">
          <Stack spacing={2} className="pagination-blk">
            <Pagination page={page} count={Math.ceil(totalRecords/rowsPerPage)} onChange={(event,value) => handleChangePage(event,value)} variant="outlined" shape="rounded" />
          </Stack>
        </div>
      </div>
    </>
  );
}
