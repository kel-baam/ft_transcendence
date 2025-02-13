import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'

// import { custom}
import { customFetch } from '../package/fetch.js'

    const promise = new Promise((resolve, reject)=>{
        resolve("hello world!")
    })
export const header = defineComponent({
    state()
    {
        return {
            suggestions : []
        }
    },
 
    render(){
        const {suggestions} = this.state
        // console.log(">>>>>>>>>>>>>>>> render the header ")
    return h('header', { class: 'container' }, [
        h('nav', {}, [
            h('a', { href: '/home' }, [
                h('img', { src: './images/logo.png', class: 'logo' })
            ]),
            h('div', { class: 'search' }, [
                h('a', {  }, [
                    h('i', { class: 'fa-solid fa-magnifying-glass icon', 'aria-hidden': 'false' })
                ]),
                h('input', { type: 'text', placeholder: 'Search...', id:'searchBox', on : {
                    input : ()=>
                    {
                        const suggestions = document.getElementById('suggestions')
                        if (searchBox.value.trim() !== '') {
                            suggestions.style.display = 'block';
                        } else {
                            suggestions.style.display = 'none';
                        }
                        
                        customFetch(`https://${window.env.IP}:3000/api/user/search?q=${searchBox.value}`)
                        .then((result)=>
                        {
                            switch(result.status)
                            {
                                case 401:
                                    console.log(">>>>>>>>>>>>> here ")
                                    this.appContext.router.navigateTo('/login')
                                    break;
                                // case 404:
                                //     console.log(">>>>>>>----------- 404 >>>>>> here ")
                                //     h('h1', {}, ['404 not found'])
                                //     break;
                            }
                            return result.json()
                        })
                        .then((res)=>{
                            console.log(">>>>>>>>>>>>>>> here the suggestions ", res)
                            this.updateState({
                                suggestions:res
                            })

                        })

                    }
                } }),
                // <div class="suggestions" id="suggestions">
                h('div', {class : 'suggestions', id : 'suggestions'},  suggestions.map(suggestion => 
                    h('div', { class: 'suggestion-item', on : {
                        click : ()=>
                        {
                            // this.updateState({suggestion:[]})
                            this.appContext.router.navigateTo(`/user/${suggestion.username}`)
                        }
                            
                    }}, [
                        h('img', { src: `https://${window.env.IP}:3000${suggestion.picture}`, alt: 'User picture', style : {'object-fit': 'cover' }}),
                        ` ${suggestion.username}`
                    ])
            ))
            ]),
            h('div', { class: 'left-side' }, [
                h(notifComponent, {}),
                h('a', { href: '#/settings' }, [
                    h('i', { class: 'fa-solid fa-sliders icon', 'aria-hidden': 'false' })
                ]),
                h('a', {on :{click: async (event)=> {
                    event.preventDefault()
                    fetch(`https://${window.env.IP}:3000/auth/logout/`,{
                        method:'POST',
                        credentials: 'include',
                    }).then(async (res)=>{
                        if(res.ok)
                        {
                            this.appContext.router.navigateTo('/login')
                        }
                    })
                   
                }, }}, [
                    h('i', { class: 'fa-solid fa-arrow-right-from-bracket icon', 'aria-hidden': 'false' })
                ])
            ])
        ])
    ])
    // searchResults()
    // {

    // }
}})

const notifComponent = defineComponent({
    render() {
    return h('a', { href: 'notification' }, [
        h('i', { className: 'fa-regular fa-bell icon', 'aria-hidden': 'false' })
    ])
}})

