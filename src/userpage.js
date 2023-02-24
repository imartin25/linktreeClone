import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"

const UserPage = () => {
    const params = useParams()
    const [links, setLinks] = useState([])

    const getLinks = async () => {
        const data = { name: params.userName }
        console.log("Asking for links")
        const links = await axios.post("http://localhost:3000/getLinks", data)
            .then(response => response.data)
            .then(data => data)
        setLinks(links)
    }

    useEffect(() => {
        getLinks()
    }, [])
    // Call al server preguntando cuantos y cuales links tiene este usuario agregados
    // En el return
    // Renderizar los links que tenga el usuario agregado
    const items = links.map(item => <li className='link'><a key={item[0]} href={item[1]}>{item[0]}</a></li>)
    return (
        <>
            <div>
                <p>User name : {params.userName}</p>
                <div className="linksList">
                    {items}
                </div>
            </div>

        </>
    )
}

export default UserPage;