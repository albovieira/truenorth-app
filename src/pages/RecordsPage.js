/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import apiClient from '../utils/api';
import { Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'
import { debounce } from 'lodash';
import FilterInputComponent from '../components/Grid/FilterInputComponent';

function RecordsPage() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [sortModel, setSortModel] = useState([]);
  const [rowCountState, setRowCountState] = useState(0);

  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });

  const customOperators = {
    id: [
      {
        label: 'equals', value: 'equals',
        InputComponent: FilterInputComponent('text')
      },
    ],
    operation: [
      { label: 'equals', value: 'equals', InputComponent: FilterInputComponent('text') },
      { label: 'contains', value: 'contains', InputComponent: FilterInputComponent('text') },
    ],
    formula: [
      { label: 'equals', value: 'equals', InputComponent: FilterInputComponent('text') },
      { label: 'contains', value: 'contains', InputComponent: FilterInputComponent('text') },
    ]
  };

  useEffect(() => {
    fetchData(paginationModel.page, paginationModel.pageSize);
  }, []);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      rowCountState !== undefined
        ? rowCountState
        : prevRowCountState,
    );
  }, [rowCountState, setRowCountState]);

  const deleteRecord = async (id) => {
    try {
      await apiClient.delete(`/record/${id}`);
      toast.success('Record deleted');
      fetchData(paginationModel.page, paginationModel.pageSize);
    } catch (error) {
      toast.error('Error deleting record');
    }
  }

  const getFromApi = async (url) => {
    try {      
      const { data: response } = await apiClient.get(url);
      return response;
    } catch (error) {
      toast.error('Error getting records');
      return {
        data: [],
      }
    }
  }

  const fetchData = async (page, limit, sort, filter) => {
    let url = `/record?page=${page}&limit=${limit}`
    if (sort) {
      url += `&sort=${sort}`
    }
    if (filter) {
      url += `&search=${filter}`
    }
    const response = await getFromApi(url);
    if (response.data.length === 0) {
      const { total } = response;
      setRowCountState(total)
      setRows([]);
      return;
    }

    const parsedData = (response.data || []).map((v) => ({
      id: v.id,
      operation: v.operation.name,
      cost: v.operation.cost,
      formula: (v.formula || {}).data,
      formulaResult: (v.formula || {}).result,
      operationRequest: v.operation_request,
      operationResult: v.operation_response,
      createdAt: v.createdAt,
    }))

    const notSortableColumns = ['cost', 'formulaResult', 'operationResult', 'amount', 'operationRequest'];
    const extractedColumns = Object.keys(parsedData[0]).map((key) => {
      return {
        field: key,
        headerName: key.toUpperCase(),
        width: 120,
        sortable: notSortableColumns.indexOf(key) === -1,
        filterable: notSortableColumns.indexOf(key) === -1,
      }
    });

    const { total } = response;
    setRowCountState(total)
    setRows(parsedData);
    setColumns(extractedColumns);

  }

  const handlePagination = (params) => {
    setPaginationModel(params);
    const { page, pageSize } = params;
    fetchData(page, pageSize);
  }


  const handleSortModelChange = (newSortModel) => {
    setSortModel(newSortModel);

    const sortString = newSortModel
      .map((sortObj) => `${sortObj.field}=${sortObj.sort}`)
      .join('|');

    fetchData(paginationModel.page, paginationModel.pageSize, sortString);
  };

  const handleFilterModelChange = debounce((newFilterModel) => {
    const comparisonSymbols = {
      'equals': '=',
      'contains': '%',
    }

    let queryParams = newFilterModel.items
      .map((filter) => `${filter.field}${comparisonSymbols[filter.operator]}${filter.value}`)
      .join('|');
  
    if((queryParams.includes('undefined'))) {
      queryParams = null
    }

    fetchData(paginationModel.page, paginationModel.pageSize, null, queryParams);
  }, 400);


  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteRecord(id)
      }
    });
  }

  return (
    <div style={{ height: '700px' }}>
      <DataGrid
        rows={rows}
        columns={[
          ...columns.map((col) => {
            return {
              ...col,
              filterOperators: customOperators[col.field] || [],
            };
          }),
          {
            field: 'actions',
            headerName: 'Actions',
            filterable: false,
            sortable: false,
            renderCell: (params) => (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleDelete(params.row.id)}
              >
                Delete
              </Button>
            ),
          },
        ]}
        rowCount={rows.length > 0 ? rowCountState : 0}
        loading={false}
        pageSizeOptions={[10, 30, 50]}
        paginationModel={paginationModel}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        sortModel={sortModel}
        // filterModel={filterModel}
        onPaginationModelChange={handlePagination}
        onSortModelChange={handleSortModelChange}
        onFilterModelChange={handleFilterModelChange}
      // disableColumnFilter={true} 
      // components={{
      //   Toolbar: GridToolbar,
      // }}
      />
    </div>
  );
}


export default RecordsPage;