import '../styles/globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from "next/head";
import Footer from '../components/Footer'

config.autoAddCss = false

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Acra Lending | Correspondent Portal</title>
      </Head>
      <Component {...pageProps} />
      <Footer />    
    </>
    
    )
    
}
export default MyApp
