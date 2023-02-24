import { React, useState, useEffect } from 'react';
import axios from "axios"
import { useAuth0 } from "@auth0/auth0-react";

const AdminPage = () => {
    const { isAuthenticated, user, logout } = useAuth0()
    const [buttonState, setButtonState] = useState(false)
    const [isLinkValid, setIsLinkValid] = useState(true)
    const [isNewUserNameValid, setIsNewUserNameValid] = useState(true)
    const [links, setLinks] = useState([])
    const [userName, setUserName] = useState("")
    const [inputValue, setInputValue] = useState('');

    const getLinks = async () => {
        const data = { name: userName }
        console.log("Asking for links of user: " + userName)
        const links = await axios.post("http://localhost:3000/getLinks", data)
            .then(response => response.data)
            .then(data => data)
        setLinks(links)
    }

    const validateAndFormatLink = async (link) => {
        // Regular expression to match a valid URL
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

        // Check if the link matches the regular expression
        if (urlRegex.test(link)) {
            // If the link starts with "http://" instead of "https://", replace it with "https://"
            if (link.startsWith('http://')) {
                return link.replace('http://', 'https://');
            }
            // If the link doesn't start with "http://" or "https://", prepend "https://" to the beginning of the link
            else if (!link.startsWith('https://')) {
                return `https://${link}`;
            }
            // Otherwise, the link is already valid and starts with "https://"
            else {
                return link;
            }
        }
        // If the link is not a valid URL, return null
        else {
            return null;
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            const data = { name: user.name, email: user.email }
            const response = axios.post("http://localhost:3000/userExists", data)
                .then(response => response.data)
                .then((data) => {
                    if (data) {
                        console.log("Known user")
                        setUserName(data[0].name)
                    } else {
                        console.log("Hey new user!")
                    }
                })
        }
    }, [])

    useEffect(() => {
        if (isAuthenticated && userName != "") {
            const data = { name: userName, email: user.email }
            console.log("Posting new user request...")
            axios.post("http://localhost:3000/newUser", data)
            getLinks()
        }
    }, [userName])

    const buttonStateHandler = () => {
        setButtonState(!buttonState)
    }

    const addLinkHandler = async (e) => {
        e.preventDefault()
        let link = await validateAndFormatLink(e.target.link.value.toLowerCase())
        console.log("Formatted and validated link is: " + link)
        if (link != null) {
            setIsLinkValid(true)
            const response = await axios.post("http://localhost:3000/newLink", { userMail: user.email, name: e.target.linkName.value, link: link })
                .then(response => response.data)
                .then(data => console.log(data))
            getLinks()
            setButtonState(!buttonState)
        } else {
            setIsLinkValid(false)
        }
    }

    const deleteLinkHandler = async (linkToDelete) => {
        const response = await axios.post("http://localhost:3000/deleteLink", { userEmail: user.email, linkName: linkToDelete })
            .then(response => response.data)
            .then(data => console.log(data))
            .then(() => getLinks())
    }

    const handleChange = (e) => {
        const value = e.target.value;
        if (value.includes(' ')) {
            setInputValue(value.replace(' ', ''));
        } else {
            setInputValue(value);
        }
    };

    const addUserName = async (e) => {
        e.preventDefault()
        let newUserName = e.target.newUserName.value
        const data = { userName: newUserName.toLowerCase() }
        const response = axios.post("http://localhost:3000/userNameExists", data)
            .then(response => response.data)
            .then((data) => {
                if (data) {
                    console.log("User name already taken, select another one")
                    setIsNewUserNameValid(false)
                } else {
                    setUserName(newUserName.toLowerCase())
                }
            })
    }
    const items = links.map(item => <li className='link'><a key={item[0]} href={item[1]}>{item[0]}</a> <button onClick={() => deleteLinkHandler(item[0])}>X</button></li>)
    return (
        <div className="home">
            {userName == "" ? (
                <>
                    <div className='userNameSetUp'>
                        <form onSubmit={addUserName}>
                            <p>Please set your username:</p>
                            <input name="newUserName" onChange={handleChange} placeholder='user123' value={inputValue}></input>
                            <button type='Submit'>Set username</button>
                        </form>
                    </div>
                    {!isNewUserNameValid &&
                        <p className='notValidLink'>Username already taken. Chose another one.</p>}
                </>
            ) : (
                <p>Hey <a href={userName}>{userName}</a> how are you doing?</p>
            )
            }
            <button onClick={() => logout({ returnTo: window.location.origin })}>Logout</button>
            <div className="mainAdminPage">
                {buttonState ? (
                    <form onSubmit={addLinkHandler}>
                        <input placeholder='Link Name' name="linkName"></input>
                        <input placeholder='Link' name="link"></input>
                        <button className="addLink" type='Submit'>Add link</button>
                    </form>
                ) : (
                    <button className="addLink" onClick={buttonStateHandler}>Add link</button>
                )}
                {!isLinkValid &&
                    <p className='notValidLink'>Please submit a valid link</p>}
                <ul>{items}</ul>
            </div>
        </div >
    )
}

export default AdminPage;