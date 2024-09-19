
import createElement from "../framework/createElement.js";
import createDOMElement from "../framework/createDOMElement.js";
import render from "../framework/render.js"
import landingPageHeader from "../components/landingPageheader.js"
import aboutUs from  "../components/aboutUs.js"
import Footer  from "../components/footer.js";
import Team from "../components/teamSection.js";
import { diff , patch} from "../framework/diff.js";

class LandingPage{


    constructor()
    {
        this.root = document.body;
        this.render()
    }
    render()
    {   
        this.creatLandingPage()
    }

    creatLandingPage()
    {
        const vdom =  createElement("div",{id:"all"},createElement("div",{id:"landing-login"},
                    createElement(landingPageHeader,{}),
                    createElement(aboutUs,{}),
                    createElement(Team,{}),
                    createElement(Footer,{}),
                )
        );

        const container = document.body;
        const patches = diff(container.__vdom, vdom, container);
        patch(document.body, patches);
        container.__vdom = vdom;
    }
}

// window.customElements.define('my-landing', landingPage);

export default LandingPage




















/* <div id="landing-header">
    <nav class="landing-nav">
        <img class="logo" src="assets/images/logo.png" alt="logo">
        <ul class="nav-links">
            <li><a href="#header-intro" class="navLink">Home</a></li>
            <li><a href="#about-section" class="navLink">About</a></li>
            <li><a href="#team-section" class="navLink">Our Team</a></li>
            <a href="login" class="btn" class="navLink"><button type="button">Join Now</button></a>
            <!-- change to button -->
        </ul>
    </nav>
    <div id="header-intro">
        <div class="intro">
            <h1>Dive into our<br>&nbsp&nbsp&nbsp<span>ping pong</span><br>&nbsp&nbsp&nbspuniverse!</h1>
            <p>Welcom to your ultimate ping pong playground! Get ready to smash your way to victory.<br> 
                Whether you're a seasoned player or just starting out, let's bounce into action together.<br> 
            </p>
            <div class="join-btn">
               <a href="login" class="btn"> <button type="button" >Join Now</button></a>
            </div>
        </div>
        <img src="assets/images/player1.png" alt="player-pic" >
    </div>
</div>
<!-- ---------ABOUT SECTION------->
<div id="about-section">
    <h2>ABOUT US</h2>
    <div class="about">
        <div class="glass-cart">
            <div class="about-text">
                <p>Welcome to our website, we Designed this website as a final project for our<br>  
                    school 1337, where the excitement of ping pong meets a vibrant community<br> 
                    experience.Dive into thrilling matches, connect with fellow players through <br> 
                    dynamic chatroom, and track your achievements as you climb the leader-board. <br>
                    Whether you're a seasoned competitor or new to the game,our website<br>
                    is your go-to destination for enjoying and improving your ping pong skills<br>
                    in a friendly and competitive atmosphere. Join us today and discover<br>  
                    the thrill of ping pong like never before!"</p>
            </div>
            <img src="assets/images/aboutPic.png">
        </div>
    </div>
</div>
<!-- -------TEAM SECTION----------- -->
<div id="team-section">
    <div class="team-title">
        <h2>The team <span><br>behind the magic</span></h2>
        <p>Our developers work tirelessly to bring the ping pong website to life,<br> 
            ensuring every user enjoys a seamless and unforgettable experience. <br>
            Meet the team behind the magic!</p>
    </div>
    <div class="team-pics">
        <div class="card">
            <div class="pic">
                <img src="assets/images/pic.jpg">
            </div>
            <div class="content-card">
                <div class="contentBx">
                    <h3>kaoutar el baamrani<br><span>software engineer</span></h3>
                </div>
                    <ul class="box-icon">
                        <li style="--i: 1">
                            <a href="https://github.com/kel-baam"><i class="fa-brands fa-github"></i></a>
                        </li>
                        <li style="--i: 2">
                            <a href="www.linkedin.com/in/kaoutar-el-baamrani-a99235271"><i class="fa-brands fa-linkedin-in"></i></a>
                        </li>
                        <li style="--i: 3">
                            <a href="mailto:kaoutarelbaamrani@gmail.com"><i class="fa-solid fa-envelope"></i></a>
                        </li>
                    </ul>
            </div>
        </div>
        <div class="card">
            <div class="pic">
                <img src="assets/images/pic2.jpg">
            </div>
            <div class="content-card">
                <div class="contentBx">
                    <h3>nisren boukhari<br><span>software engineer</span></h3>
                </div>
                    <ul class="box-icon">
                        <li style="--i: 1">
                            <a href="https://github.com/niboukha"><i class="fa-brands fa-github"></i></a>
                        </li>
                        <li style="--i: 2">
                            <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
                        </li>
                        <li style="--i: 3">
                            <a href="mailto:nisrinboukhari19@gmail.com"><i class="fa-solid fa-envelope"></i></a>
                        </li>
                    </ul>
            </div>
        </div>
        <div class="card">
            <div class="pic">
                <img src="assets/images/pic3.png">
            </div>
            <div class="content-card">
                <div class="contentBx">
                    <h3>karima jarmoumi<br><span>software engineer</span></h3>
                </div>
                    <ul class="box-icon">
                        <li style="--i: 1">
                            <a href="https://github.com/karimajarmoumi"><i class="fa-brands fa-github"></i></a>
                        </li>
                        <li style="--i: 2">
                            <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
                        </li>
                        <li style="--i: 3">
                            <a href="#"><i class="fa-solid fa-envelope"></i></a>
                        </li>
                    </ul>
            </div><div id="content">
    
            </div>
        </div>
        <div class="card">
            <div class="pic">
                <img src="assets/images/pic.jpg">
            </div>
            <div class="content-card">
                <div class="contentBx">
                    <h3>souad hisham<br><span>software engineer</span></h3>
                </div>
                    <ul class="box-icon">
                        <li style="--i: 1">
                            <a href="https://github.com/s-hicham"><i class="fa-brands fa-github"></i></a>
                        </li>
                        <li style="--i: 2">
                            <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
                        </li>
                        <li style="--i: 3">
                            <a href="#"><i class="fa-solid fa-envelope"></i></a>
                        </li>
                    </ul>
            </div>
        </div>
    </div>
</div>

<div id="footer-section">
    <div class="footer-media">
        <ul>
            <div class="media-bg">
                <li>
                    <a href="https://github.com/kel-baam"><i class="fa-brands fa-github"></i></a>
                </li>
            </div>
            <div class="media-bg">
                <li>
                    <a href="www.linkedin.com/in/kaoutar-el-baamrani-a99235271"><i class="fa-brands fa-linkedin-in"></i></a>
                </li>
            </div>
            <div class="media-bg">
                <li>
                    <a  href="mailto:kaoutarelbaamrani@gmail.com"><i class="fa-solid fa-envelope"></i></a>
                </li>
        </div>
        </ul>
    </div>
    <div class="footer-services">
        <ul>
            <li><a href="#header">Home</a></li>
            <li><a href="#about-section">About us</a></li>
            <li><a href="##team-section">Our Team</a></li>
            <li><a href="#" >Join us</a></li>
        </ul>
    </div>
    <div class="footer-copy-right">
        <p>Copyright &copy;2024 Designed by 1337 students (power girls team)</p>
    </div>
</div> */