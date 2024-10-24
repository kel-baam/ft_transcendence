import createElement from "../framework/createElement.js";

class MatchHistory 
{
    constructor(props)
    {
        this.props = props
        Object.keys(this.props).map(key =>
        {
          this.props[key].player1.user.picture = {
            imgSrc: '../../assets/images/kjarmoum.png',
            alt: 'profile picture'
          }
          this.props[key].player2.user.picture = {
            imgSrc: '../../assets/images/shicham.png',
            alt: 'profile picture'
          }
        }
        )
    }

    MatchItem({id, player1, player2, player1_points, player2_points})
    {
      return createElement('div', { className: 'match-result-item' },
        createElement('div', { className: 'picture-item' },
          createElement('img', { src: player1.user.picture.imgSrc, alt: 'profile picture' })
        ),
        createElement('div', { className: 'match-result' },
          createElement('span', { className: 'user-score', style: `color: ${player1_points < player2_points ? '#D44444;' : '#0AA989;'}` }, `${player1_points}`),
          createElement('span', { style: 'color: #0B42AF;' }, '-'),
          createElement('span', { className: 'opponent-score', style: `color: ${player2_points < player1_points ? '#D44444;' : '#0AA989;'}` }, `${player2_points}`)
        ),
        createElement('div', { className: 'picture-item' },
          createElement('img', { src: player2.user.picture.imgSrc, alt: 'profile picture' })
        )
      )
    }
    render()
    {
        return createElement('div', { className: 'match-history-container' },
            createElement('div', { className: 'title-item' },
              createElement('span', {},
                createElement('h1', {}, 'Match history')
              )
            ),
            createElement('div', { className: 'center-div' },
              ...Object.keys(this.props).slice(0,4).map(key =>{
                const item = this.MatchItem(this.props[key])
                return item
              }
              )
            ),
            Object.keys(this.props) > 4 ?
            createElement('div', { className: 'view-all-match' },
              createElement('a', { href: '#' }, 'View all')
            ) : {}
          );
    }

    addEventListeners()
    {

    }
}
export default MatchHistory