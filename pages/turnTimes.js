import { useState, useEffect } from "react";
import Router from 'next/router';
import SideBar from "../components/SideBar";
import Navbar from "../components/NavBar";
import Footer from '../components/Footer'
import {Grid} from "react-loader-spinner";

function FormsTable({ menuItems, turnTimes }) {

  const [isLogged, setIsLogged] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      let token = localStorage.getItem('jwt');

      if(token) {
          setIsLogged(token);
          setIsLoading(false);
      } else {
          Router.push('/')
      }
    }
      
      fetchData();

  }, [isLogged]);
  
  return (
    <div className="relative w-full">
      <Navbar />
      {isLoading ? (
        <div className="md:flex relative">
        <SideBar props={menuItems} />
          <div className="flex-1 p-10 text-2xl bg-slate-50 md:w-2/3 h-screen pt-32">
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
      ) : (
        <div className="md:flex relative">
          <SideBar props={menuItems} />
          <div className="flex-1 p-10 text-2xl bg-slate-50 md:w-2/3 h-screen pt-32">
            <div className="relative rounded-xl overflow-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-3 px-6">
                      Category
                    </th>
                    <th scope="col" className="py-3 px-6">
                      
                    </th>
                    <th scope="col" className="py-3 px-6">
                    
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {turnTimes.data.map(turnTime => (
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={turnTime.id}>
                      <th
                          scope="row"
                          className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                          {turnTime.attributes.category}
                      </th>
                    <td className="py-4 px-6"></td>
                    <td className="py-4 px-6"></td>
                    <td className="py-4 px-6">{turnTime.attributes.time}</td>
                    <td className="py-4 px-6 text-right"></td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      )}
      <Footer />
    </div>
  );
}

export async function getServerSideProps() {
  const [menuResponse, turnTimesResponse] = await Promise.all([
    fetch(`${process.env.BASE_URL}/corr-portal-menu-items`),
    fetch(`${process.env.BASE_URL}/corr-portal-turn-times`),
  ]);

  const [menuItems, turnTimes] = await Promise.all([
    menuResponse.json(),
    turnTimesResponse.json(),
  ]);

  return { props: { menuItems, turnTimes } };
}

export default FormsTable;
