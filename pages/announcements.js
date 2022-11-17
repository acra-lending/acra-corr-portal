import DataTable from 'react-data-table-component';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';

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

const Announcements = ({ menuItems, announcementsItems }) => {

    const [mounted, setMounted] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const options = [{value: '2022', label: '2022'}, {value: '2021', label: '2021'}];
    const items = announcementsItems.data.map(item => item.attributes);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    const FilterComponent = ({
      filterText,
      onFilter,
      onClear,
      defaultValue,
    }) => (
      <>
        <Select
          value={options.map((item) => (filterText === item.value ? item : ""))}
          onChange={onFilter}
          options={options}
          defaultValue={defaultValue}
        />
        <div type="button" onClick={onClear}>
          X
        </div>
      </>
    );
     
        const filteredItems = items.filter(
                item => item.announcement && item.announcement.includes(filterText)
        );

        const subHeaderComponentMemo = useMemo(() => {
          const handleClear = () => {
            if (filterText) {
              setResetPaginationToggle(!resetPaginationToggle);
              setFilterText('');
            }
          };

          return (
            <FilterComponent
              onFilter={(e) => setFilterText(e.value)}
              onClear={handleClear}
              filterText={filterText}
            />
          );
        }, [filterText, resetPaginationToggle]);
    
    return mounted ? (
      <div className="relative w-full">
        <NavBar />
        <div className="md:flex relative">
          <SideBar props={menuItems} />

          <div className="mt-20 w-full">
            <DataTable
              columns={columns}
              data={filteredItems}
              pagination
              paginationResetDefaultPage={resetPaginationToggle}
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
              persistTableHead
            />
          </div>
        </div>
      </div>
    ) : (
      <div />
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