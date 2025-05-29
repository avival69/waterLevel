function Info(){
    return(
        <>
        <div className="flex flex-col">
            <div className="flex flex-col  h-[125px] p-4">
                 <input className="mb-2 p-2 rounded" type="text" placeholder="Search.."></input>
                 <button className=" border-2 rounded bg-white text-black p-2 hover:bg-blue-700 ">sorted by</button>

            </div>
            <div className="bg-green-400 overflow-auto">
                <ul className="space-y-2">
                    <li>dam1</li>
                    <li>dam1</li>
                    <li>dam1</li>   
                    <li>dam1</li>
                </ul>

            </div>

        </div>
        
        </>
    );
}
export default Info