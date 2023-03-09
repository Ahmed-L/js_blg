var baseURL = "http://localhost:4000";

export async function getAllBlogsFromEndPoint()
{
    const proxyUrl = baseURL + '/blog';
    try{
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {'content-type': 'application/json'},
           })
        if(response.ok)
        {
            const responseData = await response.json();
            return {success:true, data: responseData};
        }
        else
        {
            const error = await response.text();
            throw new Error(`GET request failed with status code ${response.status}: ${errorMessage}`);
        }
    }
    catch(error)
    {
        console.log("error: ", error.message);
        return {sucess: false, error: error.message};
    }
}

export async function postToEndPoint(content, author)
{
    const proxyUrl = baseURL + '/blog';
    try
    {
        const data = {content, author}
        console.log(data);
        const response = await fetch(proxyUrl,{
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(data)
        })
        if(response.ok)
        {
            const responseData = await response.text();
            return {success: true, data: responseData};
        }
        else
        {
            const error = await response.text();
            throw new Error(`POST request failed with status code ${response.status}: ${errorMessage}`);
        }
    }
    catch(error)
    {
        console.log("error: ", error.message);
        return {sucess: false, error: error.message};
    }
}
export async function deleteBlogById(blog_id)
{
    const proxyUrl = baseURL + `/blog/${blog_id}`;
    try{
        const response = await fetch(proxyUrl, {
            method:'DELETE',
            headers: {'content-type':'application/json'}
        })
        if(response.ok)
        {
            const responseData = await response.text();
            return {success: true, data: responseData};
        }
        else
        {
            const error = await response.text();
            throw new Error(`DELETE request failed with status code ${response.status}: ${errorMessage}`);
        }
    }
    catch(error)
    {
        console.log("error: ", error.message);
        return {sucess: false, error: error.message};
    }
}
export async function updateBlogContenttoEndPoint(content, blog_id)
{
    const proxyUrl = baseURL + `/blog/${blog_id}`;
    try{
        const data = {content};
        const response = await fetch(proxyUrl,{
            method: 'PATCH',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(data)
        })
        if(response.ok)
        {
            const responseData = response.text();
            return {success: true, data:responseData};
        }
        else
        {
            throw new Error(`PATCH request failed for updating blog content with status code ${response.status}: ${errorMessage}`);
        }
    }
    catch(error)
    {
        console.log("error: ", error.message);
        return {success:false, error:error.message};
    }
}
export async function addLike(blog_id, user)
{
    const data = {user};
    const proxyUrl = baseURL + `/blog/like/${blog_id}`;
    try{
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(data)
        })
        if(response.status===201 || response.status === 200)
        {
            const responseData = await response.text();
            return {success: true, data: responseData};
        }
        else
        {
            const error = await response.text();
            throw new Error(`POST request failed with status code ${response.status}: ${errorMessage}`);
        }
    }
    catch(error)
    {
        console.log("error: ", error.message);
        return {sucess: false, error: error.message};
    }
}
export async function addComment(blog_id, message, user)
{
    const proxyUrl = baseURL+`/blog/commnet/${blog_id}`;
    try{
        const data = {message, user}
        const response = await fetch(proxyUrl, {
            method: "POST",
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(data)
        })
        if(response.ok)
        {
            const responseData = await response.text();
            return {success: true, data: responseData};
        }
        else
        {
            const error = await response.text();
            throw new Error(`POST request failed with status code ${response.status}: ${errorMessage}`);
        }
    }
    catch(error)
    {
        console.log("error: ", error.message);
        return {sucess: false, error: error.message};
    }
}
export async function getBlogById(id)
{
    const proxyUrl = baseURL+`/blog/${id}`
    try{
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {'content-type': 'application/json'},
        })
        if(response.ok)
            {
                const responseData = await response.json();
                return {success: true, data: responseData};
            }
            else
            {
                const error = await response.text();
                throw new Error(`GET request failed with status code ${response.status}: ${errorMessage}`);
            }
    }
    catch(error)
    {
        console.log("error: ", error.message);
        return {sucess: false, error: error.message};
    }
}
export function getMostRecentBlogId(author, bloglist)
{
    const filteredList = bloglist.filter(blog => blog.author===author);
    return filteredList[filteredList.length - 1];
}