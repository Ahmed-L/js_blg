let parent = document.getElementsByClassName("blogpost-container")[0]; 
const blog_div = document.getElementsByClassName("blogpost")[0];
const tempUser = JSON.parse(window.sessionStorage.getItem("currentUser"));
const inputField = document.getElementById("input");
let user = JSON.parse(window.sessionStorage.getItem("currentUser"));

var userList = new Map()
var blogList = new Map()

class User
{
    constructor(username, img_src, password)
    {
        this.username = username;
        this.img_src = img_src;
        this.password = password;
    }
}
class Blog
{
    constructor(user, blog_text)
    {
        this.user = user;
        this.blog_text = blog_text;
        this.date = new Date();
        const uuid = this.date.getTime();
        this.id = uuid;
    }
}
function createPost()
{
    var content = inputField.value.trim();
    if(content==="") return;
    inputField.value = "";
    let blog = new Blog(user, content);
    userList.set(user.username, user);
    blogList.set(blog.id, blog);
    updateBlogStorage();
    updateUserStorage();
    // const blog_div = document.getElementsByClassName("blogpost")[0];
    // const dom_post = blog_div.cloneNode(true);
    // dom_post.querySelector(".username").textContent = `${user.username}`;
    // dom_post.querySelector(".blogpost_text").innerText = `${post.blog_text}`;
    // dom_post.querySelector(".blogpost_time").innerText = `${post.date.toLocaleDateString() + " " + post.date.toLocaleTimeString()}`;
    // parent.insertBefore(dom_post, parent.firstChild);
    const post_success = postToEndPoint();
    if(post_success)
        addPostToDOM(blog, user);
}
function addPostToDOM(blog, user)
{
    // const blog_div = document.getElementsByClassName("blogpost")[0];
    const dom_blog = blog_div.cloneNode(true);
    dom_blog.querySelector(".username").textContent = `${user.username}`;
    dom_blog.querySelector(".blogpost_text").innerText = `${blog.blog_text}`;
    dom_blog.id = `${blog.id}`;
    //dom_blog.querySelector(".blogpost_time").innerText = `${blog.date.toLocaleDateString() + " " + blog.date.toLocaleTimeString()}`;
    parent.insertBefore(dom_blog, parent.firstChild);
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
    console.log("Total blogs:", blogList.size);
    const first_ele = parent.firstElementChild;
    if(first_ele!==null && first_ele.id==="template_blog")
        parent.removeChild(first_ele)

    for(let [key,value] of blogList)
    {
        addPostToDOM(value, value.user);
    }
    getAllBlogsFromEndPoint();
}
document.getElementById("logout").addEventListener("click", ()=>{;
    window.sessionStorage.clear();
    window.location.href = "login.html";
})


if(!window.sessionStorage.getItem("currentUser"))
        window.location.href = "login.html";

if(window.localStorage.getItem("blogList"))
    blogList = new Map(JSON.parse(window.localStorage.getItem("blogList")));
if(window.localStorage.getItem("userList"))
    userList = new Map(JSON.parse(window.localStorage.getItem("userList")));


async function getAllBlogsFromEndPoint()
{
    const url = 'http://localhost:4000/blog';
    const url_fake = "http://localhost:4000/blogzz";
    const proxyUrl = 'http://localhost:8010/proxy/blog'

    const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {'content-type': 'application/json'},
       })
       .then(response => response.json())
       .catch(e => console.log(e.message));
    //console.log(response);
    //console.log(typeof response);
    // console.log(response[0].content);
    return response;
}

async function postToEndPoint(blog_content, blog_author)
{
    const data = {
        content: blog_author,
        author: blog_content
    }

    const proxyUrl = 'http://localhost:8010/proxy/blog'
    const success = await fetch(proxyUrl,{
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(response => {
        if(response.ok)
            return true;
        else
            throw new Error("POST request failed");
    })
    .catch(error => {
        console.log("error");
        return false;
    });

    return success;
}

window.onload = render;

