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
          isOwn : true
        }
    },
    render()
    {
        const {isExpanded} = this.props

        if (!this.state.activateSection)
          this.state.activateSection = this.props.activateSection
       
        const {activateSection, isLoading, isOwn} = this.state
        console.log(">>>>>>>>>>>>>>>>> isOwn ? ", isOwn)
        return h('div', { class: 'friends-and-requetes-container',
          style : isExpanded ? {
            position :  'absolute', top : '17%', left: '30%',
            backgroundColor: '#161C40', width:'800px', height : '700px',
            'grid-template-rows' : '18% 76% '
          } : {}
         }, [
          
          h('div', { class: 'friends-and-req-buttons', 
            style : isExpanded || !isOwn ? {display :'flex', justifyContent:'center'} : {} }, 
            !isExpanded ? [

            h('div', {}, [
              h('button', { class: 'friends-button', style: {backgroundColor:  
                activateSection === 'friends' && isOwn ?'rgba(95, 114, 125, 0.08)' : 'transparent'},
              on : { click : () => 
                this.fetch('http://localhost:3000/api/user/friendships?status=accepted','friends')
              } }, [
                h('h1', {}, ['Friends'])
              ])
            ]),

            h('div', { style : !isOwn ? {display : 'none'}:{}}, [
              h('button', { class: 'request-button', style: {backgroundColor:  
                activateSection === 'requests' ?'rgba(95, 114, 125, 0.08)' : 'transparent'},
                on : {
                  click : () => {
                    this.fetch('http://localhost:3000/api/user/friendships?status=recieved','requests' )
                    }
              } }, [
                h('h1', {}, ['Requests'])
              ])
            ]),

            h('div', { style : !isOwn ? {display : 'none'}:{}}, [
              h('button', { class: 'pending-button' , style: {
                backgroundColor:
                activateSection === 'pending' ?'rgba(95, 114, 125, 0.08)' : 'transparent'
                },
                on : {
                  click : ()=> 
                  {
                    this.fetch('http://localhost:3000/api/user/friendships?status=sent','pending' )
                  }
                }}, [h('h1', {}, ['Pending'])
              ])
            ])
          ] : [h('div', { class: 'header'}, [
            h('div', { class: 'search' }, [
                h('a', { href: '#' }, [
                    h('i', { class: 'fa-solid fa-magnifying-glass icon' })
                ]),
                h('input', { type: 'text', placeholder: 'Search...', on :{
                  input : (target) => {
                  console.log("********************> target : ", target)
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
          (activateSection === 'friends' && h(FriendsItems, {data: this.state.data, isExpanded: isExpanded})) ||
          (activateSection === 'requests' && h(RequestsItems, {data: this.state.data, isExpanded: isExpanded,
            on : {
              remove : this.removeRequest,
              accept : this.acceptRequest
            },
          })) ||
          (this.state.activateSection === 'pending' && h(PendingItems, {data: this.state.data, isExpanded: isExpanded,
            on : {
              remove : this.removeRequest
            },
          })),

          h('div', { class: 'view-all-link-fr', style : {color : '#14397C'} },
            this.state.data.length >= 4  && !isExpanded ? 
            [
              h('a', { on : {
                  click : () => 
                  {
                    this.emit('blurProfile', {activateSection : activateSection, 
                      isBlured:true, Expanded:'socialCard'})
                    // this.updateState({isExpanded:true, activateSection : activateSection})
                  }
              }}, ['View all'])
            ]: [])
        ])
    },
    removeRequest({id, i})
    {
        customFetch(`http://localhost:3000/api/user/friendships/?id=${id}`, {
          method : 'DELETE'
        }).then((res)=>
        {
          // console.log(">>>>>>>>>>>>>>>>>> after cancel the pending request  : ", res)
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
      customFetch(`http://localhost:3000/api/user/friendships/`, {
        method : 'PUT',
        headers: {
          'Content-Type': 'application/json', // Explicitly set content type
        },
        body : JSON.stringify({
            id : id,
            status : 'accepted'
      })
      }).then((res)=>
      {
        // console.log(">>>>>>>>>>>>>>>>>> after cancel the pending request  : ", res)
        if (res.status == 200)
        {
          const newData = [...this.state.data]
          // console.log(">>>>>>>>>>>>>>>>>>>------------------------------------------->>>> newData : ", newData)
          newData.splice(i, 1)
          this.updateState({data : newData})
        }
      })
    },
    onMounted()
    {
      // console.log(">>>>>>>>>>>>> here on onmouted social card ")
      var  endPoint  = 'http://localhost:3000/api/user/friendships?status=accepted'
      if(JSON.stringify(this.appContext.router.params) !== '{}')
      {
        endPoint = `http://localhost:3000/api/user/friendships?username=${this.appContext.router.params.username}&status=accepted`
        // console.log('>>>>>>>>>>>>>>>>>>>>>>>> here enpoint changed , ', endPoint)
      }
      customFetch(endPoint)
        .then(result =>{

            if (!result.ok)
            {
                // console.log("res isn't okey ," , " | ", this)
                
                this.appContext.router.navigateTo('/login')
            }

            return result.json()
        })
        .then(res => {
            // console.log(">>>>>>>>>>>>>>> in social card heeeeeeeeeeeeeeeeeeeeeeeeeere res : ", res,"|")
            // console.log("res is okey")
            this.updateState({
                    isLoading: false,  
                    data : res,
                    error: null   
            });

        })
        .catch(error => {
            // console.log(">>>>>>>>>>>> error in win  : ", error)
        })
    },
    
    fetch(endPoint, activateSection)
    {
      // if(JSON.stringify(this.appContext.router.params) !== '{}')
      //     endPoint = endPoint + '&username=' +`${this.appContext.router.params.username}`
      // console.log("---------------------------------------============================> endpoint : ", endPoint)
      customFetch(endPoint)
        .then(result =>{

            if (!result.ok)
            {
                // console.log("res isn't okey ," , " | ", this)
                
                this.appContext.router.navigateTo('/login')
            }

            return result.json()
        })
        .then(res => {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> in social card  res : ", res,"|", res.status)
            // console.log("res is okey")
            this.updateState({
                    isLoading: false,  
                    data: res,   
                    error: null ,
                    activateSection: activateSection
            });

        })
        .catch(error => {
            // console.log(">>>>>>>>>>>> error in win  : ", error)
        })
    }
})


