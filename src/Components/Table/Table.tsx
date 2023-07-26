import React, { useEffect, useState, useRef } from 'react';
import './Table.css';
import Multiselect from 'multiselect-react-dropdown';

interface CSVDataRow {
  number: string;
  mod3: string;
  mod4: string;
  mod5: string;
  mod6: string;
  [key: string]: string; 
}

const Table: React.FC = () => {
  const [data, setTableData] = useState<CSVDataRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
  const maxItemsPerPage = 100;
  const pageCount = Math.ceil(data.length / maxItemsPerPage);

  useEffect(() => {
    const fetchCSVData = async () => {
      try {
        const response = await fetch('/Data/dataset_small.csv');
        const csvData = await response.text();
        const lines = csvData.split('\n');
        const rows: CSVDataRow[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          const number = parseInt(values[0], 10);
          console.log(number);
          const mod3 = (number % 3).toString();
          const mod4 = (number % 4).toString();
          const mod5 = (number % 5).toString();
          const mod6 = (number % 6).toString();
          const row: CSVDataRow = {
            number: values[0],
            mod3,
            mod4,
            mod5,
            mod6,
          };
          rows.push(row);
        }
        setTableData(rows);
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };

    fetchCSVData();
  }, []);

  const tableBodyRef = useRef<HTMLDivElement>(null);

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= pageCount) {
      setCurrentPage(pageNumber);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTop = 0;
    }
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const pageNumber = parseInt(e.currentTarget.textContent || '', 10);
      if (!isNaN(pageNumber)) {
        goToPage(pageNumber);
      }
      e.currentTarget.blur();
    }
  };

  const handleFilterChange = (columnName: string, selectedOptions: any) => {
    setFilters({
      ...filters,
      [columnName]: selectedOptions.map((option: any) => option.value),
    });
  };

  const filterOptions = (columnName: string) => {
    const uniqueValues = Array.from(new Set(data.map((item) => item[columnName])));
    return uniqueValues.map((value) => ({ value, label: value }));
  };

  const filteredData = data.filter((item) => {
    return Object.keys(filters).every((columnName) => {
      if (filters[columnName].length === 0) return true;
      return filters[columnName].includes(item[columnName]);
    });
  }).filter((item) => {
    return data.find((d) => d.number === item.number);
  });

  return (
    <div className="table-container">
      <div className="table-filters">
        <Multiselect
          options={filterOptions('number')}
          onSelect={(selectedOptions) => handleFilterChange('number', selectedOptions)}
          onRemove={(selectedOptions) => handleFilterChange('number', selectedOptions)}
          displayValue="label"
          closeOnSelect={false}
          placeholder="Select Number..."
        />
        <Multiselect
          options={filterOptions('mod3')}
          onSelect={(selectedOptions) => handleFilterChange('mod3', selectedOptions)}
          onRemove={(selectedOptions) => handleFilterChange('mod3', selectedOptions)}
          displayValue="label"
          closeOnSelect={false}
          placeholder="Select Mod3..."
        />
        <Multiselect
          options={filterOptions('mod4')}
          onSelect={(selectedOptions) => handleFilterChange('mod4', selectedOptions)}
          onRemove={(selectedOptions) => handleFilterChange('mod4', selectedOptions)}
          displayValue="label"
          closeOnSelect={false}
          placeholder="Select Mod4..."
        />
        <Multiselect
          options={filterOptions('mod5')}
          onSelect={(selectedOptions) => handleFilterChange('mod5', selectedOptions)}
          onRemove={(selectedOptions) => handleFilterChange('mod5', selectedOptions)}
          displayValue="label"
          closeOnSelect={false}
          placeholder="Select Mod5..."
        />
        <Multiselect
          options={filterOptions('mod6')}
          onSelect={(selectedOptions) => handleFilterChange('mod6', selectedOptions)}
          onRemove={(selectedOptions) => handleFilterChange('mod6', selectedOptions)}
          displayValue="label"
          closeOnSelect={false}
          placeholder="Select Mod6..."
        />
      </div>
      <div className="table-header sticky">
        <table>
          <thead>
            <tr>
              <th>Serial No</th>
              <th>Number</th>
              <th>Mod3</th>
              <th>Mod4</th>
              <th>Mod5</th>
              <th>Mod6</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="table-body" ref={tableBodyRef}>
        <table>
          <tbody>
            {filteredData
              .slice((currentPage - 1) * maxItemsPerPage, currentPage * maxItemsPerPage)
              .map((item, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * maxItemsPerPage + index + 1}</td>
                  <td>{item.number}</td>
                  <td>{filters['mod3']?.length && filters['mod3'][0] in item ? item[filters['mod3'][0]] : item.mod3}</td>
                  <td>{filters['mod4']?.length && filters['mod4'][0] in item ? item[filters['mod4'][0]] : item.mod4}</td>
                  <td>{filters['mod5']?.length && filters['mod5'][0] in item ? item[filters['mod5'][0]] : item.mod5}</td>
                  <td>{filters['mod6']?.length && filters['mod6'][0] in item ? item[filters['mod6'][0]] : item.mod6}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="pagination sticky">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span contentEditable suppressContentEditableWarning onKeyDown={handlePageInputKeyDown}>
          {currentPage}
        </span>
        <span> of {pageCount}</span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pageCount}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
