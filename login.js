import {User} from 'class.js';

var userList = new Map()

if(window.localStorage.getItem("userList"))
{
    userList = new Map(JSON.parse(window.localStorage.getItem("userList")));
}

function auth()
{
    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;
    
    if(userList.has(user) && pass === userList.get(user).getPass())
    {
        window.sessionStorage.setItem("currentUser", userList.get(user));
        window.location.href = "index.html";
    }
    else
    {
        for(x of document.getElementsByTagName("label"))
        {
            x.textContent = "Incorrect username or password";
            // x.style.color = "red";
        }
    }
}

function reg()
{
    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;

    if(user==="" || pass==="")
    {
        for(x of document.getElementsByTagName("label"))
            x.textContent = "Input fields cannot be blank";
    }
    else
    {
        if(userList.has(user))
            {
                alert("Another account with this username already exists.");
                return;
            }
        const new_user = new User(user, "random url", pass);
        userList.set(user, new_user)
    }
}