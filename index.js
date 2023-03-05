let parent = document.getElementsByClassName("blogpost-container")[0]; 
const blog_div = document.getElementsByClassName("blogpost")[0];
const tempUser = JSON.parse(window.sessionStorage.getItem("currentUser"));
const inputField = document.getElementById("input");
let user = JSON.parse(window.sessionStorage.getItem("currentUser"));


class User
{
    constructor(username, img_src, password)
    {
        this.username = username;
        this.img_src = img_src;
        this.password = password;
    }
}
async function createPost()
{
    var content = inputField.value.trim();
    if(content==="") return;
    inputField.value = "";
    const post_success = await postToEndPoint(content, user.username);
    if(post_success)
    {
        const blog_list = await getAllBlogsFromEndPoint();
        const mostRecentBlog = getMostRecentBlogId(user.username, blog_list);
        const blog_uuid = mostRecentBlog.uuid;
        console.log(blog_uuid);
        addPostToDOM(content, user.username, blog_uuid);
    }
}
function addPostToDOM(blog_content, author, blog_uuid)
{
    const dom_blog = blog_div.cloneNode(true);
    dom_blog.querySelector(".username").textContent = `${author}`;
    dom_blog.querySelector(".blogpost_text").innerText = `${blog_content}`;
    dom_blog.id = `${blog_uuid}`;
    //dom_blog.querySelector(".blogpost_time").innerText = `${blog.date.toLocaleDateString() + " " + blog.date.toLocaleTimeString()}`;
    parent.insertBefore(dom_blog, parent.firstChild);
}
async function render()
{
    const first_ele = parent.firstElementChild;
    if(first_ele!==null && first_ele.id==="template_blog")
        parent.removeChild(first_ele)

    let list_of_blogs = await getAllBlogsFromEndPoint();
    console.log(list_of_blogs)
    for(let i=0;i<list_of_blogs.length;i++)
    {
        addPostToDOM(list_of_blogs[i].content, list_of_blogs[i].author, list_of_blogs[i].uuid);
    }
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
    return response;
}

async function postToEndPoint(blog_content, blog_author)
{
    const data = {
        content: blog_content,
        author: blog_author
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

async function getBlogById(id)
{
    const proxyUrl = `http://localhost:8010/proxy/blog/${id}`

    const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {'content-type': 'application/json'},
       })
       .then(response => response.json())
       .catch(e => console.log(e.message));
    return response;
}
function getMostRecentBlogId(author, bloglist)
{
    const filteredList = bloglist.filter(blog => blog.author===author);
    return filteredList[filteredList.length - 1];
}

window.onload = render;

