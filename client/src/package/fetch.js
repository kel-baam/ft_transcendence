

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
                        const refreshAccessToken = await fetch(`https://${window.env.IP}:3000/auth/refresh/token/`,{
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