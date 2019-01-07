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

// Function For Giving Cards To Two Parameters (the combs that will hold the card,the div element that will append the image cards)
function giveCards(cardscombs,divElement,isGround)
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
            cardscombs[i] = __card;
        }
    }
    else            // Give Any One Else The Cards
    {
        for(i=0;i<4;i++)
        {
            cardscombs[i] = deck_cards.pop();
        }
    }
    for(i=0;i<cardscombs.length;i++)
    {
        var cur_image = document.createElement('img');
        cur_image.className = "img-s";
        cur_image.src = cardscombs[i].src;
        cur_image.alt = cardscombs[i].value;
        cur_image.id  = cardscombs[i].id;
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
            play2(com_cards_arr,computer_score);
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
            this.removeEventListener('click', arguments.callee);
            play2(pl_cards_arr,player_score);
            turn++;
            //$(computer_cards).children().eq(0).trigger("change ", [ "Event" ]);
            setTimeout(function(){_imagesC[0].dispatchEvent(event);},1000);

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
            // Empyt the ground combs
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
                // Remove From Ground combs
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
        
        // If The combs Has Values
        if(secondArr.length)
        {
             match_at_least_once = 1;
 /*           var Test_arr = [];
            //Fill The Test combs With The Sum Of The Two Values
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
            
            // Delete The Cards From Ground And combs According To Second combs
            for(i=0;i<secondArr.length;i++)
            {     //if the length of the ground combs equal zero this is pasra
                if(gr_cards_arr.length==2){__score.score+=10;}
                //for
                //Remove From Ground DIV
                $("#"+gr_cards_arr[secondArr[i][0]].id).remove();
                $("#"+gr_cards_arr[secondArr[i][1]].id).remove();
                //ground_cards.removeChild(document.getElementById(gr_cards_arr[secondArr[i]].id));
                //ground_cards.removeChild(document.getElementById(gr_cards_arr[secondArr[i][1]].id));
                //Remove From Ground combs
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
        //Remove The Element From Player combs
        
        
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


function k_combinations(set, k) {
	var i, j, combs, head, tailcombs;
	
	// There is no way to take e.g. sets of 5 elements from
	// a set of 4.
	if (k > set.length || k <= 0) {
		return [];
	}
	
	// K-sized set has only one K-sized subset.
	if (k == set.length) {
		return [set];
	}
	
	// There is N 1-sized subsets in a N-sized set.
	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}
	
	// Assert {1 < k < set.length}
	
	// Algorithm description:
	// To get k-combinations of a set, we want to join each element
	// with all (k-1)-combinations of the other elements. The set of
	// these k-sized sets would be the desired result. However, as we
	// represent sets with lists, we need to take duplicates into
	// account. To avoid producing duplicates and also unnecessary
	// computing, we use the following approach: each element i
	// divides the list into three: the preceding elements, the
	// current element i, and the subsequent elements. For the first
	// element, the list of preceding elements is empty. For element i,
	// we compute the (k-1)-computations of the subsequent elements,
	// join each with the element i, and store the joined to the set of
	// computed k-combinations. We do not need to take the preceding
	// elements into account, because they have already been the i:th
	// element so they are already computed and stored. When the length
	// of the subsequent list drops below (k-1), we cannot find any
	// (k-1)-combs, hence the upper limit for the iteration:
	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		// head is a list that includes only our current element.
		head = set.slice(i, i + 1);
		// We take smaller combinations from the subsequent elements
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		// For each (k-1)-combination we join it with the current
		// and store it to the set of k-combinations.
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}


/**
 * Combinations
 * 
 * Get all possible combinations of elements in a set.
 * 
 * Usage:
 *   combinations(set)
 * 
 * Examples:
 * 
 *   combinations([1, 2, 3])
 *   -> [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
 * 
 *   combinations([1])
 *   -> [[1]]
 */
function combinations(set) {
	var k, i, combs, k_combs;
	combs = [];
	
	// Calculate all non-empty k-combinations
	for (k = 1; k <= set.length; k++) {
		k_combs = k_combinations(set, k);
		for (i = 0; i < k_combs.length; i++) {
			combs.push(k_combs[i]);
		}
	}
	return combs;
}

function cVal(combs)
{
    combIndex=[];
    var element=[];
    var sum=0;
    //getting all possible sum cases
    for (let i = 0; i < combs.length; i++) {
        // first check if the combination array has a 1-D array
        if(combs[i].length>1){
        for (let j = 0; j < combs[i].length;j++) {
            // if the card is not a number take it as string
            if(isNaN(combs[i][j].value))
            {   
                sum+=combs[i][j].value;
            }
            // if it's a number , parse and sum
            else{
                sum+=parseInt(combs[i][j].value);
            }
            
            
        }
        element[i] = sum;
        sum=0; 
    }
    // if it has n-D Array
    else{
        if (isNaN(combs[i][0].value)) {
            element[i]=combs[i][0].value;
        } 
        else
            {
                element[i]=parseInt(combs[i][0].value);

            }
        }
       

    }


    return element;
}


function play2(player_array,__score)
{
     selectedIndex=[];
    var _selected=[];
    var selected_Id=[];
     selected=[];
    var  match_at_least_once = 0;
    var combs=[];
    var _card=event.target;
    console.log(_card.alt);
    combs=combinations(gr_cards_arr);
    console.log(combs);
    var sums=cVal(combs);
    console.log(sums);
     if (_card.alt == "jack" || _card.alt == "kommy") //If The Card Is Jack Or Kommy
    {
        if (gr_cards_arr.length) {
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
    { //check if any ground card matches the clicked
        //create index array
        selectedIndex=createIndexArr(gr_cards_arr);
        for (let i = 0; i < sums.length; i++) {
            if (sums[i] == _card.alt) {
                console.log(combs[i]);
                selected.push(combs[i]); //2-D array
                console.log(selected);
                _selected.push(selectedIndex[i]);
                
            }
            
 
           
        }
        console.log("selected"+selected.value);
        console.log(_selected)
        if(selected.length)
        {
            match_at_least_once = 1;

        }
        console.log(selected)
        for (let i = 0; i < selected.length; i++) {
            // if multiple cards to collect
            if (selected[i].length > 1) {
                for (let j = 0; j < selected[i].length; j++) {
                    //selected_Id.push(selected[i][j].id);
                    var id=selected[i][j].id;
                    //remove from ground div
                    $("#"+id).remove();
                    //remove from ground arr
                    gr_cards_arr.splice(_selected[i][0],1);
                    //Increase Score
                    __score.score += 1;
                    __score.div_element.innerText = __score.score;
                }
            }// if it's only one card to collect
            else{
                    var id=selected[i][0].id;
                    //remove from ground div
                    $("#"+id).remove();
                    //remove from ground arr
                    gr_cards_arr.splice(_selected[i][0],1);
                    __score.score += 1;
                    __score.div_element.innerText = __score.score;
                }
            }
        }
        if(match_at_least_once)
        {
            console.log("match")
            $(event.target).remove();
            for(var i=0;i<player_array.length;i++)
            {
                if(_card.id==player_array[i].id)
                {
                    var handIndex=i;
                }
            }
            player_array.splice(handIndex,1);
        }
        else
        {
            console.log("eleseeeeeeee")
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


/*    for (let i = 0; i < combs.length; i++) {
        // first check if the combination array has a 1-D array
        if (combs[i].length > 1) {
            for (let j = 0; j < combs[i].length; j++) {
                // if the card is not a number take it as string
                elements.push(combs[i][j]);
            }
        }
        // if it has n-D Array
        else {
                elements.push(combs[i][0]);
        }

    }
    console.log(elements); */

function createIndexArr(myArr)
{
    var retArr=[];
    for (let i = 0; i < myArr.length; i++) {
       retArr.push(i);
    }
    return combinations(retArr);
}