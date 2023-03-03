import {User, updateUserStorage} from './cls.js';

var userList = new Map()

if(window.localStorage.getItem("userList"))
{
    userList = new Map(JSON.parse(window.localStorage.getItem("userList")));
}


if(document.getElementsByTagName("h2")[0].textContent==="Log in")
    document.getElementById("login_btn").addEventListener("click", ()=>{auth();});
else
    document.getElementById("signup_btn").addEventListener("click", ()=>{reg();})

function auth()
{
    const user = document.getElementById("user").value.toString();
    const pass = document.getElementById("pass").value.toString();
    // console.log(user)
    if(userList.has(user) && pass === userList.get(user).password)
    {
        window.sessionStorage.setItem("currentUser", JSON.stringify(userList.get(user)));
        window.location.href = "index.html";
    }
    else
    {
        for(let x of document.getElementsByTagName("label"))
        {
            x.textContent = "Incorrect username or password";
            // x.style.color = "red";
        }
    }
}

function reg()
{
    const user = document.getElementById("user")
    const pass = document.getElementById("pass")
    console.log(user.value + " this is username");
    console.log(pass.value + " this is pass");

    if(user.value==="" || pass.value==="")
    {
        for(let x of document.getElementsByTagName("label"))
            x.textContent = "Input fields cannot be blank";
    }
    else
    {
        if(userList.has(user.value))
            {
                alert("Another account with this username already exists.");
                return;
            }
        const new_user = new User(user.value, "random url", pass.value);
        console.log(new_user.usename + " obj: username");
        console.log(new_user.pass + " obj: pass");
        userList.set(user.value, new_user);
        user.value = "";
        pass.value = "";
        document.getElementsByTagName("h2")[0].textContent="Sign up successful.";
        document.getElementsByTagName("h2")[0].style.color="blueviolet";
        updateUserStorage(userList);

    }
}
