import { NextPage } from 'next'
import Head from 'next/head'

const NotFoundPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-4 text-xl">Page not found</p>
      </div>
    </>
  )
}

export default NotFoundPage
