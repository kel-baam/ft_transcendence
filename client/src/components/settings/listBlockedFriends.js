import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString,RouterOutlet} from '../../package/index.js'

 export const listBlockedFriends = defineComponent({
    state()
    {
        return { 
        data : [
            {
                first_name : 'nisrin',
                last_name : 'boukhari',
                username : 'niboukha',
                picture : {src : 'images/kel-baam.png'}
            },
            {
                first_name : 'kaoutar',
                last_name : 'elbaamrani',
                username : 'kel-baam',
                picture : {src : 'images/kel-baam.png'}
            },
            {
                first_name : 'souad',
                last_name : 'hicham',
                username : 'shicham',
                picture : {src : 'images/kel-baam.png'}
            }
        ]
    }
    },

    render()
    {
        // console.log(">>>>>>>>>>>>>>>> here ")

        return h('div',
            { class: 'blocked-friends-container' },
            [
                // Search Friend Section
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
                            on : {
                                input : (event) =>
                                {
                                    // console.log(">>>>>>>>>>>>> value : ", event.target.value)
                                    
                                    if (event.target.value)
                                    {
                                        const filtredData =   this.state.data.filter((item) =>
                                            item.first_name.toLowerCase().includes(event.target.value.toLowerCase()) ||
                                            item.last_name.toLowerCase().includes(event.target.value.toLowerCase()) ||
                                            item.username.toLowerCase().includes(event.target.value.toLowerCase())
                                        )
                                        this.updateState({data: filtredData})

                                    }
                                    else
                                    {
                                        // console.log(">>>>>>>>>>>>>here value is vide ")
                                        this.updateState()

                                    }
                                    
                                    
                                }
                            }
                        }),
                    ]
                ),
                ...this.state.data.map((item, i ) => {
                    
                    return h('div',{ class: 'profile-item' },
                            [
                                h('div', {},
                                    [
                                        h('img', {src: `${item.picture.src}`,alt: 'profile picture', class: 'user-profile-pic'}),
                                    ]
                                ) ,
                                h('div',{},
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
                                                    this.state.data.splice(i, 1)
                                                    this.updateState()
                                                    console.log(">>>>>>>>>>>>>>>>>> new data  => ")
                                                }
                                            }})
                                        ]
                                    )
                            ]
                            )
                })
                
            ]
        )
    }
 })