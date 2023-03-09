import {getAllBlogsFromEndPoint, postToEndPoint, deleteBlogById, updateBlogContenttoEndPoint, addLike, addComment, getBlogById, getMostRecentBlogId} from './utils.js'

let parent = document.getElementsByClassName("blogpost-container")[0];
const blog_div = document.getElementsByClassName("blogpost"), inputField = document.getElementById("input");
let user = JSON.parse(window.sessionStorage.getItem("currentUser"));
const edit_cancel = document.getElementById("edit_blog_cancel_btn"), edit_save = document.getElementById("edit_blog_save_btn");
const modal = document.getElementById("myModal"), modal_input = document.getElementById("edit_blog_input_textarea");
const commentMapElement = document.querySelector("#template_comment");
var trackBlogId = 0;

async function createPost()
{
    var content = inputField.value.trim();
    if(content==="") return;
    inputField.value = "";
    const response = await postToEndPoint(content, user.username);
    if(response.success)
    {
        const allblog_response = await getAllBlogsFromEndPoint();
        if(allblog_response.success)
        {
            const blog_list = allblog_response.data;
            const mostRecentBlog = getMostRecentBlogId(user.username, blog_list);
            const blog_uuid = mostRecentBlog.uuid;
            addPostToDOM(content, user.username, new Date(), blog_uuid);
        }
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
        same_user_liked_check = likes_list.find(element => element.user === user.username)
        like_count.getElementsByTagName("span")[1].textContent = likes_list.length;
    }
    if(comments_list!==undefined)
    {
        comment_count.getElementsByTagName("span")[1].textContent = comments_list.length;
    }
    const like_btn = dom_blog.querySelector(".like_btn");
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

    let isSuccess = await getAllBlogsFromEndPoint();
    let list_of_blogs = isSuccess.data;
    console.log(list_of_blogs);
    for(let i=0;i<list_of_blogs.length;i++)
    {
        addPostToDOM(list_of_blogs[i].content, list_of_blogs[i].author, new Date(list_of_blogs[i].created_at), list_of_blogs[i].uuid, list_of_blogs[i].likes, list_of_blogs[i].comments);
    }
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
    const response = await getBlogById(blog_id);
    if(!response.success)
        return;
    const blog = response.data;
    console.log(blog);
    let len = 0;
    if(blog.comments === undefined || blog.comments.length === 0)
        len = 0;
    else
        len = blog.comments.length;
    let currentBlogElement = document.getElementById(blog_id);
    currentBlogElement.querySelector(".comment-input").style.display = 'flex';
    for(let i=0;i<len;i++)
    {
        addSingleCommentToDOMElement(blog.comments[i].message, blog.comments[i].created_at, blog.comments[i].user, blog_id);
    }
}
async function handle_blog_events(e)
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
        console.log("del press")
        const isSuccess = await deleteBlogById(trackBlogId);
        if(isSuccess)
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
            const response = await addLike(trackBlogId, user.username);
            if(!response.success)
                return;
            e.target.textContent = "Liked!";
            e.target.style.background = "blueviolet";
            e.target.style.color = "white";
            const like_span = e.target.parentNode.parentNode.parentNode.querySelector(".like-count").getElementsByTagName("span")[1];
            like_span.textContent = parseInt(like_span.textContent) + 1;   
        }
    }
    else if(e.target.classList.contains("comment_btn"))
    {
        trackBlogId = e.target.parentNode.parentNode.parentNode.parentNode.id;
        const commentList = document.getElementById(trackBlogId).querySelector(".comment-list");
        commentList.innerHTML = "";
        addCommentsToDOMElement(trackBlogId);
    }
    else if(e.target.classList.contains("comment_submit_btn"))
    {   trackBlogId = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;
        let comment_count = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("span")[3];
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
}
window.onload = render;
edit_save.addEventListener("click", ()=>{
    const new_text = modal_input.value, blog_id = trackBlogId;
    let success = updateBlogContenttoEndPoint(new_text, blog_id);
    if(success)
    {
        modal.style.display = "none";
        const x = document.getElementById(blog_id);
        x.querySelector(".blogpost_text").textContent = new_text;
    }
})
edit_cancel.addEventListener("click", ()=>{modal.style.display = "none";})
parent.addEventListener("click", function(e){handle_blog_events(e);});
document.getElementById("logout").addEventListener("click", ()=>{;
    window.sessionStorage.clear();
    window.location.href = "login.html";
})
if(!window.sessionStorage.getItem("currentUser"))
        window.location.href = "login.html";
document.getElementById("input_button").addEventListener("click", ()=>{createPost()});