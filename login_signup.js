import {User} from './cls.js';

var userList = []
if(window.localStorage.getItem("userList"))
    userList = JSON.parse(window.localStorage.getItem("userList"));

const feedbackMsg = document.getElementById("feedback");
const isLoginPage = document.getElementsByTagName("h2")[0].textContent === "Log in"?true:false;
const buttonId = isLoginPage?"login_btn":"signup_btn";
const authOrReg = isLoginPage?auth:reg;
const btn = document.getElementById(buttonId);

function auth()
{
    const user = document.getElementById("user").value.toString();
    const pass = document.getElementById("pass").value.toString();
    const userFoundOrFalse = checkUserList(user, userList);
    if(!userFoundOrFalse)
    {
        console.log(user, pass);
        feedbackMsg.textContent = "No registered user with this username."
        return;
    }
    if(userFoundOrFalse.password === pass)
    {
        window.sessionStorage.setItem("currentUser", JSON.stringify(userFoundOrFalse));
        window.location.href = "index.html";
    }
    else
        feedbackMsg.textContent = "Incorrect password.";
}

function reg()
{
    const user_inputField = document.getElementById("user");
    const pass_inputField = document.getElementById("pass");
    const user = user_inputField.value.trim()
    const pass = pass_inputField.value.trim()
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
        console.log(new_user.usename + " obj: username");
        console.log(new_user.pass + " obj: pass");
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
        console.log(userList)
        console.log(username)
        const userFoundOrFalse = userList.find(element => element.username===username);
        console.log(userFoundOrFalse);
        if(userFoundOrFalse!==undefined)
            return userFoundOrFalse;
        else
            return false;
    }
}

btn.addEventListener("click", ()=>authOrReg());