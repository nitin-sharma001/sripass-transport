
import React, { useState, useEffect } from 'react';
import MainCard from 'components/MainCard';
import { Button, FormControl, InputLabel, OutlinedInput, Select, MenuItem } from '@mui/material';
import { message } from 'antd';

const AddDriver = () => {
  const key = 'updatable'; // Define a unique key for the message

  const [values, setValues] = useState({
    driver_id: '',
    name: '',
    tel: '',
    address: '',
    assignedRoute: '',
    assignedVehicle: '',
  });

  const [routes, setRoutes] = useState([]); // State variable to store route data
  const [vehicles, setVehicles] = useState([]); // State variable to store vehicle data

  useEffect(() => {
    // Fetch the route data when the component mounts
    fetch('https://sripass.onrender.com/api/busroutes/')
      .then((response) => response.json())
      .then((data) => {
        setRoutes(data); // Update the routes state with the fetched data
      })
      .catch((error) => {
        console.error('Error fetching routes:', error);
      });

    // Fetch the vehicle data when the component mounts
    fetch('https://sripass.onrender.com/api/bus/')
      .then((response) => response.json())
      .then((data) => {
        setVehicles(data); // Update the vehicles state with the fetched data
      })
      .catch((error) => {
        console.error('Error fetching vehicles:', error);
      });
  }, []); // Empty dependency array ensures this effect runs once when the component mounts

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addResponse = await fetch('https://sripass.onrender.com/api/driver/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!addResponse.ok) {
        throw new Error('API request failed');
      }

      const data = await addResponse.json();
      console.log('New driver added:', data);
      message.open({
        key,
        type: 'loading',
        content: 'Loading...',
      });

      setTimeout(() => {
        message.open({
          key,
          type: 'success',
          content: 'Driver added successfully',
          duration: 2,
        });
      }, 1000);

      message.config({
        top: 100,
        duration: 2,
        maxCount: 4,
        rtl: true,
        prefixCls: 'my-message',
      });
    } catch (error) {
      console.error('Error adding new driver:', error);
      message.open({
        key,
        type: 'loading',
        content: 'Loading...',
      });

      setTimeout(() => {
        message.open({
          key,
          type: 'error',
          content: 'Error',
          duration: 2,
        });
      }, 1000);

      message.config({
        top: 100,
        duration: 2,
        maxCount: 4,
        rtl: true,
        prefixCls: 'my-message',
      });
    }
  };

  return (
    <MainCard>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="driver_id">Driver ID</InputLabel>
            <OutlinedInput
              id="driver_id"
              type="number"
              value={values.driver_id}
              onChange={handleChange('driver_id')}
              required
              label="Driver ID"
            />
          </FormControl>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="name">Name</InputLabel>
            <OutlinedInput
              id="name"
              type="text"
              value={values.name}
              onChange={handleChange('name')}
              required
              label="Name"
            />
          </FormControl>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="tel">Tel</InputLabel>
            <OutlinedInput
              id="tel"
              type="tel"
              value={values.tel}
              onChange={handleChange('tel')}
              required
              label="Tel"
            />
          </FormControl>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="address">Address</InputLabel>
            <OutlinedInput
              id="address"
              type="text"
              value={values.address}
              onChange={handleChange('address')}
              required
              label="Address"
            />
          </FormControl>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="assignedRoute">Assigned Route</InputLabel>
            <Select
              id="assignedRoute"
              value={values.assignedRoute}
              onChange={handleChange('assignedRoute')}
              label="Assigned Route"
              required
            >
              {routes.map((route) => (
                <MenuItem key={route.RouteNo} value={route.RouteNo}>
                  {route.RouteNo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="assignedVehicle">Assigned Vehicle</InputLabel>
            <Select
              id="assignedVehicle"
              value={values.assignedVehicle}
              onChange={handleChange('assignedVehicle')}
              label="Assigned Vehicle"
              required
            >
              {vehicles.map((vehicle) => (
                <MenuItem key={vehicle.licensePlateNumber} value={vehicle.licensePlateNumber}>
                  {vehicle.licensePlateNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {/* Apply width style to the button */}
        <Button type="submit" variant="contained" color="primary" style={{ width: '100%' }}>
          Add
        </Button>
      </form>
    </MainCard>
  );
};

export default AddDriver;
