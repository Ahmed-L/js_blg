// import { v4 as uuidv4 } from "uuid";
// //const {v4 : uuidv4} = require('uuid')
//import { uuid } from "./uuid";
//
var userList = new Map()
var blogList = new Map()
if(window.localStorage.getItem("blogList"))
{
    blogList = new Map(JSON.parse(window.localStorage.getItem("blogList")));
}
if(window.localStorage.getItem("userList"))
{
    userList = new Map(JSON.parse(window.localStorage.getItem("userList")));
}

class User
{
    #password;
    constructor(username, img_src, password)
    {
        this.username = username;
        this.img_src = img_src;
        this.password = password;
    }
}

let dummyUser = new User("Mr.Nobody", "some url", "abcd");
dummyUser = JSON.stringify(dummyUser);
console.log(dummyUser);
if(!window.sessionStorage.getItem("currentUser"))
    window.sessionStorage.setItem("currentUser", dummyUser);

const tempUser = JSON.parse(window.sessionStorage.getItem("currentUser"));
console.log(tempUser);

// console.log(uuidv4());

class Blog
{
    constructor(user, blog_text)
    {
        this.user = user;
        this.blog_text = blog_text;
        //this.id = uuidv4();
        this.date = new Date();
        console.log("date:",this.date);
        const uuid = this.date.getTime();
        console.log("uuid:", uuid);
        this.id = uuid;
    }
}


function createPost()
{
    var str = document.getElementById("input").value;
    document.getElementById("input").value = "";
    console.log("content: ", str);
    var user = JSON.parse(window.sessionStorage.getItem("currentUser"));
    console.log("username: ",user.username);
    let post = new Blog(user, str);
    console.log("username: ", post.user.username, "post: ",post.blog_text);

    userList.set(user.username, user);
    blogList.set(post.id, post);
    updateBlogStorage();
    updateUserStorage();
}

function updateBlogStorage()
{
    try{
        const serializedMap = JSON.stringify([...blogList.entries()]);
        localStorage.setItem('blogList', serializedMap);
        }
        catch
        {
            console.log("failed to store blog map to the localstorage");
        }
}

function updateUserStorage()
{
    try{
        const serializedMap = JSON.stringify([...userList.entries()]);
        localStorage.setItem('userList', serializedMap);
        }
        catch
        {
            console.log("failed to store user map to the localstorage");
        }
}


function render()
{
    let parent = document.getElementsByClassName("blogpost-container")[0];
    let blog_div = document.getElementsByClassName("blogpost")[0];
    console.log("Total blogs:", blogList.size);

    for(let [key,value] of blogList)
    {
        console.log("key is: ",key);
        console.log("value is: ",value);
        console.log("value.user.username is: ", value.user.username);
        //blog_div.getElementsByTagName("img")[0].src = value.user.img_src;
        // blog_div.getElementsByTagName("span")[0].textContent = value.user.username;
        // blog_div.getElementsByTagName("p")[0].textContent = value.blog_text;
        //parent.appendChild(blog_div);
        var html_string = "<div class='blogpost'><div style='display: flex;'><img class='profile-image' src='https://i.pinimg.com/originals/54/e6/3c/54e63c9e4830da4bc23912e6d941e53c.png' alt='profile-image'><span class='username'>"+value.user.username + "</span></div><p class='blogpost_text'>"+value.blog_text+"</p></div>";
        parent.insertAdjacentHTML('afterbegin', html_string);
    }
    
}

window.onload = render;