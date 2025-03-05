import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js' 
import { customFetch } from '../../package/fetch.js'

export const GameHistoryCard = defineComponent({
    state()
    {
      return {
        isLoading : true,
        isExpanded:false,
        data : [
        ]
      }
    },
    render()
    {
      const {data, isLoading} = this.state
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> data : ", data )
      const {isExpanded} = this.props
      if (isLoading)
        return  h('div', { class: 'match-history-container', style : isExpanded ? {
          position :  'absolute', top : '17%', left: '30%',
          backgroundColor: '#161C40', width:'800px', height : '700px', 'grid-template-rows': '10% 80% 10%',
          fontFamily:'myFont',
          backdropFilter: 'blur(5px)',
          'z-index': '1001',
          '-webkit-backdrop-filter': 'blur(5px)'
        } : {}})
      return h('div', { class: 'match-history-container' , 
          style : isExpanded ? {
          position :  'absolute', top : '17%', left: '30%',
          backgroundColor: '#161C40', width:'800px', height : '700px', 'grid-template-rows': '10% 80% 10%',
          fontFamily:'myFont',
          backdropFilter: 'blur(5px)',
          'z-index': '1001',
          '-webkit-backdrop-filter': 'blur(5px)'


        } : {}},
        [
           h('div', { class: 'title-item', style : isExpanded ? {justifyContent: 'space-between',paddingTop:'50px'}: {}},
            [
               h('span', {}, 
                [
                  h('h1', {style : isExpanded ? {color : '#FFEEBF', paddingLeft:'300px'} : {}, 
                    'data-translate' : 'Matches history'}, ['Matches history'])
                ]
              ),isExpanded ?
              h('i', { 
                class: 'fa fa-close', 
                style: {fontSize:'34px', color:'#D44444', 'border-radius':'5px', paddingRight:'50px', paddingBottom:'45px'},
                on : { click : () => this.emit('removeBlurProfile', {Expanded:null})}
              }): null
            ]
          ),
          h(GameHistoryItems, {data : data, isExpanded : isExpanded})
          ,
            h('div', { class: 'view-all-match' },
            data.length >= 4  && !isExpanded ? 
            [
              h('a', { on : {click : () => 
                this.emit('blurProfile', {Expanded:'MatchesHistory'})
                // h(GameHistoryItems, {})
                // {
                //   console.log(">>>>>>>>>>>>> here the div rendred ")
                //   h('div', {style :{color : 'red'}}, ["hello from div "])
                // }
                // this.updateState({isExpanded:true})
              }, 'data-translate' : 'View all'}, ['View all'])
            ]: []
          )
        ]
      )    
    },
    onMounted()
    {
    
      const {key} = this.props
      const endPoint = !key ?  `https://${window.env.IP}:3000/api/user/matches` :
      `https://${window.env.IP}:3000/api/user/matches?username=${key}`
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
              console.log("res is okey")
              this.updateState({
                      isLoading: false,  
                      data: res,   
                      error: null   
              });
  
          })
          // .catch(error => {
          //     // console.log(">>>>>>>>>>>> error in win  : ", error)
          // })
    }
  })
  const GameHistoryItems = defineComponent({
    state()
    {
      return {
      //  shownOnviewAll : false
      }
    },
    render()
    {
      const {isExpanded} = this.props
      const data = isExpanded ? this.props.data : this.props.data.slice(0,4)
      // console.log(">>>>>>>>>>>>> data  of matches history : ", data)
      return h('div', {class:'center-div', 
        style : isExpanded ?  {'row-gap' :'0%', 'grid-auto-rows': '16.7%'} : {}},
        data.map((item)=> h('div', { class: 'match-result-item',
           style : isExpanded ?  { width :'700px' , height: '75px'} : {}},
          [
            h('div', { class: 'picture-item' },
              [
                h('img', { src: `https://${window.env.IP}:3000${item.player1.picture}`, alt: 'profile picture' ,  style : {'object-fit': 'cover'}}),
                isExpanded ? h('span', {style : {color : '#A7A4A4', fontSize:'18px'}},
                [ `${item.player1.username}`]) : null
              ]
            ),
            h('div', { class: 'match-result' },
              [
                isExpanded ? hFragment([h('span', {style: {color: '#0B42AF', fontSize:'20px'}}, [`${item.created_at}`]), 
                h('br')]): null,
                h('span', { class: 'user-score', style: {color: `${item.player1_score < item.player2_score ? '#D44444' : '#0AA989'}`} },
                   [`${item.player1_score}`]),
                h('span', { style: {color: '#0B42AF'} }, ['-']),
                h('span', { class: 'opponent-score', style:{ color: `${item.player1_score < item.player2_score ? '#0AA989' : '#D44444'}`} },
                   [`${item.player2_score}`])
              ]
            ),
            h('div', { class: 'picture-item' },
              [
                isExpanded ? h('span', {style : {color : '#A7A4A4', fontSize:'18px'}}, [`${item.player2.username}`]) : null,
                h('img', { src: `https://${window.env.IP}:3000${item.player2.picture}`, alt: 'profile picture',  style : {'object-fit': 'cover'} }),
  
              ]
            )
          ]
        ))
      )
    }
  }) 
  