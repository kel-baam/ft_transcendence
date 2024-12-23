import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js' 

export const UserWinRate =  defineComponent({
    state(){
      return {
        data : {
          totalMatches: '150',
          loseMatches: '22',
          winMatches : '40',
        },
        activateSection : 'win'
      }
    },
    render(){

        return h('div', { class: 'wining-rate-container' }, [
            h('div', { class: 'title' }, [
              h('span', {}, [
                h('h1', {}, ['Wining rate'])
              ])
            ]),
            h('div', { class: 'circle-and-buttons' }, [
            h('div', {class:'circular-container'}, 
                    [h('div', {class: 'circular_progress', style: {                        
                        background: this.state.activateSection === 'win' ? 
                        `conic-gradient(#0AA989  calc(${ Math.round((this.state.data.winMatches/ this.state.data.totalMatches)* 100)} * 3.6deg), #CBCBCB 0deg)` :
                        `conic-gradient(#D44444 calc(${ Math.round((this.state.data.loseMatches/ this.state.data.totalMatches)* 100)} * 3.6deg), #CBCBCB 0deg)`
                      }}, [h('span', { style : {color: this.state.activateSection === 'win'? '#0AA989':'#D44444', fontSize : '22px'}}, 
                        [this.state.activateSection === 'win' ? `${ Math.round((this.state.data.winMatches / this.state.data.totalMatches) * 100)}`+ '%':
                         ` ${ Math.round((this.state.data.loseMatches/ this.state.data.totalMatches)* 100)}` + '%'])])])
                ,
              h('div', { class: 'buttons' }, [
                h('button', { class: 'win-button', style : {color:' #0AA989', 
                  backgroundColor : this.state.activateSection === 'win'? '#ddd':'#CBCBCB'}, 
                on : {click : () => {
                  this.updateState({activateSection:'win'})
                }}}, [
                  'Win',
                  h('br'),
                  `${this.state.data.winMatches}` + '/' + `${this.state.data.totalMatches}`
                ]),
                h('button', { class: 'lose-button', style: {color: '#D44444',
                  backgroundColor : this.state.activateSection === 'lose'? '#ddd':'#CBCBCB'
                } ,
                on : {click : ()=> {
                  this.updateState({activateSection:'lose'})
                }}
                }, [
                  'Loss',
                  h('br'),
                  `${this.state.data.loseMatches}` + '/' + `${this.state.data.totalMatches}`
                ])
              ])
            ])
          ])
          
}})