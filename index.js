let parent = document.getElementsByClassName("blogpost-container")[0];
const blog_div = document.getElementsByClassName("blogpost")[0];
const tempUser = JSON.parse(window.sessionStorage.getItem("currentUser"));
const inputField = document.getElementById("input");
let user = JSON.parse(window.sessionStorage.getItem("currentUser"));
const edit_cancel = document.getElementById("edit_blog_cancel_btn");
const edit_save = document.getElementById("edit_blog_save_btn");
const modal = document.getElementById("myModal");
const modal_input = document.getElementById("edit_blog_input_textarea");
const commentMapElement = document.querySelector("#template_comment");
// const like_btn = document.getElementById
var trackBlogId = 0;

class User
{
    constructor(username, img_src, password){this.username = username;this.img_src = img_src;this.password = password;}
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
        // console.log(blog_uuid);
        addPostToDOM(content, user.username, new Date(), blog_uuid);
    }
}
function addPostToDOM(blog_content, author, date, blog_uuid, likes_list, comments_list)
{
    const dom_blog = blog_div.cloneNode(true);
    dom_blog.querySelector(".username").textContent = `${author}`;
    dom_blog.querySelector(".blogpost_text").innerText = `${blog_content}`;
    dom_blog.id = `${blog_uuid}`;
    dom_blog.querySelector(".blogpost_time").innerText = `${date.toDateString()}`;
    const edit = dom_blog.querySelector(".edit_btn");
    const del = dom_blog.querySelector(".delete_btn");
    let same_user_liked_check = undefined;
    let comment_count = dom_blog.querySelector(".comment-count");
    let like_count = dom_blog.querySelector(".like-count");
    if(likes_list!==undefined)
    {
        // console.log("working")
        same_user_liked_check = likes_list.find(element => element.user === user.username)
        like_count.getElementsByTagName("span")[1].textContent = likes_list.length;
    }
    if(comments_list!==undefined)
    {
        comment_count.getElementsByTagName("span")[1].textContent = comments_list.length;
    }
    // console.log("same user liked?: ", same_user_liked_check)
    console.log(like_count.getElementsByTagName("span")[1].textContent)
    const like_btn = dom_blog.querySelector(".like_btn");
    // console.log(like_btn);
    if(same_user_liked_check!==undefined)
    {
        like_btn.textContent = "Liked!";
        like_btn.style.background = "blueviolet";
        like_btn.style.color = "white";
    }
    if(author!==user.username)
    {
        edit.parentNode.removeChild(edit);
        del.parentNode.removeChild(del);
    }
    parent.insertBefore(dom_blog, parent.firstChild);
}
async function render()
{
    const first_ele = parent.firstElementChild;
    if(first_ele!==null && first_ele.id==="template_blog")
        parent.removeChild(first_ele)

    let list_of_blogs = await getAllBlogsFromEndPoint();
    // console.log(list_of_blogs)
    for(let i=0;i<list_of_blogs.length;i++)
    {
        addPostToDOM(list_of_blogs[i].content, list_of_blogs[i].author, new Date(list_of_blogs[i].created_at), list_of_blogs[i].uuid, list_of_blogs[i].likes, list_of_blogs[i].comments);
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
    const proxyUrl = 'http://localhost:4000/blog';

    const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {'content-type': 'application/json'},
       })
       .then(response => response.json())
       .catch(e => console.log(e.message));
    return response;
}

function addSingleCommentToDOMElement(comment_message, comment_time, commenter, blog_id)
{
    console.log(commenter);
    let currentBlogElement = document.getElementById(blog_id);
    const newCommentElement = commentMapElement.cloneNode(true);
    newCommentElement.id = blog_id;
    newCommentElement.querySelector(".comment_text").textContent = comment_message
    newCommentElement.querySelector(".comment_time").textContent = new Date(comment_time).toDateString();
    newCommentElement.getElementsByTagName("h4")[0].textContent = commenter;
    newCommentElement.style.display = 'block';
    const thisCommentList = currentBlogElement.querySelector(".comment-list");
    thisCommentList.insertBefore(newCommentElement, thisCommentList.firstChild);
}
async function addCommentsToDOMElement(blog_id)
{
    const blog = await getBlogById(blog_id);
    console.log(blog);
    let len = 0;
    if(blog.comments === undefined || blog.comments.length === 0)
        len = 0;
    else
        len = blog.comments.length;
    // console.log("Length of comments", len);
    let currentBlogElement = document.getElementById(blog_id);
    currentBlogElement.querySelector(".comment-input").style.display = 'flex';
    for(let i=0;i<len;i++)
    {
        console.log(blog.comments[0].user)
        addSingleCommentToDOMElement(blog.comments[i].message, blog.comments[i].created_at, blog.comments[i].user, blog_id);
    }
}

