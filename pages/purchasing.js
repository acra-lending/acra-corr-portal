import SideBar from "../components/SideBar";
import Navbar from '../components/NavBar'


function purchasingConditionsUpload({menuItems}) {

    return (
        <div className="relative w-full">
            <Navbar />
            <div className="md:flex relative">
                <SideBar props={menuItems} />
                <div className="md:flex p-10 md:w-2/3 pt-18 justify-center m-auto">
                    <iframe className="md:w-8/12 w-full aspect-video min-h-[510px]" src="https://acralending.com/box-api/box-corr-package-upload.html?var=1"></iframe>
                </div>
            </div>
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

export default purchasingConditionsUpload;