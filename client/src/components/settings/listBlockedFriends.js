import { customFetch } from '../../package/fetch.js'
import{defineComponent,h} from '../../package/index.js'

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
                                }
                            }
                        }),
                    ]
                ),
                ...data.map((item, i ) => {
                    if ((searchedUser != "" && item.username.startsWith(searchedUser)) || searchedUser == "")
                        return h('div',{ class: 'profile-item' },
                            [
                                h('div', {},
                                    [
                                        h('img', {src: `https://${window.env.IP}:3000${item.picture}`, class: 'user-profile-pic',  
                                        style : {
                                            'object-fit': 'cover'  
                                        },
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
                                                    customFetch(`https://${window.env.IP}:3000/api/user/friendships?id=${item.request_id}`, 
                                                    {
                                                        method : 'DELETE'
                                                    }
                                                    )
                                                    .then(result =>{

                                                        if (result.status == 401)
                                                            this.appContext.router.navigateTo('/login')
                                                        if (result.status == 204)
                                                        {
                                                            data.splice(i, 1)
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

            if (result.status == 401)
                this.appContext.router.navigateTo('/login')
            return result.json()
        })
        .then(res =>{
            this.updateState({
                isLoading: false,  
                data: res,   
            });
        })
    }
 })