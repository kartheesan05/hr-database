import HrDetails from "@/components/hr-details";
import Navbar from "@/components/navbar";
function Page() {
  return (
    <>
      <Navbar hrpage={true} />
      <HrDetails />
    </>
  );
}

export default Page;
