import {FC} from "react";
import Script from "next/script";
import Link from "next/link";


interface pageProps {
}

const index: FC<pageProps> = ({}) => {
  return (
    <>
      <h1>Home page</h1>
      <div className='flex flex-col'>
        <Link href='/Inline'>Inline cart page</Link>
        <Link href='/lightbox'>Lightbox cart page</Link>
      </div>

      <Script
        src="https://secure.safewebservices.com/token/Collect.js"
        data-tokenization-key="5mN8N7-jhr55W-N22pxX-uAW2s9"
        strategy="afterInteractive"
      ></Script>
    </>
  )
};

export default index;