async function postToEndPoint(blog_content, blog_author)
{
    const data = {
        content: blog_content,
        author: blog_author
    }

    const proxyUrl = 'http://localhost:4000/blog'
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
async function deleteBlogById(blog_id)
{
    const proxyUrl = `http://localhost:4000/blog/${blog_id}`;
    const success = await fetch(proxyUrl, {
        method:'DELETE',
        headers: {'content-type':'application/json'}
    }).then(response => {
        if(response.ok)
            return true;
        else throw new Error("DELETE request failed");
    })
    .catch(err=>{
        console.log("error: ", err);
        return false;
    })
}
async function updateBlogContenttoEndPoint(blog_content, blog_id)
{
    const data = {content:blog_content}
    // console.log("Data is: ", data);
    const proxyUrl = `http://localhost:4000/blog/${blog_id}`;
    const success = await fetch(proxyUrl,{
        method: 'PATCH',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(response => {
        if(response.ok)
            return true;
        else
            throw new Error("PATCH request failed");
    })
    .catch(error => {
        console.log("error:", error);
        return false;
    });

    return success;
}
async function addLike(blog_id, liked_by)
{
    const data = {user:liked_by};
    const proxyUrl = `http://localhost:4000/blog/like/${blog_id}`;
    const success = await fetch(proxyUrl, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(response => {
        if(response.ok)
            return true;
        else
            throw new Error("Like POST request failed");
    })
    return success;

}
async function addComment(blog_id, comment_message, commented_by)
{
    // console.log("blog_id is: ", blog_id);
    // console.log("commented by: ", commented_by);
    const data = {message:comment_message, user:commented_by}
    const proxyUrl = `http://localhost:4000/blog/commnet/${blog_id}`;
    const success = await fetch(proxyUrl, {
        method: "POST",
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(response => {
        if(response.ok)
            {
                console.log("successfully added comment");
                return true;
            }
        else
            throw new Error("Comment POST request failed");
    })
    return success;
}
async function getBlogById(id)
{
    const proxyUrl = `http://localhost:4000/blog/${id}`

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
edit_cancel.addEventListener("click", ()=>{
    modal.style.display = "none";
})

edit_save.addEventListener("click", ()=>{
    const new_text = modal_input.value;
    const blog_id = trackBlogId;
    let success = updateBlogContenttoEndPoint(new_text, blog_id);
    if(success)
    {
        modal.style.display = "none";
        const x = document.getElementById(blog_id);
        x.querySelector(".blogpost_text").textContent = new_text;
    }
})

parent.addEventListener("click", function(e){
    handle_blog_events(e);
});

function handle_blog_events(e)
{
    trackBlogId = e.target.parentNode.parentNode.parentNode.id;
    if(e.target.classList.contains("edit_btn"))
    {
        const input_textarea = e.target.parentNode.parentNode.parentNode.getElementsByClassName("blogpost_text")[0];
        const old_text = input_textarea.textContent;
        modal_input.value = old_text;
        modal.style.display = "block";
    }
    else if(e.target.classList.contains("delete_btn"))
    {
        const success = deleteBlogById(trackBlogId);
        if(success)
        {
            const blog = document.getElementById(trackBlogId);
            blog.parentElement.removeChild(blog);
        }
    }
    else if(e.target.classList.contains("like_btn"))
    {
        if(e.target.textContent==="Like")
        {
            trackBlogId = e.target.parentNode.parentNode.parentNode.parentNode.id;
            const success = addLike(trackBlogId, user.username);
            if(!success)
                return;
            e.target.textContent = "Liked!";
            e.target.style.background = "blueviolet";
            e.target.style.color = "white";
            const like_span = e.target.parentNode.parentNode.parentNode.querySelector(".like-count").getElementsByTagName("span")[1];
            like_span.textContent = parseInt(like_span.textContent) + 1;
            
        }
        // else
        // {
        //     e.target.textContent = "Like";
        //     e.target.style.background = "none";
        //     e.target.style.color = "blueviolet";
        // }
    }
    else if(e.target.classList.contains("comment_btn"))
    {
        trackBlogId = e.target.parentNode.parentNode.parentNode.parentNode.id;
        // console.log("clicked comment")
        addCommentsToDOMElement(trackBlogId);
    }
    else if(e.target.classList.contains("comment_submit_btn"))
    {   trackBlogId = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;
        let comment_count = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("span")[3];
        // console.log(trackBlogId);
        // console.log("clicked comment submit");
        const input = e.target.parentNode.querySelector(".comment");
        let comment = input.value;
        input.value = "";
        addComment(trackBlogId, comment, user.username)
        .then(()=>
        {
            addSingleCommentToDOMElement(comment, new Date(), user.username, trackBlogId);
            comment_count.textContent = parseInt(comment_count.textContent) + 1;
        })
        .catch(e => console.log("error: ", e))
    }
    //to be added for likes/comments
}
window.onload = render;

