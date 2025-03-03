import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js' 
import { customFetch } from '../../package/fetch.js'

export const UserWinRate =  defineComponent({
    state(){
      return {
        isLoading: true,
        data : {
         },
        activateSection : 'win'
      }
    },
    render(){
      const {data, isLoading} = this.state
        if (isLoading) {
            return h('div', { class: 'wining-rate-container' },[
              h('div', { class: 'title' }, [
                h('span', {}, [
                  h('h1', {'data-translate' : 'Winning rate' }, ['Winning rate'])
                ])
              ]),
            ]);
        }
        return h('div', { class: 'wining-rate-container' }, [
            h('div', { class: 'title' }, [
              h('span', {}, [
                h('h1', {'data-translate' : 'Winning rate'}, ['Winning rate'])
              ])
            ]),
            h('div', { class: 'circle-and-buttons' }, [
            h('div', {class:'circular-container'}, 
                    [h('div', {class: 'circular_progress', style: {                        
                        background: this.state.activateSection === 'win' ? 
                        `conic-gradient(#0AA989  calc(${ 
                           Math.round(isNaN(data.wins / data.total_matches)? 0: (data.wins / data.total_matches) * 100)
                        } * 3.6deg), #CBCBCB 0deg)`  :
                        `conic-gradient(#D44444 calc(${ Math.round( isNaN(data.losses / data.total_matches) ? 0 : 
                          (data.losses / data.total_matches)* 100)} * 3.6deg), #CBCBCB 0deg)`
                      }}, [h('span', { style : {color: this.state.activateSection === 'win'? '#0AA989':'#D44444', fontSize : '22px'}}, 
                        [this.state.activateSection === 'win' ? `${ Math.round(isNaN(data.wins / data.total_matches)? 0:
                           (data.wins / data.total_matches) * 100)}`+ '%':
                         ` ${ Math.round( isNaN(data.losses / data.total_matches) ? 0 : 
                          (data.losses / data.total_matches)* 100)}` + '%'])])])
                ,
              h('div', { class: 'buttons' }, [
                  h('button', { class: 'win-button', style : {color:' #0AA989', 
                    backgroundColor : this.state.activateSection === 'win'? '#ddd':'#CBCBCB'}, 
                  on : {
                    click : () => {
                        this.updateState({activateSection:'win'})
                  }}, 
                  // 'data-translate' : 'Win'
                }, [
                    h('span', {}, ['Win']),
                    h('br'),
                    h('span', {}, [`${data.wins}` + '/' + `${data.total_matches}`])
                  ]),
                  h('button', { class: 'lose-button', style: {color: '#D44444',
                    backgroundColor : this.state.activateSection === 'lose'? '#ddd':'#CBCBCB'
                  } ,
                  on : {
                    click : ()=> {
                      this.updateState({activateSection:'lose'})
                  }},
                  // 'data-translate':'Loss'
                  }, [
                    h('span', {}, ['Loss']),
                    h('br'),
                    h('span', {}, [`${data.losses}` + '/' + `${data.total_matches}`])
                    
                  ])
              ])
            ])
          ])
          
  },
  onMounted()
  {
      const {key} = this.props
      const endPoint = !key ?  `https://${window.env.IP}:3000/api/user/stats` :
      `https://${window.env.IP}:3000/api/user/stats?username=${key}`
      customFetch(endPoint)
        .then(result =>{

            if (!result.ok)
                this.appContext.router.navigateTo('/login')
            return result.json()
        })
        .then(res => {
            this.updateState({
                    isLoading: false,  
                    data: res,   
                    error: null   
            });

        })
        .catch(error => {
        })
  }
})