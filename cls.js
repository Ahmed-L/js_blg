export class User
{
    constructor(username, img_src, password)
    {
        this.username = username;
        this.img_src = img_src;
        this.password = password;
    }
    static updateUserStorage(userList) {
        try{
            const serializerList = JSON.stringify([...userList]);
            localStorage.setItem('userList', serializerList);
            return true;
            }
            catch(e)
            {
                console.log(e);
                console.log("failed to store user map to the localstorage");
                return false;
            }
    }
}