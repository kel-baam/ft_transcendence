import createElement from "../framework/createElement.js";


export async function customFetch(url,options={})
{
    const defaultOptions = {
        method: 'GET',
        credentials: 'include',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
    }

    const mergedOptions = {
        ...defaultOptions,
        ...options,
    }

    return  await fetch(url,mergedOptions).then(async (response)=>
            {
                if(!response.ok)
                {
                    if(response.status == 401)
                    {
                        const refreshAccessToken = await fetch('http://backend/api/refresh/token/',{
                        method:'GET',
                        credentials: 'include',})
                        if(!refreshAccessToken.ok)
                        {
                            window.location.href = 'http://frontend:80/login';                    
                            return;
                        }
                        return  this.customFetch(url,options)
                    }
                    return new Error(response.message || "error when you trying to fetch data")
                }
                const data =   await response.json()
                return data
        })
}
