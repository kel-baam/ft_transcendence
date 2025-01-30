

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
                    // if(4)
                    if(response.status == 401)
                    {
                        console.log(response.message)
                        const refreshAccessToken = await fetch('http://10.14.3.3:3000/auth/refresh/token/',{
                            method:'GET',
                            credentials: 'include',})
                            if(!refreshAccessToken.ok)
                                           
                                return refreshAccessToken;
                        return  customFetch(url,options)
                    }
                }
                return response
        })
}