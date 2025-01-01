import Navbar from "@/components/navbar";
import CsvUpload from "@/components/csv-upload";

function Page() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen py-20">
        {/* <p>Building this page...</p> */}
        <CsvUpload />
      </div>
    </>
  )
}

export default Page