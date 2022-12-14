import { useState, useEffect } from 'react';
import SideBar from "../components/SideBar"
import Navbar from '../components/NavBar'
import DashLinks from "../components/DashLinks";
import Login from '../components/Login';
import {Grid} from "react-loader-spinner";

export default function Home({menuItems, dashboardItems}) {

  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState();
  const [alert, setAlert] = useState();


  useEffect(() => {
    setIsLoading(true);
    setIsLogged(!!localStorage.getItem('jwt'));
    setIsLoading(false);
  }, []);

  return (
    <div className="relative w-full h-full">
      <Navbar />
      
      <main>
            { isLoading ? (
              <div style={{position: "absolute", left: "47%", top: "35%"}}>
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

            ) : (
              isLogged ? (
                <>
  
  
                  <div className="md:flex static">
                  <SideBar props={menuItems}/>
                    <div className="mx-auto md:pt-24 sm:pb-20">
                        <h2 className="px-3 pb-2 pt-3">Welcome, <b>{localStorage.firstname}</b>!</h2>
                        <h2 className="px-3 pb-2">Correspondent Portal Dashboard</h2>

  
                      <DashLinks props={dashboardItems}/>
                      <div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-screen px-12 flex space-x-4 flex-col xl:flex-row xl:px-32 lg:flex-row lg:px-24 md:flex-row md:px-24 md:pt-32 sm:flex sm:flex-col sm:space-x-0 sm:px-6 bg-index">
                    <div>
                      <h2 className="text-white pt-10 sm:pt-4">Correspondent Portal</h2>
                      <h4 className="text-white pt-10 sm:py-2">Welcome, please log in. <br/><br/>If this is your first time logging in since the update, you have to reset your password with "Forgot password"</h4>
                    </div>
                    {alert && (
                
                      <div 
                          className='bg-red-300 rounded p-2'
                      >
                        <div 
                            dangerouslySetInnerHTML={{ __html: alert[1] }}
                            className="text-center"
                        />
                      </div>
                    )}
                    <Login />

                    
                  </div>
                </>
              )
            )}

        </main>
      </div>
  )
}
  {/* return (
    <div className="relative w-full">
      <Navbar />
      <sellersGuide />
    <div className="md:flex static">
      <SideBar props={menuItems}/>

      <div className="xl:mx-32 lg:mx-24 md:mx-auto md:pt-32">
         <DashLinks props={dashboardItems}/>
        <div>
          <UsefulLinks props={useLinksItems}/>
        </div>
      </div>
    </div>
    </div>
  )
} */}
export async function getServerSideProps(context) {
  const [menuResponse, dashResponse, useLinksResponse] = await Promise.all([
    fetch(`${process.env.BASE_URL}/corr-portal-menu-items`),
    fetch(`${process.env.BASE_URL}/corr-portal-dashboard-items?populate=*`)
  ]); 

    const [menuItems, dashboardItems] = await Promise.all([
      menuResponse.json(),
      dashResponse.json()
    ]);
    
    return { props: { menuItems, dashboardItems } };
}
