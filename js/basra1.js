/// <reference path="../typings/globals/jquery/index.d.ts" />
// Variable Declerations
var turn=0;
var computer_cards  = document.getElementById('coImg');
var ground_cards    = document.getElementById('ground');
var player_cards    = document.getElementById('player');
var com_cards_arr   = new Array();
var gr_cards_arr    = new Array();
var pl_cards_arr    = new Array();
var deck_cards      = new Array();
var player_score = {
    score:0,
    div_element:document.getElementById('playerScore')
};
var computer_score = {
    score:0,
    div_element:document.getElementById('compScore')
};

//Class Declerations

class myCard{
    constructor(_name)
    {
        this.src="./images/"+_name+".png";
        
        this.id=parseInt(Math.random().toFixed(4).toString().split(".")[1]);
        if(this.src == "./images/7_of_diamonds.png")
        {
           this.value="kommy";
        }
        else
        {
           this.value=_name.split("_")[0];
        }
    }
}

// Events
document.getElementById('myBtn').addEventListener('click',startGame);


// Onload Create Deck
document.body.onload = function(){createDeck();};

// Custom Events


// Create Deck
function createDeck()
{
    var value=[1,2,3,4,5,6,7,8,9,10,"king","jack","queen"];
    var suit=["clubs","diamonds","hearts","spades"];
    
    for(i=0;i<value.length;i++)
    {
        for(j=0;j<suit.length;j++)
        {
            deck_cards.push(new myCard(value[i]+"_of_"+suit[j]));
        }
    }
    // Shuffle The Deck
    deck_cards = deck_cards.sort(function (a,b){return a.id-b.id;});
}

// Function For Giving Cards To Two Parameters (the array that will hold the card,the div element that will append the image cards)
function giveCards(cardsArray,divElement,isGround)
{
    if(isGround)    // Give The Ground The Cards
    {
        for(i=0;i<4;i++)
        {
            var __card = deck_cards.pop();
            while(__card.value == "jack" || __card.value == "kommy")//satr 69////////////////////////////////////////////////////////////////////
            {
                deck_cards.splice((deck_cards.length/2),0,__card);
                __card = deck_cards.pop();
            }
            cardsArray[i] = __card;
        }
    }
    else            // Give Any One Else The Cards
    {
        for(i=0;i<4;i++)
        {
            cardsArray[i] = deck_cards.pop();
        }
    }
    for(i=0;i<cardsArray.length;i++)
    {
        var cur_image = document.createElement('img');
        cur_image.className = "img-s";
        cur_image.src = cardsArray[i].src;
        cur_image.alt = cardsArray[i].value;
        cur_image.id  = cardsArray[i].id;
        divElement.appendChild(cur_image);
    }
}

// Function To Set The Event For Player Cards
function setTheEvent()
{
    var _images = player_cards.getElementsByTagName('img');
    var _imagesC= computer_cards.getElementsByTagName('img');
    var event = new Event('build');

    // Listen for the event.

    // Dispatch the event.
    for(var j=0;j<_imagesC.length;j++)
    {
        _imagesC[j].addEventListener('build', function () { 
            play(com_cards_arr,computer_score);
            if(turn==4 && (deck_cards.length || deck_cards.length>8))
            {
                newRound();
                turn=0;

            }
            else{
                if(computer_score.score>player_score.score &&!(deck_cards.length) &&!(pl_cards_arr))
                {
                    alert("you lose");
                }
                if(computer_score.score<player_score.score &&!(deck_cards.length)){
                    alert("you win");
                }
            }
         }, false);

    }
    
    for(i=0;i<_images.length;i++)
    {
        _images[i].addEventListener('click',function (){
            play(pl_cards_arr,player_score);
            turn++;
            //$(computer_cards).children().eq(0).trigger("change ", [ "Event" ]);
            _imagesC[0].dispatchEvent(event);

        });   
    }

    
    /*     $(computer_cards).children().on("change ",function () { 
            play(com_cards_arr,computer_score);
            if(turn==4 && deck_cards.length)
            {
                newRound();

            }
            else{
                if(computer_score.score>player_score.score &&!(deck_cards.length))
                {
                    alert("you lose");
                }
                if(computer_score.score<player_score.score &&!(deck_cards.length)){
                    alert("you win");
                }
            }
         }); */
    
}
  
