import createElement from "../framework/createElement.js";
import render from "../framework/render.js";
import createDOMElement from "../framework/createDOMElement.js";



class leaderboard_main
{
    constructor() {
        this.state = [
            {
                "id": 1,
                "name": "Alice",
                "rank": 1,
                "score": 95,
                "level": 5
            },
            {
                "id": 2,
                "name": "Bob",
                "rank": 2,
                "score": 90,
                "level": 4
            },
            {
                "id": 3,
                "name": "Charlie",
                "rank": 3,
                "score": 85,
                "level": 4
            },
            {
              "id": 4,
              "name": "Diana",
              "rank": 4,
              "score": 80,
              "level": 3
            },
            {
                "id": 5,
                "name": "Edward",
                "rank": 5,
                "score": 75,
                "level": 3
            },
            {
                "id": 6,
                "name": "Fiona",
                "rank": 6,
                "score": 70,
                "level": 2
            },
            {
                "id": 7,
                "name": "George",
                "rank": 7,
                "score": 65,
                "level": 2
            },
            {
                "id": 8,
                "name": "Hannah",
                "rank": 8,
                "score": 60,
                "level": 1
            },
            {
                "id": 9,
                "name": "Ian",
                "rank": 9,
                "score": 55,
                "level": 1
            },
            {
                "id": 10,
                "name": "Julia",
                "rank": 10,
                "score": 50,
                "level": 1
            }
        ]
        this.render();
    }
    
   

    createPlayerEntry(rank, name, score, level, badgeSrc) {
        return createElement(
            "div", { className: "space" },
            createElement("div", {}, createElement("p", {}, rank)),
            createElement("div", {}, createElement("p", {}, name)),
            createElement("div", {}, createElement("p", {}, score)),
            createElement("div", {}, createElement("p", {}, level)),
            createElement("div", {}, createElement("img", { src: badgeSrc }))
        );
        }
        
    render()
    {
    //    return createElement("h1",{},"dddd")
       return  (createElement("div",{className:"home-content"},createElement("div", { className: "leaderboard-title" },
                createElement("h1", {}, "Leaderboard")),
                createElement("div", { className: "pics-rank" },
                createElement("div", { className: "first-place" },
                createElement("img", { className: "crown-pic", src: "./images/crown-removebg-preview.png" }),
                createElement("img", { className: "first-pic", src: "./images/kel-baam.png"}),
                createElement("h4", {}, "kel-baam")),
                createElement("div", { className: "second-third-place" },
                createElement("div", { className: "second-place" },
                createElement("img", { className: "second-symbol", src: "./images/second_1021187.png" }),
                createElement("img", { className: "second-pic", src: "./images/niboukha.jpeg" }),
                createElement("h4", {}, "niboukha")),
                createElement("div", { className: "third-place" },
                createElement("img", { className: "third-symbol", src: "./images/third.png" }),
                createElement("img", { className: "third-pic", src: "./images/niboukha.jpeg" }),
                createElement("h4", {}, "niboukha")))),
                //here players info
                createElement("div", { className: "rank-info" },
                createElement("div", { className: "players-info" },
                createElement("div", { className: "space first-row" },
                createElement("div", {}, createElement("p", {}, "Rank")),
                createElement("div", {}, createElement("p", {}, "Name")),
                createElement("div", {}, createElement("p", {}, "Score")),
                createElement("div", {}, createElement("p", {}, "Level")),
                createElement("div", {}, createElement("p", {}, "Badge"))),
                createElement("div", { className: "info" },
                this.createPlayerEntry("#1",this.state[0].name,this.state[0].rank,"5","./images/diamond.png"),
                this.createPlayerEntry("#2","niboukha","2500","4","./images/silver.png"),
                this.createPlayerEntry("#3","niboukha","2000","3","./images/silver.png"),
                this.createPlayerEntry("#4","kjarmoum","1500","2","./images/gold.png"),
                this.createPlayerEntry("#5","shicham","500","1","./images/gold.png")
                )))
        ))
    }
  }

  export default leaderboard_main