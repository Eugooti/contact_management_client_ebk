const Heading = ({title,subtitle}) => {
  return (
      <>
          <div className="text-left mb-6 grid gap-y-3 sm:ml-4 md:ml-0 sm:mt-0 w-full">
              <h1 className='text-2xl font-bold font-sans text-gray-800'>{title}</h1>
              <h1 className='text-xl font-bold font-sans text-gray-800' >{subtitle}</h1>
          </div>
      </>
  )
}

export default Heading