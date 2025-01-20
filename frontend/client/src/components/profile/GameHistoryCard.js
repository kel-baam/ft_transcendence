import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js' 

export const GameHistoryCard = defineComponent({
    state()
    {
      return {
        shownOnviewAll : false,
        data : [
          {
            player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : 'images/kjarmoum.png'}},
            player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : 'images/kjarmoum.png'}},
            player1_points:'1',
            player2_points:'2',
            date : '10-11-2024'
          },
          {
            player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : 'images/kjarmoum.png'}},
            player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : 'images/kjarmoum.png'}},
            player1_points:'1',
            player2_points:'2',
            date : '10-11-2024'
          },
          {
            player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : 'images/kjarmoum.png'}},
            player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : 'images/kjarmoum.png'}},
            player1_points:'1',
            player2_points:'2',
            date : '10-11-2024'
          },
          {
            player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : 'images/kjarmoum.png'}},
            player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : 'images/kjarmoum.png'}},
            player1_points:'1',
            player2_points:'2',
            date : '10-11-2024'
          },
          {
            player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : 'images/kjarmoum.png'}},
            player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : 'images/kjarmoum.png'}},
            player1_points:'1',
            player2_points:'2',
            date : '10-11-2024'
          },
          {
            player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : 'images/kjarmoum.png'}},
            player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : 'images/kjarmoum.png'}},
            player1_points:'1',
            player2_points:'2',
            date : '10-11-2024'
          },
          ,
          {
            player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : 'images/kjarmoum.png'}},
            player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : 'images/kjarmoum.png'}},
            player1_points:'1',
            player2_points:'2',
            date : '10-11-2024'
          },
          ,
          {
            player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : 'images/kjarmoum.png'}},
            player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : 'images/kjarmoum.png'}},
            player1_points:'1',
            player2_points:'2',
            date : '10-11-2024'
          },
          ,
          {
            player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : 'images/kjarmoum.png'}},
            player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : 'images/kjarmoum.png'}},
            player1_points:'1',
            player2_points:'2',
            date : '10-11-2024'
          },
          ,
          {
            player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : 'images/kjarmoum.png'}},
            player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : 'images/kjarmoum.png'}},
            player1_points:'1',
            player2_points:'2',
            date : '10-11-2024'
          },
          ,
          {
            player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : 'images/kjarmoum.png'}},
            player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : 'images/kjarmoum.png'}},
            player1_points:'1',
            player2_points:'2',
            date : '10-11-2024'
          },
          ,
          {
            player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : 'images/kjarmoum.png'}},
            player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : 'images/kjarmoum.png'}},
            player1_points:'1',
            player2_points:'2',
            date : '10-11-2024'
          },
          ,
          {
            player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : 'images/kjarmoum.png'}},
            player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : 'images/kjarmoum.png'}},
            player1_points:'1',
            player2_points:'2',
            date : '10-11-2024'
          },
          ,
          {
            player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : 'images/kjarmoum.png'}},
            player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : 'images/kjarmoum.png'}},
            player1_points:'1',
            player2_points:'2',
            date : '10-11-2024'
          },
          
        ]
      }
    },
    render()
    {
      if (this.props.viewAll)
      {
        // console.log(">>>>>>>>>>>>>>>>>> this.props.viewAll ", this.props.viewAll)
        this.state.shownOnviewAll = this.props.viewAll
      }
      return h('div', { class: 'match-history-container' , 
        style : this.state.shownOnviewAll ? {position :  'absolute', top : '17%', left: '30%',
          backgroundColor: '#161C40', width:'800px', height : '700px', 'grid-template-rows': '10% 80% 10%'
        } : {}},
        [
           h('div', { class: 'title-item', style : this.state.shownOnviewAll ? {justifyContent: 'space-between',paddingTop:'50px'}: {}},
            [
               h('span', {}, 
                [
                  h('h1', {style : this.state.shownOnviewAll ? {color : '#FFEEBF', paddingLeft:'300px'} : {}}, ['Match history'])
                ]
              ),this.state.shownOnviewAll ?
              h('i', { 
                class: 'fa fa-close', 
                style: {fontSize:'34px', color:'#D44444', 'border-radius':'5px', paddingRight:'50px', paddingBottom:'45px'},
                on : { click : () => this.emit('removeBlurProfile', {MatchHistory:false})}
              }): null
            ]
          ),
          h(GameHistoryItems, {data : this.state.data, shownOnviewAll : this.state.shownOnviewAll ? true : false})
          ,
            h('div', { class: 'view-all-match' },
            this.state.data.length >= 4  && !this.state.shownOnviewAll ? 
            [
              h('a', { on : {click : () => this.emit('blurProfile', {MatchHistory:true})}}, ['View all'])
            ]: []
          )
        ]
      )    
    }
  })
  const GameHistoryItems = defineComponent({
    state()
    {
      return {
       shownOnviewAll : false
      }
    },
    render()
    {
      // console.log( "----------------------------------> data in game history : ", this.props.data)
      this.state.shownOnviewAll = this.props.shownOnviewAll
      const data = this.state.shownOnviewAll ? this.props.data : this.props.data.slice(0,4)
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> this.state.shownOnviewAll  : ', this.state.shownOnviewAll )
      return h('div', {class:'center-div', 
        style : this.state.shownOnviewAll ?  {'row-gap' :'0%', 'grid-auto-rows': '16.7%'} : {}},
        data.map((item)=> h('div', { class: 'match-result-item',
           style : this.state.shownOnviewAll ?  { width :'700px' , height: '75px'} : {}},
          [
            h('div', { class: 'picture-item' },
              [
                h('img', { src: item.player1.image.src, alt: 'profile picture' }),
                this.state.shownOnviewAll ? h('span', {style : {color : '#A7A4A4', fontSize:'18px'}},
                 [ `${item.player1.username}`]) : null
              ]
            ),
            h('div', { class: 'match-result' },
              [
                this.state.shownOnviewAll ? hFragment([h('span', {style: {color: '#0B42AF', fontSize:'20px'}}, [`${item.date}`]), 
                h('br')]): null,
                h('span', { class: 'user-score', style: {color: `${item.player1_points < item.player2_points ? '#D44444' : '#0AA989'}`} },
                   [`${item.player1_points}`]),
                h('span', { style: {color: '#0B42AF'} }, ['-']),
                h('span', { class: 'opponent-score', style:{ color: `${item.player1_points < item.player2_points ? '#0AA989' : '#D44444'}`} },
                   [`${item.player2_points}`])
              ]
            ),
            h('div', { class: 'picture-item' },
              [
                this.state.shownOnviewAll ? h('span', {style : {color : '#A7A4A4', fontSize:'18px'}}, [`${item.player2.username}`]) : null,
                h('img', { src: item.player2.image.src, alt: 'profile picture' })
  
              ]
            )
          ]
        ))
      )
    }
  }) 
  