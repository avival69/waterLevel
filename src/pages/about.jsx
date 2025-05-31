
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function About() {
    const [Loading,setLoading] = useState(true);
    const [Data,setData] = useState([]);
    const [Error,setError] = useState(null);
    useEffect(()=>{
        axios.get('http://localhost:3000/api').then((res)=>{
            setData(res.data);
            setLoading(false);

        }).catch((error)=>{
            console.log(error);
            setError(error);
        })
    },[])
    if(Loading) return <p>Loading</p>
    if(Error) return <p>{setError}</p>
    if(Data.length === 0) return <p>no data found</p>
  const specificDate = '29.05.2025';
  const entry = Data.find(item=>(item.date === specificDate));
  const name = entry.table.slice(1).map(item =>(item[1]));
  return (
        <div>
            {entry ? (
                <div>
                    <ul>
                        {name.slice(1).map((row,index)=>{
                            return <li key={index}>{row}</li>
                        })}
                    </ul>
                    
                </div>
            ) : (
                <p>No data for {specificDate}</p>
            )}
        </div>
    );
}

export default About;
