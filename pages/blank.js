import {useState, useEffect } from "react";
import Router from 'next/router';
import SideBar from "../components/SideBar";
import Navbar from '../components/NavBar';
import {Grid} from "react-loader-spinner";

function Page ({menuItems}){
    const [isLogged, setIsLogged] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            setIsLoading(true);
            let token = localStorage.getItem('jwt');
    
            if(token) {
                setIsLogged(token);
                setIsLoading(false);
                location.replace('https://www.evolvemtgs.com/client/AcraLending.asp');
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
                    <div className="md:flex p-10 md:w-2/3 pt-18 justify-center m-auto">
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
                    <div className="flex-1 p-10 text-2xl bg-slate-50 md:w-2/3 h-screen md:pt-32 sm:pt-6 sm:px-2" >
                    </div>
                </div>
            )}
        </div>
    )
}

export async function getServerSideProps(context) {
    const response = await fetch(`${process.env.BASE_URL}/corr-portal-menu-items`)

    const data = await response.json()
    return {
        props: { menuItems: data },
    };
  }


export default Page;