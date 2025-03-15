"use server" ;

import { redirect } from "next/navigation";

export async function postOrderData(prev,data) {

    console.log(prev,data ) ;

    if( !data.title || data.title.trim() === '' )
    {
        return { msg:'title anput must be !!! '}
    }

    redirect("/about") ;
}