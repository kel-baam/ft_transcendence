import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js' 
import { customFetch } from '../../package/fetch.js'
import { FriendsItems } from './FriendsItems.js'
import { RequestsItems } from './RequestsItems.js'
import { PendingItems } from './PendingItems.js'

export const SocialCard = defineComponent({
    state()
    {
        return {
          activateSection : null,
          isLoading:true,
          data:[],
          searchedUser:""
        }
    },
    render()
    {
        const {isExpanded, key} = this.props

        if (!this.state.activateSection)
          this.state.activateSection = this.props.activateSection
       
        const {activateSection, isLoading, data, searchedUser} = this.state
       
        return h('div', { class: 'friends-and-requetes-container',
          style : isExpanded ? {
            position :  'absolute', top : '17%', left: '30%',
            backgroundColor: '#161C40', width:'800px', height : '700px',
            'grid-template-rows' : '18% 76% '
          } : {}
         }, [
          
          h('div', { class: 'friends-and-req-buttons', 
            style : isExpanded || key ? {display :'flex', justifyContent:'center'} : {} }, 
            !isExpanded ? [

            h('div', {style : key ? {display:'flex', justifyContent :'center'}:{}}, [
              !key ?
              h('button', { class: 'friends-button', style: {backgroundColor:  
                activateSection === 'friends' && !key ?'rgba(95, 114, 125, 0.08)' : 'transparent'},
              on : { click : () => 
                this.fetch(`https://${window.env.IP}:3000/api/user/friendships?status=accepted`,'friends')
              } }, 
              [
                h('h1', {'data-translate' : 'Friends'}, ['Friends'])
              ]
              ): h('h1', {'data-translate' : 'Friends'}, ['Friends'])
            ]),

            h('div', { style : key ? {display : 'none'}:{}}, [
              h('button', { class: 'request-button', style: {backgroundColor:  
                activateSection === 'requests' ?'rgba(95, 114, 125, 0.08)' : 'transparent'},
                on : {
                  click : () => {
                    this.fetch(`https://${window.env.IP}:3000/api/user/friendships?status=recieved`,'requests' )
                    }
              } }, [
                h('h1', {'data-translate' : 'Requests'}, ['Requests'])
              ])
            ]),

            h('div', { style : key ? {display : 'none'}:{}}, [
              h('button', { class: 'pending-button' , style: {
                backgroundColor:
                activateSection === 'pending' ?'rgba(95, 114, 125, 0.08)' : 'transparent'
                },
                on : {
                  click : ()=> 
                  {
                    this.fetch(`https://${window.env.IP}:3000/api/user/friendships?status=sent`,'pending' )
                  }
                }}, [h('h1', {'data-translate' : 'Pending'}, ['Pending'])
              ])
            ])
          ] : [
            h('div', { class: 'header'}, [
            h('div', { class: 'search' }, [
                h('a', { href: '#' }, [
                    h('i', { class: 'fa-solid fa-magnifying-glass icon' })
                ]),
                h('input', { type: 'text', placeholder: 'Search...', value : `${searchedUser}`,on :{
                  input : (e) => {
                  console.log("********************> target : ", e.target.value)
                  const value = e.target.value
                    this.updateState({
                      searchedUser: value
                    })
                }} }), 
            ]),
            h('div', { class: 'close-icon' }, [
                h('i', { 
                  class: 'fa fa-close', 
                  style: {fontSize:'34px', color:'#D44444', 'border-radius':'5px', marginLeft:'410px'},
                  on : { click : () => 
                    {
                      this.emit('removeBlurProfile', {activateSection : activateSection, 
                        isBlured:false, Expanded:null})
                    }
                  }
                })
            ])
        ])])
          ,
          (activateSection === 'friends' && h(FriendsItems, {data: data, isExpanded: isExpanded, key,
            searchedUser:searchedUser
          })) ||
          (activateSection === 'requests' && h(RequestsItems, {data: data, isExpanded: isExpanded,
            on : {
              remove : this.removeRequest,
              accept : this.acceptRequest
            },
            searchedUser:searchedUser
          })) ||
          (this.state.activateSection === 'pending' && h(PendingItems, {data: data, isExpanded: isExpanded,
            on : {
              remove : this.removeRequest
            },
            searchedUser:searchedUser
          })),

          h('div', { class: 'view-all-link-fr', style : {color : '#14397C'} },
            data.length >= 4  && !isExpanded ? 
            [
              h('a', { on : {
                  click : () => 
                  {
                    this.emit('blurProfile', {activateSection : activateSection, 
                      isBlured:true, Expanded:'socialCard'})
                    this.updateState({isExpanded:true, activateSection : activateSection})
                  }
              }, 'data-translate' : 'View all'}, ['View all'])
            ] : [])
        ])
    },
    removeRequest({id, i})
    {
        customFetch(`https://${window.env.IP}:3000/api/user/friendships?id=${id}`, {
          method : 'DELETE'
        }).then((res)=>
        {
          if (res.status == 204)
          {
            const newData = [...this.state.data]
            newData.splice(i, 1)
            this.updateState({data : newData})
          }
        })
    },
    acceptRequest({id, i})
    {
      customFetch(`https://${window.env.IP}:3000/api/user/friendships`, {
        method : 'PUT',
        headers: {
          'Content-Type': 'application/json', 
        },
        body : JSON.stringify({
            id : id,
            status : 'accepted'
      })
      })
      .then((res)=>
      {
        if (res.status == 200)
        {
          const newData = [...this.state.data]
          newData.splice(i, 1)
          this.updateState({data : newData})
        }
      })
    },
    onMounted()
    {
      const {key} = this.props
      const  endPoint  = !key ? `https://${window.env.IP}:3000/api/user/friendships?status=accepted`:
      `https://${window.env.IP}:3000/api/user/friendships?username=${key}&status=accepted`
      customFetch(endPoint)
        .then(result =>{

            if (!result.ok)
            {
              // if (result.status == 404)
              //     this.appContext.router.navigateTo('/404')
                
                this.appContext.router.navigateTo('/login')
            }

            return result.json()
        })
        .then(res => {
            this.updateState({
                    isLoading: false,  
                    data : res,
                    error: null   
            });

        })
        .catch(error => {
        })
    },
    
    fetch(endPoint, activateSection)
    {
    
      customFetch(endPoint)
        .then(result =>{

            if (!result.ok)
            {
              this.appContext.router.navigateTo('/login')
            }

            return result.json()
        })
        .then(res => {
            this.updateState({
                    isLoading: false,  
                    data: res,   
                    error: null ,
                    activateSection: activateSection
            });

        })
        // .catch(error => {
        //     // console.log(">>>>>>>>>>>> error in win  : ", error)
        // })
    }
})


