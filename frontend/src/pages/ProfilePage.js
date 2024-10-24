import createElement from "../framework/createElement.js";
import UserProfile from "../components/UserProfile.js";
import WinningRate from "../components/WiningRate.js";
import Achievement from "../components/Achievement.js";
import MatchHistory from "../components/MatchHistory.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import { diff , patch} from "../framework/diff.js";
import FriendsCard from "../components/friendsCard.js"
import pendingCard from "../components/pendingCard.js"
import RequestsCard from "../components/requestsCard.js"

const VIEW_STATES = {
    PENDING: 'PENDING',
    FRIENDS: 'FRIENDS',
    REQUESTS: 'REQUESTS',
};
class Profile 
{
    
    constructor()
    {
        console.log("----> is profile constr the component")
        this.items = {};
        this.state = {
            currentView : VIEW_STATES.FRIENDS
        }
        this.root = document.body;
        this.fetchData() 
    }
    
    async fetchData()
    {
        try {
                const response = await fetch('http://127.0.0.1:8000/users/shicham'); // Replace with your API URL
                // console.log("-------> response  : ", response)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // else if (response.status == '404')
                //     console.log("-------> yeeeees ")
                this.items = await response.json();
                // console.log(">>>>>>>>>>> items ,", this.items)
                // console.log("---> items keys : ", Object.keys(this.items))
                // console.log("----------> user : ", this.items.user)
                this.render()
                this.addEventListeners()
        } catch (error) {
                    console.error('Fetch error:', error);
            }
    }

    currentViewCard()
    {
        switch(this.state.currentView)
        {
            case 'FRIENDS':
                return createElement(FriendsCard, {...this.items.friends})
            case 'PENDING':
                return createElement(pendingCard, {...this.items.pending})
            case 'REQUESTS':
                return createElement(RequestsCard, {...this.items.requests}) 
        }
    }

    render()
    {
        const vdom = createElement('div', {id:'global'}, 
            createElement(Header, {}), createElement('div', { className: 'content' },
                createElement(Sidebar, {}), createElement('div', {className:'global-content'},
                    createElement('div', {className:'profile-content'},
                        createElement('div', {className:'profile-info'}, 
                        createElement('div', {className:'infos'}, createElement(UserProfile, {user : this.items.user.user, 
                            level : this.items.user.level, score:this.items.user.score, Rank:this.items.user.Rank}), 
                        createElement(WinningRate, {total_matches : this.items.total_matches, wins:this.items.wins, 
                            losses:this.items.losses, draws:this.items.draws})), 
                        createElement('div', {className:'other-cards'}, createElement(Achievement, {}), 
                        this.currentViewCard(), createElement(MatchHistory, {...this.items.matches_history}))))
                        ,createElement('div', { className: 'friends-bar' }))
            ))
            // console.log(">>>>>>>>>>>>>>>>>>>>> vdom : ", vdom)
            const container = document.body;
            const patches = diff(container.__vdom, vdom, 0);
            // console.log(">>>>>>>>> patches in profile :", patches)
            patch(document.body, patches);
            container.__vdom = vdom;
            this.drawWinningCircle()
    }

    drawWinningCircle() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const percentage = 50; 
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const endAngle = (Math.PI * 2) * (percentage / 100);
        this.drawCircle('#ddd',endAngle , (Math.PI * 2), canvas);

        this.drawCircle('#0AA989', 0, endAngle, canvas);

        this.drawPercentageText(canvas);

        }
        drawCircle(color, startAngle, endAngle, canvas) {
            const ctx = canvas.getContext('2d');
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 82;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineWidth = 8;
            ctx.strokeStyle = color;
            ctx.stroke();
        }
        drawPercentageText(canvas) {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const percentage = 50;
        ctx.font = '26px "myFont"';
        ctx.fillStyle = '#0AA989'; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${percentage}%`, centerX, centerY);
    }
   
    setState(newState) {
        this.state = { ...this.state, ...newState };
        // console.log("------------> this.state ", this.state)
        this.render(); 
    }

    addEventListeners()
    {
       
        const buttonPd = document.getElementsByClassName('pending-button')[0]
        // if (buttonPd)
        // {
            buttonPd.addEventListener('any', (event) => {
            // console.log("------> eventTarget", event.target)
            // console.log("------> here event dispatcher")
            this.setState({ currentView :  VIEW_STATES.PENDING});
            })
        // }
        const buttonFr = document.getElementsByClassName('friends-button')[0]
        // if (buttonFr)
        // {
            buttonFr.addEventListener('any', (event) => {
            // console.log("------> eventTarget", event.target)
            // console.log("------> here event dispatcher")
            this.setState({ currentView :  VIEW_STATES.FRIENDS});
            })
        // }
        const buttonRq = document.getElementsByClassName('request-button')[0]
        // if (buttonRq)
        // {
            buttonRq.addEventListener('any', (event) => {
                // console.log("------> eventTarget", event.target)
                // console.log("------> here event dispatcher")
                this.setState({ currentView :  VIEW_STATES.REQUESTS});
            })
        // }
        const winBtn = document.getElementsByClassName('win-button')[0]
            const eventName = new CustomEvent('win-rate')
        winBtn.dispatchEvent(eventName)
        winBtn.addEventListener('win-rate', ()=>{
            // console.log("------------------------> " , event.target )
            winBtn.style =' background-color: #ddd';
            this.drawWinningCircle()

        })
    }


}

export default Profile;
