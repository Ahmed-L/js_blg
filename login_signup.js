import {User} from './cls.js';

var userList = []
if(window.localStorage.getItem("userList"))
    userList = JSON.parse(window.localStorage.getItem("userList"));

let feedbackMsg = document.getElementById("feedback");
let isLoginPage = document.getElementsByTagName("h2")[0].textContent === "Log in"?true:false;
let buttonId = isLoginPage?"login_btn":"signup_btn";
let authOrReg = isLoginPage?auth:reg;
let btn = document.getElementById(buttonId);

function auth()
{
    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;
    let userFoundOrFalse = checkUserList(user, userList);
    if(!userFoundOrFalse)
    {
        // console.log(user, pass);
        feedbackMsg.textContent = "No registered user with this username."
        return;
    }
    if(userFoundOrFalse.password === pass)
    {
        window.sessionStorage.setItem("currentUser", JSON.stringify(userFoundOrFalse));
        window.location.href = "./index.html";
    }
    else
        feedbackMsg.textContent = "Incorrect password.";
}

function reg()
{
    const user_inputField = document.getElementById("user");
    const pass_inputField = document.getElementById("pass");
    let user = user_inputField.value.trim()
    let pass = pass_inputField.value.trim()
    if(user===""||pass==="")
    {
        feedbackMsg.textContent = "Input fields cannot be blank";
    }
    else
    {
        const userFoundOrFalse = checkUserList(user, userList);
        if(userFoundOrFalse)
            {
                alert("Another account with this username already exists.");
                return;
            }
        const new_user = new User(user, "random url", pass);
        userList.push(new_user);
        const isUpdateSuccessful = User.updateUserStorage(userList);
        if(!isUpdateSuccessful)
            return;
        feedbackMsg.textContent="Sign up successful.";
        user_inputField.textContent = "";
        pass_inputField.textContent = "";
    }
}

function checkUserList(username, userList)
{
    if(userList.length>0)
    {
        const userFoundOrFalse = userList.find(element => element.username===username);
        if(userFoundOrFalse!==undefined)
            return userFoundOrFalse;
        else
            return false;
    }
}

btn.addEventListener("click", ()=>authOrReg());