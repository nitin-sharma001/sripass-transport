import React, { useState, useEffect } from 'react';
import {
  Box,

  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

const BusScheduleTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://sripass.onrender.com/api/bus-schedules');
        if (!response.ok) {
          throw new Error('API request failed');
        }
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (row) => {
    setEditingData(row);
    setEditedData({
      RouteNo: row.RouteNo,
      StartDate: row.StartDate,
      EndDate: row.EndDate,
      StartTime: row.StartTime,
      EndTime: row.EndTime,
      LicensePlateNumber: row.licensePlateNumber,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleFieldChange = (e, fieldName) => {
    const newValue = e.target.value;
    setEditedData((prevData) => ({
      ...prevData,
      [fieldName]: newValue,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`https://sripass.onrender.com/api/bus-schedules/${editingData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });
      if (!response.ok) {
        throw new Error('Failed to save edit');
      }
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const handleDelete = (row) => {
    setItemToDelete(row); // Set the item to be deleted
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`https://sripass.onrender.com/api/bus-schedules/${itemToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      // Update your local data state or refetch data if needed
      setIsDeleteModalOpen(false); // Close the confirmation modal
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false); // Close the confirmation modal without deleting
    setItemToDelete(null); // Clear the item to be deleted
  };

  const filteredData = data.filter((item) => item.RouteNo.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      {loading ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="300px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
              marginBottom: '30px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </div>
          </div>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Route No</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>License Plate No</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row._id}>
                    <TableCell align="left">
                      <Chip
                        avatar={
                          <Avatar style={{ backgroundColor: 'red', color: 'white' }}>R</Avatar>
                        }
                        label={row.RouteNo}
                      />
                    </TableCell>
                    <TableCell>{row.StartDate}</TableCell>
                    <TableCell>{row.EndDate}</TableCell>
                    <TableCell>{row.StartTime}</TableCell>
                    <TableCell>{row.EndTime}</TableCell>
                    <TableCell>{row.licensePlateNumber}</TableCell>
                    <TableCell align="left">
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(row)}
                        style={{ marginRight: '8px' }}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(row)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Dialog style={{}} open={isEditModalOpen} onClose={handleCloseEditModal}>
            <DialogTitle>Edit Row</DialogTitle>
            <DialogContent>
              <TextField
                label="Route No"
                style={{ margin: '20px' }}
                value={editedData.RouteNo}
                onChange={(e) => handleFieldChange(e, 'RouteNo')}
              />
              <TextField
                label="Start Date"
                style={{ margin: '20px' }}
                value={editedData.StartDate}
                onChange={(e) => handleFieldChange(e, 'StartDate')}
              />
              <TextField
                label="End Date"
                style={{ margin: '20px' }}
                value={editedData.EndDate}
                onChange={(e) => handleFieldChange(e, 'EndDate')}
              />
              <TextField
                label="Start Time"
                style={{ margin: '20px' }}
                value={editedData.StartTime}
                onChange={(e) => handleFieldChange(e, 'StartTime')}
              />
              <TextField
                label="End Time"
                style={{ margin: '20px' }}
                value={editedData.EndTime}
                onChange={(e) => handleFieldChange(e, 'EndTime')}
              />
              <TextField
                label="License Plate Number"
                style={{ margin: '20px' }}
                value={editedData.LicensePlateNumber}
                onChange={(e) => handleFieldChange(e, 'LicensePlateNumber')}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditModal}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save</Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog open={isDeleteModalOpen} onClose={cancelDelete}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this item?
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelDelete}>Cancel</Button>
              <Button onClick={confirmDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

    </div>
  );
};

export default BusScheduleTable;
