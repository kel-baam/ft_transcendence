import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

export const UserCard = defineComponent({
    state(){
        return {
            isLoading : false,
            data : {},
            // username : 'shicham',
            // image : {src : '../../assets/images/kel-baam.png'},
            // firstName : 'souad',
            // lastName : 'hicham',
            // score : '8',
            // Rank : '8' ,
            // level : '8.88',
            // achievement : {src : '../../assets/images/ach.png', name : 'Silver'}

        }
    },

    render(){
        // const {data, isLoading} = this.state
        // const {username , image, firstName, lastName, score, level, achievement} = data
        return  h('div', { class: 'infos-user-container' },
            [h('div', {},
            [ h('img', { src: '../assets/images/kel-baam.png' }),
                h('i', { class: 'fa-solid fa-camera', style: {color: '#5293CB'}  })]
            ),
            h('div', {},
            [ h('div', {},
                    [h('span', {},
                    [ h('h1', {}, ['souad' + ' '+ 'hicham'])]
                    )]
                ),
                h('div', {},
                [ h('form', {action :'/'}, 
                        [h('input', { type: 'text', value: 'shicham' })] )]
                
                ),
                h('div', {},
                    [h('div', {},
                        [h('span', {},[ '8.88' + '%']),
                        h('div', {},
                            [h('span', {}, ['level']),
                            h('progress', { max: '100', value: '80', style: {width: '593px' }, id: 'progress-level' })]
                        )]
                    ),
                    h('div', {},
                        [
                            h('div', {},
                                [
                                    h('span', {}, ['Rank : ']),
                                    h('span', { style: {color: '#0B42AF'} }, ['8'])
                                ]
                            ),
                            h('div', {},
                                [
                                    h('span', {}, ['Score : ']),
                                    h('span', { style: {color: '#0B42AF' }}, ['9'])
                                ]
                            ),
                            h('div', { style: {color: '#FBCA35',fontSize: '16px' }, class: 'achievement-item' },
                                [
                                    h('img', { src: '../assets/images/ach.png' }),
                                    h('span', {}, ['Silver'])
                                ]
                            )
                        ]
                    )
                ]
                )]
            )]
        )
    }
})
