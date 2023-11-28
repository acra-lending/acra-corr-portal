import { useState, useEffect } from "react";
import Router from 'next/router';
import SideBar from "../components/SideBar";
import Navbar from '../components/NavBar'
import { fetcher } from "../lib/api";
import useSWR from "swr";
import {Grid} from "react-loader-spinner";
import { Document, Page } from "react-pdf";
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function FormsTable({menuItems, formsItems}) {

    const [isLogged, setIsLogged] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [numPages, setNumPages] = useState(null);

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

    const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/sellers-guides?populate=*`;
    const { data } = useSWR(URL,
        fetcher,
        {
            fallbackData: formsItems
        }
    );
    return (
        <div className="relative w-full">
            <Navbar />
            {isLoading ? (
                <div className="md:flex relative">
                <SideBar props={menuItems}/>
                    <div className="flex-1 p-10 text-2xl bg-slate-50 md:w-2/3 h-screen pt-32" >
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
                    <SideBar props={menuItems}/>
                    <div className="flex-1 p-10 text-2xl bg-slate-50 md:w-2/3 h-screen md:pt-32 sm:pt-6 sm:px-2" >
                        <div className="relative rounded-xl overflow-auto sm:pb-20 flex justify-center">
                        <div style={{height:"700px"}}>
                         <div>  
                        <Document file={`${process.env.NEXT_PUBLIC_API_URL}${data.data[0].attributes.pdf.data[0].attributes.url}`}  onLoadSuccess={({ numPages }) => {setNumPages(numPages)}}>  
                           {Array.from({ length: numPages }, (_, index) => (
                             <Page key={`page_${index + 1}`} pageNumber={index + 1}  renderTextLayer={false} renderAnnotationLayer={false} width={1200} height={700}/>
                            ))}
                        </Document>
                        </div>
                        </div>
                        </div>
                    </div>
                </div>
            )}
    </div>
    )
}

export async function getServerSideProps() {
    const [menuResponse, formsResponse] = await Promise.all([
      fetch(`${process.env.BASE_URL}/corr-portal-menu-items`),
      fetch(`${process.env.BASE_URL}/sellers-guides?populate=*`)
    ]); 
  
      const [menuItems, formsItems] = await Promise.all([
        menuResponse.json(),
        formsResponse.json()
      ]);
      
      return { props: { menuItems, formsItems } };
}

export default FormsTable;
