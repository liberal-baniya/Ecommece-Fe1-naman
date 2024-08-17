import  { useEffect, useState } from "react";

function useProductData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(
      `https://dummyjson.com/products`
    )
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((res)=> console.log("fuckin error"))
      
  }, []);
    console.log(data)
  return data;
}

export default useProductData;