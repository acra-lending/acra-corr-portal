import SVG from 'react-inlinesvg';
import Link from 'next/link';
function DashLinks ({ props }) {

    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`

//     `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
//   <path stroke-linecap="round" stroke-linejoin="round" d="M15 13.5H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
// </svg>`

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:pb-0 gap-8 px-3 pt-4">
            <a 
                className="no-underline"
                href="https://acracorrespondent.loannex.com/" target="_blank"
                rel="noreferrer"
            >

                <a className='text-black no-underline'>
                    <div className="flex items-center justify-center hover:scale-105 gap-3 cursor-pointer break-normal font-medium text-lg p-6 bg-white border-1 rounded-xl drop-shadow-lg">
                        <SVG 
                            src={svgIcon}
                            width={35}
                        />
                        {/* Pricing Engine & Detailed Eligibility */}
                        Pricing Engine, Registration, Lock
                    </div>
                </a>
            </a>
            {props?.data.map(item => (
                <Link
                    key={item.id} 
                    href={item.attributes?.file?.data ? `${process.env.NEXT_PUBLIC_API_URL}${item.attributes.file.data.attributes.url}` : item.attributes.link}
                >
                    <a className='text-black no-underline'>
                        <div className="flex items-center justify-center hover:scale-105 gap-3 cursor-pointer break-normal font-medium text-lg p-6 bg-white border-1 rounded-xl drop-shadow-lg">
                            <SVG 
                                src={item.attributes.icon}
                                width={35}
                            />
                            {item.attributes.title}
                        </div>
                    </a>
                </Link>
            ))}
        </div>
    )
}

export default DashLinks;