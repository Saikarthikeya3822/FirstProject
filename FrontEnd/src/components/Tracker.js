// Tracker.js
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { PrimeReactProvider } from "primereact/api";
import { CascadeSelect } from "primereact/cascadeselect";

import {
  getAllOrderProducts,
  getOrders,
  getAllOrders,
  getFilterChildren,
  getAllTrackers
} from "../service/productService";
import { useNavigate } from "react-router-dom";
const Tracker = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filtered, setFiltered] = useState(0);
  const [loading, setLoading] = useState(false);
  const rows = 5;
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  // For backend filtering
  const [appliedFilter, setAppliedFilter] = useState({
    type: null,
    value: null,
  });
  const loadOrders = async (page = 0, filterType, filterValue) => {
    console.log("filter type", filterType, filterValue);
    try {
      setLoading(true);

      //const response = await getOrders(page, rows);
      const response = await getAllTrackers(page, rows, filterType, filterValue);
      console.log("Orders from pagination:", response);
      setOrders(response.data.content);
      setTotalRecords(response.data.totalElements);
      setFiltered(response.data.totalElements);
    } catch (error) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(0, null, null);
  }, []);

  // Dropdown filter options
  const [filterOptions, setFilterOptions] = useState([
    { label: "Username", value: "username", children: [] },
    { label: "State", value: "state", children: [] },
    { label: "Region", value: "region", children: [] },
    { label: "Order Date", value: "orderDate", children: [] },
  ]);
  const updateFilterOptions = (filterType, children) => {
    setFilterOptions((prev) =>
      prev.map((opt) => (opt.value === filterType ? { ...opt, children } : opt))
    );
  };
  const handleGroupChange = async (e) => {
    const parent = e.value;

    // keep submenu open
    setActivePath(e.itemPath);

    // load children only once
    if (!parent.children || parent.children.length === 0) {
      await loadChildren(parent.value);
    }
  };
  const onFilterSelect = (value) => {
    //setSelectedFilter(value);
    const filterType = value.parentType;
    const filterValue = value.value;

    setAppliedFilter({
      type: filterType,
      value: filterValue,
    });

    const parent = value.parentType;
    const childVal = value.value;

    loadOrders(0, parent, childVal);
  };

  const loadChildren = async (filterType) => {
    const data = await getFilterChildren(filterType);
    console.log("data is :", data);

    const children = data.map((v) => ({
      label: v,
      value: v,
      parentType: filterType,
    }));

    updateFilterOptions(filterType, children);
  };
  const clearFilters = () => {
    setAppliedFilter(null);
    setSelectedFilter(null);
    setActivePath(null);
    // reload orders without any filter
    loadOrders(0, null, null);
  };
  const formatDate = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
  return (
    <PrimeReactProvider value={{ hideOverlaysOnScroll: false }}>
      <div className="p-4">
        <h2 className="mb-4">Product Tracker</h2>
       <div className="d-flex align-items-center mb-3 gap-3">
        {/* FILTER SECTION */}
        <CascadeSelect
          value={selectedFilter}
          options={filterOptions}
          optionLabel="label"
          optionGroupLabel="label"
          optionGroupChildren={["children"]}
          placeholder="Select Filter"
          activeItemPath={activePath}
          onGroupChange={(e) => handleGroupChange(e)}
          onChange={(e) => onFilterSelect(e.value)}
        />
        {/* Clear Filter Button */}
        <button
          type="button"
          className="btn btn-outline-danger d-flex align-items-center gap-2"
          onClick={clearFilters}
          disabled={!appliedFilter}
        >
          <i className="pi pi-filter-slash"></i>
          Clear Filters
        </button>
        </div>
        {/* LOADING */}
        {loading && <p>Loading orders...</p>}

        {/* API ERROR */}
        {error && <p className="text-red-500 font-semibold mt-3">{error}</p>}

        {/* NO RECORDS */}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-center text-xl font-semibold mt-5">
            No products were ordered.
          </p>
        )}

        {/* TABLE */}
        {!error && (
          <DataTable
            value={orders}
            lazy
            paginator
            rows={5}
            totalRecords={totalRecords}
            loading={loading}
            onPage={(e) =>{
              console.log("e value whne page click next",e);
              loadOrders(e.page, appliedFilter.type, appliedFilter.value)}
            }
            className="shadow-2 border-round-lg mb-4"
          >
            <Column field="orderId" header="Order ID" />
            <Column field="username" header="Username" />
            <Column field="state" header="State" />
            <Column field="region" header="Region" /> 
            <Column field="orderDate" header="Order Date" body={(rowData) => formatDate(rowData.orderDate)} />
            <Column field="price" header="Price" />
            <Column field="status" header="Status" />
          </DataTable>
        )}

        {/* BUTTONS */}
        <div className="flex gap-3 mt-4 justify-end">
          <Button
            label="Create"
            icon="pi pi-plus"
            className="p-button-success"
          />
          <Button
            label="Update"
            icon="pi pi-pencil"
            className="p-button-warning"
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger"
          />
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default Tracker;