// Function For Playing 
function play(player_array,__score)
{
    var match_at_least_once = 0;
    var _card = event.target;
    console.log(_card.alt);
    if (_card.alt == "jack" || _card.alt == "kommy") //If The Card Is Jack Or Kommy
    {
        if (gr_cards_arr) {
            match_at_least_once = 1;
            // Empty the ground DIV
            ground_cards.innerHTML = "";
            // Calculate the score
            __score.score = parseInt(__score.score) + gr_cards_arr.length;
            __score.div_element.innerText = __score.score;
            // Empyt the ground ARRAY
            gr_cards_arr = [];
        }
    }
    else
    {
        //Take Every Single Card On The Ground
        for(i=0;i<gr_cards_arr.length;i++)
        {
            if(_card.alt == gr_cards_arr[i].value)
            {
                match_at_least_once = 1;
                // Remove From ground DIV
                ground_cards.removeChild(document.getElementById(gr_cards_arr[i].id));
                // Remove From Ground ARRAY
                gr_cards_arr.splice(i,1);
                // Increse The Score With One
                __score.score++;
                __score.div_element.innerText = __score.score;
                i--;
            }
        }
        /* var */ secondArr = [];
        //Take The Doubled Card
        for(i=0;i<gr_cards_arr.length-1;i++)
        {
            for(j=i;j<gr_cards_arr.length;j++)
            {
                if(i!=j)
                {
                    if(parseInt(gr_cards_arr[i].value) + parseInt(gr_cards_arr[j].value) == _card.alt)
                    {
                        secondArr[secondArr.length] = [i,j];
                    }
                }
            }
        }
        
        // If The Array Has Values
        if(secondArr.length)
        {
             match_at_least_once = 1;
 /*           var Test_arr = [];
            //Fill The Test Array With The Sum Of The Two Values
            for(i=0;i<secondArr.length;i++)
            {
                Test_arr.push(secondArr[i][0]+secondArr[i][1]);
            }
            
            //Cut If There Are Two Values With The Same Value
            for(i=0;i<Test_arr.length;i++)
            {
                for(j=0;j<Test_arr.length;j++)
                {
                    if(i != j)
                    {
                        if(Test_arr[i] == Test_arr[j])
                        {
                            Test_arr.splice(j,1);
                            secondArr.splice(j,1);
                            j--;
                        }
                    }                    
                }                                
            } */
            
            // Delete The Cards From Ground And Array According To Second Array
            for(i=0;i<secondArr.length;i++)
            {     //if the length of the ground array equal zero this is pasra
                if(gr_cards_arr.length==2){__score.score+=10;}
                //for
                //Remove From Ground DIV
                $("#"+gr_cards_arr[secondArr[i][0]].id).remove();
                $("#"+gr_cards_arr[secondArr[i][1]].id).remove();
                //ground_cards.removeChild(document.getElementById(gr_cards_arr[secondArr[i]].id));
                //ground_cards.removeChild(document.getElementById(gr_cards_arr[secondArr[i][1]].id));
                //Remove From Ground ARRAY
                gr_cards_arr.splice(secondArr[i][0],1);
                gr_cards_arr.splice((secondArr[i][1])-1,1);
                //Increase Score
                __score.score += 2;
                __score.div_element.innerText = __score.score;
            }
        }
        
        //The Three Values
    }
    
    
    
    
    
    if(match_at_least_once)
    {
        
        
        //var inp;
        //Remove The Element From Player DIV
        //console.log(event.target);
        $(event.target).remove();
        for(var i=0;i<player_array.length;i++)
        {
            if(_card.id==player_array[i].id)
            {
                var handIndex=i;
            }
        }
        player_array.splice(handIndex,1);
        var ele = document.getElementById(event.target.id);
        /*var parent = ele.parentNode;
        inp = parent.index(ele);*/
        //var i = 0;
/*         while( (ele = ele.previousSibling) != null ) 
            i++;
        console.log(i); */
        //parent.removeChild(document.getElementById(event.target.id));

        //player_array,__score,
        //Remove The Element From Player ARRAY
        
        
        //Increase The Score
        
    }
    else{
        $("#ground").append(event.target);
        for(var i=0;i<player_array.length;i++)
        {
            if(_card.id==player_array[i].id)
            {
                var nCard=player_array[i];
                var handIndex=i;
            }
        }
        gr_cards_arr.push(nCard);
        player_array.splice(handIndex,1);
    }
}
// Function For Start The Game
function startGame()
{
    giveCards(gr_cards_arr,ground_cards,true);
    giveCards(pl_cards_arr,player_cards);
    giveCards(com_cards_arr,computer_cards);
    setTheEvent();
    //document.getElementById('myBtn').style.display = "none";
    $("#myBtn").remove();
}


//function for the new round
function newRound()
{
    giveCards(pl_cards_arr,player_cards);
    giveCards(com_cards_arr,computer_cards);
    setTheEvent();
}