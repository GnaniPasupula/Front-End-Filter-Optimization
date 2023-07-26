import React, { useEffect, useState, useRef } from 'react';
import './Table.css';

interface CSVDataRow {
  number: string;
  mod3: string;
  mod4: string;
  mod5: string;
  mod6: string;
}

const Table: React.FC = () => {
  const [data, setTableData] = useState<CSVDataRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  //const itemsPerPage = 20; 
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
          const row: CSVDataRow = {
            number: values[0],
            mod3: values[1],
            mod4: values[2],
            mod5: values[3],
            mod6: values[4],
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

  return (
    <div className="table-container">
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
            {data
              .slice((currentPage - 1) * maxItemsPerPage, currentPage * maxItemsPerPage)
              .map((item, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * maxItemsPerPage + index + 1}</td>
                  <td>{item.number}</td>
                  <td>{item.mod3}</td>
                  <td>{item.mod4}</td>
                  <td>{item.mod5}</td>
                  <td>{item.mod6}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
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
