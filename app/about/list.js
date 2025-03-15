import Image from "next/image";

export default function List({id,userId,title,body})
{

    console.log(id) ;

    return (
        <div className="bg-white hover:bg-slate-300 border-2 border-red-500 rounded-lg p-2">

            <h4>{id}</h4>
            {/* <Image src={image}  width={150} height={80} ></Image> */}
            <h2>{title}</h2>
            <p> {body}</p>

        </div>
    ) ;
}