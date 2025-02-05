

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
                // console.log("daatta",response.status)
                if(!response.ok)
                {
                    if(response.status == 401)
                    {
                        const refreshAccessToken = await fetch(`${window.env.DOMAIN}/auth/refresh/token/`,{
                            method:'GET',
                            credentials: 'include',})
                            // console.log("custome feeetch")
                            // console.log("ref data=>",refreshAccessToken)
                        
                            if(!refreshAccessToken.ok)           
                                return refreshAccessToken;
                        
                        return  customFetch(url,options)
                        }
                }
                // console.log("finaaaaaly result=>",response)
                return response
        })
}