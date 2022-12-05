import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import DataTable from 'react-data-table-component';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import {Grid} from "react-loader-spinner";


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
        selector: row => row.number,
        sortable: true
    },
    {
        name: 'Action',
        selector: row => <a href={row.url} className=" text-[#0033A1] font-medium no-underline">Download</a>,
    },
];

const Announcements = ({ menuItems, announcementsItems }) => {
    const [mounted, setMounted] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [isLogged, setIsLogged] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const options = [{value: '2022', label: '2022'}, {value: '2021', label: '2021'}];
    const items = announcementsItems.data.map(item => item.attributes);

    const router = useRouter();

    const fetchData = () => {
      setIsLoading(true);
      let token = localStorage.getItem('jwt');

      if(token) {
        setIsLogged(token);
        setIsLoading(false);
      } else {
          router.push('/')
      }
    }

    useEffect(() => {

      fetchData();

    }, [isLogged]);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    const FilterComponent = ({
      filterText,
      onFilter,
      onClear,
      defaultValue,
    }) => (
      <div className='flex items-center gap-4'>
        <Select
          value={options.map((item) => (filterText === item.value ? item : ""))}
          onChange={onFilter}
          options={options}
          defaultValue={defaultValue}
        />
        <FontAwesomeIcon icon={faX} type="button" onClick={onClear} />
      </div>
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
        {isLoading ? (
          <div className="md:flex relative">
            <SideBar props={menuItems} />
              <div className="mt-20 w-full overflow-x-scroll">
                <div style={{position: "absolute", left: "60%", top: "50%"}}>
                  <Grid
                      height="80"
                      width="80"
                      color="#0033a1"
                      ariaLabel="grid-loading"
                      radius="12.5"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                  />
                </div>
              </div>
          </div>
        ): (
          <div className="md:flex relative">
            <SideBar props={menuItems} />

            <div className="mt-20 w-full overflow-x-scroll">
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
        )}
      </div>
    ) : (
      <div />
    );
};

export async function getServerSideProps() {
    const [menuResponse, announcementsResponse] = await Promise.all([
      fetch(`${process.env.BASE_URL}/corr-portal-menu-items`),
      fetch(`${process.env.BASE_URL}/corr-portal-annoucements?pagination[limit]=50`)
    ]); 
  
      const [menuItems, announcementsItems] = await Promise.all([
        menuResponse.json(),
        announcementsResponse.json()
      ]);

      return { props: { menuItems, announcementsItems } };
}

export default Announcements;