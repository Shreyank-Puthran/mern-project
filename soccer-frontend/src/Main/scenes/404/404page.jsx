const NotFound = () => {
  return (
    <>
      {/* bg-[url('/video-bg.jpg')] */}
      <main className="grid h-[100vh] place-items-center bg-[#f0f0f0] px-6 py-15 sm:py-10 lg:px-8">
        <div className="text-center">
          <div className="">
            <img src="/404.webp"/>
          </div>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-balance text-[#212121] sm:text-7xl">
            Page not found
          </h1>
          <p className="mt-2 text-lg font-medium text-pretty text-[#212121] sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-4 flex items-center justify-center gap-x-6">
            <a
              href="/"
              className="rounded-md bg-[#212121] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#212121]/90 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Go back home
            </a>
          </div>
        </div>
      </main>
    </>
  )
}

export default NotFound;