import {v4 as uuidv4} from 'uuid'
//const {v4 : uuidv4} = require('uuid')

const dummyUser = new User("Mr.Nobody", "some url", "abcd");
if(!window.sessionStorage.getItem("currentUser"))
    window.sessionStorage.setItem("currentUser", dummyUser);

console.log(uuidv4());

class Blog
{
    constructor(user, blog_text)
    {
        this.user = user;
        this.blog_text = blog_text;
        this.id = uuidv4();
    }
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


function createPost()
{
    var str = document.getElementById("input").textContent;
    var user = window.sessionStorage.getItem("currentUser");
    let post = new Blog(user, str);
    console.log("username: ", post.user.username, "post: ",post.blog_text)
}