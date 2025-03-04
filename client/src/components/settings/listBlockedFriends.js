import { customFetch } from '../../package/fetch.js'
import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString,RouterOutlet} from '../../package/index.js'

// let allUsers;
 export const listBlockedFriends = defineComponent({
    state()
    {
        return { 
        data : [],
        isLoadnig: true,
        searchedUser:""
        
    }
    },

    render()
    {
        const {isLoading, data, searchedUser} = this.state
        if(isLoading)
            return h('div',{ class: 'blocked-friends-container' })
        return h('div',
            { class: 'blocked-friends-container' },
            [
                h('div',
                    { class: 'search-friend' },
                    [
                        h('a',
                            { href: '#' },
                            [
                                h('i', {
                                    class: 'fa-solid fa-magnifying-glass icon',
                                    style: {'color': '#33518F'},
                                }),
                            ]
                        ),
                        h('input', {
                            type: 'text',
                            placeholder: 'Search...',
                            value : `${searchedUser}`,
                            on : {
                                input : (e) =>
                                {
                                        this.updateState({
                                            searchedUser:e.target.value
                                        })
                                    // if (event.target.value)
                                    // {
                                    //     const filtredData =   data.filter((item) =>
                                    //         item.user.username.toLowerCase().startsWith(event.target.value.toLowerCase())
                                    //     )
                                    //     this.updateState({data: filtredData, isLoading:false})

                                    // }
                                    // else
                                    //     this.updateState({data : [...allUsers], isLoading:false})
                                }
                            }
                        }),
                    ]
                ),
                ...data.map((item, i ) => {
                    console.log("--------------------------> item : ", item )
                    if ((searchedUser != "" && item.username.startsWith(searchedUser)) || searchedUser == "")
                        return h('div',{ class: 'profile-item' },
                            [
                                h('div', {},
                                    [
                                        h('img', {src: `https://${window.env.IP}:3000${item.picture}`, class: 'user-profile-pic',  
                                        style : {
                                            'object-fit': 'cover'  
                                        },
                                        // on : {error: (event) => {
                                        //     event.target.src = '/media/users_pics/default.png'; // Replace with your placeholder image
                                        // }}
                                    }),
                                    ]
                                ) ,
                                h('div',{on : {
                                    click : ()=> this.appContext.router.navigateTo(`/user/${item.user.username}`)
                                }},
                                            [
                                                h('h1', {style : {'width': '250px','max-width' : '250px',
                                                    'white-space': 'nowrap','overflow': 'hidden','text-overflow':' ellipsis'}}, 
                                                    [`${item.first_name}` + ' ' + `${item.last_name}`]),
                                                h('h2', {}, ['@'+ `${item.username}`]),
                                            ]
                                    ),
                                h('div',{},
                                        [
                                            h('i', {class: 'fa-solid fa-unlock', style: {'color': '#14397C'}, on : {
                                                click : () =>
                                                {
                                                    console.log("----------------------------> item.id : ", item.requet_id)
                                                    customFetch(`https://${window.env.IP}:3000/api/user/friendships?id=${item.id}`, 
                                                    {
                                                        method : 'DELETE'
                                                    }
                                                    )
                                                    .then(result =>{

                                                        if (!result.status == 401)
                                                            this.appContext.router.navigateTo('/login')
                                                        if (result.status == 204)
                                                        {
                                                            data.splice(i, 1)
                                                            console.log("res is okey")
                                                            this.updateState({
                                                                isLoading: false,  
                                                                data: data,   
                                                        });

                                                        }
                                                    })
                                                }
                                            }})
                                        ]
                                    )
                            ]
                            )
                })
                
            ]
        )
    },
    onMounted()
    {
        customFetch(`https://${window.env.IP}:3000/api/user/friendships?status=blocked`)
        .then(result =>{

            if (!result.status == 401)
            {
                console.log("res isn't okey ," , " | ", this)
                
                this.appContext.router.navigateTo('/login')
            }

            return result.json()
        })
        .then(res =>{
            console.log(">>>>>>>>>>>>>>> res : ", res,"|",res.status)
            console.log("res is okey")
            this.updateState({
                isLoading: false,  
                data: res,   
            });
            // allUsers = res;
        })

    
    }
 })