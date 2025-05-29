import Footer from "./footer";
import Info from "./info";
import Map from "./map";

function Home() {
  return (
    <>
        <div className="flex h-screen w-screen bg-gray-100 p-4 pb-10"> 
        <div className="flex-1 mr-4"> 
            <div className="rounded-[10px] overflow-hidden h-full bg-white shadow-md">
            <Map />
            </div>
        </div>
        <div className="w-[350px] bg-white border-l border-gray-200 overflow-y-auto rounded-[10px] shadow-md">
            <Info />
        </div>
        </div>
        <div className="fixed bottom-0 bg-white shadow-md z-50">
            <Footer/>
        </div>
    </>
  );
}

export default Home;
