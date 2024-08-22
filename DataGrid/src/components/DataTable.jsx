// src/components/DataTable.jsx
import React, { useState, useMemo, useCallback } from 'react';
import './DataTable.css';

// Helper function for sorting
const sortData = (data, sortBy, sortOrder) => {
  return [...data].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

// DataTable component
const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  customCellRenderers,
  expandableContent,
}) => {
  const [sortBy, setSortBy] = useState(columns[0]?.accessor || '');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [filterText, setFilterText] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);

  const sortedData = useMemo(() => sortData(data, sortBy, sortOrder), [data, sortBy, sortOrder]);
  const filteredData = useMemo(
    () => sortedData.filter(row => Object.values(row).some(val => val.toString().toLowerCase().includes(filterText.toLowerCase()))),
    [sortedData, filterText]
  );

  const paginatedData = useMemo(
    () => filteredData.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage),
    [filteredData, currentPage, rowsPerPage]
  );

  const handleSort = (column) => {
    setSortBy(column.accessor);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => prev + direction);
  };

  const handleRowClick = (rowId) => {
    setExpandedRows((prev) =>
      prev.includes(rowId) ? prev.filter(id => id !== rowId) : [...prev, rowId]
    );
  };

  return (
    <div className="data-table-container">
      <input
        type="text"
        placeholder="Search..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="filter-input"
      />
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} onClick={() => handleSort(col)} className="sortable">
                {col.Header} {sortBy === col.accessor ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <tr onClick={() => handleRowClick(rowIndex)} className="data-row">
                {columns.map((col) => (
                  <td key={col.accessor}>
                    {customCellRenderers && customCellRenderers[col.accessor]
                      ? customCellRenderers[col.accessor](row[col.accessor], row)
                      : row[col.accessor]}
                  </td>
                ))}
                <td>
                  {onEdit && <button onClick={() => onEdit(row)}>Edit</button>}
                  {onDelete && <button onClick={() => onDelete(row)}>Delete</button>}
                </td>
              </tr>
              {expandedRows.includes(rowIndex) && expandableContent && (
                <tr className="expanded-row">
                  <td colSpan={columns.length + 1}>
                    {expandableContent(row)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(-1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>Page {currentPage + 1}</span>
        <button
          onClick={() => handlePageChange(1)}
          disabled={(currentPage + 1) * rowsPerPage >= filteredData.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
