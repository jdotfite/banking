import { NextPage } from 'next'
import Head from 'next/head'

const ServerErrorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>500 - Server Error</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold">500</h1>
        <p className="mt-4 text-xl">Server-side error occurred</p>
      </div>
    </>
  )
}

export default ServerErrorPage
