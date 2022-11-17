import DataTable from 'react-data-table-component';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import { useState, useMemo, Fragment } from 'react';
// import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
// import 'rsuite-table/lib/less/index.less'; 
// import DataTable from 'react-data-table-component';
import HTMLReactParser from 'html-react-parser';
import Select from 'react-select';
import { useEffect } from 'react';
const columns = [
    {
        name: 'Summary',
        selector: row => row.summary,
        sortable: true
    },
    {
        name: 'Publish Date',
        selector: row => row.publishDate,
        sortable: true
    },
    {
        name: 'Announcement',
        selector: row => row.announcement,
        sortable: true
    },
    {
        name: 'Number',
        selector: row => <a href={row.number}>Download</a>,
    },
];

function Announcements({ menuItems, announcementsItems }) {

    //hydration error
        // for (let i = 0; i < announcementsItems.data.length; i++) {
        //     var outPut = outPut.push(announcementsItems.data[i].attributes)
        // }

    const options = [{value: '2022', label: '2022'}, {value: '2021', label: '2021'}]
    const FilterComponent = ({ filterText, onFilter, onClear, defaultValue }) => (
            <>
                <Select
                    value={options.map(item => filterText === item.value ? item : '')}
                    onChange={onFilter}
                    options={options}
                    defaultValue={defaultValue}
                />
                <div type="button" onClick={onClear}>
                    X
                </div>
            </>
            
        
    );
     
        const [filterText, setFilterText] = useState('');
        const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
        const filteredItems = outPut.filter(
                item => item.announcement && item.announcement.includes(filterText)
        );
        console.log(filteredItems)
        const subHeaderComponentMemo = useMemo(() => {
            const handleClear = () => {
                if (filterText) {
                        setResetPaginationToggle(!resetPaginationToggle);
                        setFilterText('');
                }
            }
            return (
                <FilterComponent onFilter={e => setFilterText(e.value)} onClear={handleClear} filterText={filterText} />
            );
        }, [filterText, resetPaginationToggle]);
    
    return (
      <div className="relative w-full">
        <NavBar />
        <div className="md:flex relative">
          <SideBar props={menuItems} />

          <div className='mt-20 w-full'>
            <DataTable 
                columns={columns} 
                data={filteredItems}
                pagination
                paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                persistTableHead 
            />
          </div>
        </div>
      </div>
    );
};

export async function getServerSideProps() {
    const [menuResponse, announcementsResponse] = await Promise.all([
      fetch(`${process.env.BASE_URL}/corr-portal-menu-items`),
      fetch(`${process.env.BASE_URL}/corr-portal-annoucements`)
    ]); 
  
      const [menuItems, announcementsItems] = await Promise.all([
        menuResponse.json(),
        announcementsResponse.json()
      ]);
      
      return { props: { menuItems, announcementsItems } };
}

export default Announcements;