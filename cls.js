export class User
{
    // #password;
    constructor(username, img_src, password)
    {
        this.username = username;
        this.img_src = img_src;
        this.password = password;
    }
    // get getPass() {
    //     return this.password;
    //   }
    // set setPass(password)
    // {
    //     this.#password = password;
    // }
}

export function updateUserStorage(userList)
{
    try{
        const serializedMap = JSON.stringify([...userList.entries()]);
        localStorage.setItem('userList', serializedMap);
        }
        catch(e)
        {
            console.log(e);
            console.log("failed to store user map to the localstorage");
        }
}