import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../lib/api";
import SideBar from "../components/SideBar";
import { Grid } from "react-loader-spinner";
import { Navbar } from "react-bootstrap";
import Router from "next/router";

function ProgramMatrix({menuItems, programItems}){

    const [pageNumber, setPageNumber] = useState(1);
    const [isLogged, setIsLooged] =  useState();
    const [isLoading, setIsLoading] = useState(false);

    
    useEffect(()=>{
       const fetchData = () =>{
        setIsLoading(true);
        let token = localStorage.getItem('jwt')
        
        if(token){
            setIsLooged(token);
            setIsLoading(false);
        }else{
            Router.push('/')
        }
       }
       fetchData();
    },[isLogged])

    const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/program-matrices?pagination[page]=${pageNumber}&pagination[pageSize]=6&populate=*`;
    const {data} = useSWR(URL, 
        fetcher,
        {
            fallbackData: programItems
        });
    return(
        <div className="relative w-full">
            <Navbar/>
            {isLoading?(
            <div className="md:flex relative">
            <SideBar props={menuItems}/>
            <div className="flex-1 p-10 text-2xl bg-slate-50 md:w-2/3 h-screen pt-32">
                <div style={{position:'absolute', left:'60%', top:'50%'}}>
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
            ):(
                <div className="md:flex relative">
                    <SideBar props={menuItems}/>
                    <div className="flex-1 p-10 text-2xl bg-slate-50 md:w-2/3 h-screen md:pt-32 sm:pt-6 sm:px-2">
                        <div className="relative rounded-xl overflow-auto sm:pb-20">
                            <table className="border-collapse table-fixed w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-500 dark:text-slate-400 text-left">Filename</th>
                                        <th className="border-b dark:border-slate-600 font-medium pl-11 pt-0 pb-3 text-slate-500 dark:text-slate-400 text-left">Download</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800">
                                    {data.data.map((item, key)=>{
                                       return <tr key={key}>
                                            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{item.attributes.name}</td>
                                            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                                                <a
                                                   href={`${process.env.NEXT_PUBLIC_API_URL}${item.attributes.excel.data[0]?.attributes.url}`}
                                                   className="hover:bg-gray-50 text-[#0033A1] font-medium py-2  px-4 border border-[#0033A1] hover:border-transparent rounded no-underline"
                                                   target="_blank"
                                                   rel="noreferrer"
                                                >
                                                   Download
                                                </a>          
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                            <div className="flex justify-center mt-4 gap-4 pb-4">
                                <button
                                  className={`inline-flex items-center py-2 px-4 text-sm font-medium text-gray-500 rounded-lg border border-gray-300 hover:bg-bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                                    pageNumber === 1 ? 'bg-gray-300' 
                                    : 'bg-white'
                                  }`}
                                  disabled={pageNumber === 1}
                                  onClick={()=>{setPageNumber(pageNumber - 1)}}
                                >
                                    Previous
                                </button>
                                <button className={`inline-flex items-center py-2 px-4 text-sm font-medium text-gray-500 rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark-text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                                    pageNumber === (data && data.meta.pagination.pageCount)
                                    ?'bg-gray-300'
                                    :'bg-white'
                                }`}
                                disabled={pageNumber === (data.meta.pagination.pageCount)}
                                onClick={()=>{setPageNumber(pageNumber + 1)}}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }    
         </div>
        )    
}

export async function getServerSideProps(){
    const [menuResponse, trainingRespnse] = await Promise.all([
        fetch(`${process.env.BASE_URL}/corr-portal-menu-items`),
        fetch(`${process.env.BASE_URL}/program-matrices?pagination[page]=1&paginatoin[pageSize]=6&populate=*`)
    ]);

    const [menuItems, programItems] = await Promise.all([
        menuResponse.json(),
        trainingRespnse.json()
    ])
    return{ props: {menuItems, programItems}}
}

export default ProgramMatrix;