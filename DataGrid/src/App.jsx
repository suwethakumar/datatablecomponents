// src/App.jsx
import React from 'react';
import DataTable from './components/DataTable';
import './App.css';

// Define columns with custom rendering functions
const columns = [
  { Header: 'ID', accessor: 'id' },
  { Header: 'Name', accessor: 'name' },
  { Header: 'Age', accessor: 'age' },
  { Header: 'Email', accessor: 'email' },
];

const data = [
  { id: 1, name: 'John Doe', age: 28, email: 'john.doe@example.com', address: '123 Main St', additionalInfo: 'Likes coffee' },
  { id: 2, name: 'Jane Smith', age: 34, email: 'jane.smith@example.com', address: '456 Elm St', additionalInfo: 'Enjoys hiking' },
  // Add more data entries as needed
];

// Custom cell renderer for age
const customCellRenderers = {
  age: (value) => <span>{value} years</span>,
};

// Function to render expandable content
const expandableContent = (row) => (
  <div>
    <p><strong>Details:</strong></p>
    <p>Address: {row.address || 'N/A'}</p>
    <p>Additional Info: {row.additionalInfo || 'N/A'}</p>
  </div>
);

const App = () => {
  // Edit handler
  const handleEdit = (row) => {
    alert(`Edit row with ID: ${row.id}`);
  };

  // Delete handler
  const handleDelete = (row) => {
    alert(`Delete row with ID: ${row.id}`);
  };

  return (
    <div className="App">
      <h1>Data Table Example</h1>
      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        customCellRenderers={customCellRenderers}
        expandableContent={expandableContent}
      />
    </div>
  );
};

export default App;
