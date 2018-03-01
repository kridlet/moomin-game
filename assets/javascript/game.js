// the game object
var game = {
    // initialize variables
    turns: 1,
    giverSelected: 0,
    receiverSelected: 0,
    started: 0,
    // the characters and attributes
    character: {
        moominpapa: {
            currentAngst: 120,
            currentComfortStrength: 8,
            reciprocateStrength: 10,
            comfortStrengthIncrease: 8,
            name: 'Moomin Pappa',
            description: 'Boyish and adventurous. He likes to be present when something unusual happens. He is philosophical at times and likes writing his memoirs.',
            imageLocation: 'assets/images/moominpappa-main.png',
            inMoominValley: 0,
            currentGiver: 0
        },
        littlemy: {
            currentAngst: 180,
            currentComfortStrength: 2,
            reciprocateStrength: 25,
            comfortStrengthIncrease: 2,
            name: 'Little My',
            description: 'A mischievous little girl with a brave, spunky personality. She likes adventure, but loves catastrophes, and often does mean things on purpose. She finds messiness and untidiness exciting.',
            imageLocation: 'assets/images/little-my-main.png',
            inMoominValley: 0,
            currentGiver: 0
        },
        sniff: {
            currentAngst: 100,
            currentComfortStrength: 12,
            reciprocateStrength: 5,
            comfortStrengthIncrease: 12,
            name: 'Sniff',
            description: 'He likes to take part in everything, but is afraid to do anything dangerous. Sniff appreciates all valuables and makes many plans to get rich, but does not succeed.',
            imageLocation: 'assets/images/sniff-main.png',
            inMoominValley: 0,
            currentGiver: 0
        },
        snufkin: {
            currentAngst: 150,
            currentComfortStrength: 4,
            reciprocateStrength: 20,
            comfortStrengthIncrease: 4,
            name: 'Snufkin',
            description: 'A lonesome philosophical traveller, who likes to play the harmonica and wanders around the world with only a few things, so as not to make his life complicated. He is carefree, calm, and fearless.',
            imageLocation: 'assets/images/snufkin-main.png',
            inMoominValley: 0,
            currentGiver: 0
        }
    },

    reinitializeCharacters: function (character, angst, comfort) {
        character.currentAngst = angst;
        character.currentComfortStrength = comfort;
        character.inMoominValley = 0;
        character.currentGiver = 0;
    },

    // function to increament giver somfort strength and remove both giver and receiver angst
    comfort: function (giver, receiver) {
        giver.currentComfortStrength = giver.comfortStrengthIncrease * this.turns;
        receiver.currentAngst = receiver.currentAngst - giver.currentComfortStrength;
        if (receiver.currentAngst > 0) {
            giver.currentAngst = giver.currentAngst - receiver.reciprocateStrength;
        }
        // record the the new levels to the user screen
        this.updateStatus("giver", giver.currentAngst, giver.currentComfortStrength);
        this.updateStatus("receiver", receiver.currentAngst, receiver.currentComfortStrength);
        this.turns++;
        // if the giver looses all their angst
        if (giver.currentAngst < 1) {
            // the game is over
            this.resetGame("lose");
        }
        // if the receivers loses all their angst
        if (receiver.currentAngst < 1) {
            // remove the receiver character from the board
            $("#give-comfort").hide();
            $("#receiver").hide(600);
            // instruct the user to select a new receiver
            $("#instruct").html("Choose a comfort receiver.");
            $("#instruct").show();
            // send the character to moomin valley, angst free
            receiver.inMoominValley = 1;
            // see if more characters are available
            for (var i in this.character) {
                // if there are character not in moomin valley, and not the giver of comfort, continue playing 
                if (this.character[i].inMoominValley === 0 && this.character[i].currentGiver === 0) { 
                    this.receiverSelected = 0;
                }
            }
            // if there are no more characters available, then the user has won!
            if (this.receiverSelected === 1) {
                this.resetGame("win");
            }
        }
    },

    // send the updated stats to the screen
    updateStatus: function (character, angst, strength) {
        if (character === "giver") {
            $("#giver-angst").text(angst);
            $("#giver-comfort").text(strength);
        } else {
            $("#receiver-angst").text(angst);
            $("#receiver-comfort").text(strength);
        }
    },

    // reset the game and play again
    resetGame: function (status) {
        // reset started bit
        this.started = 0;
        this.giverSelected = 0;
        this.receiverSelected = 0;
        // hide all the junk on the screen
        $("#instruct").hide();
        $("#give-comfort").hide();
        $("#receiver").hide();
        $("#giver").hide();
        $("#available-characters").hide();
        $(".removable").remove();
        // reintialize the characters status
        this.reinitializeCharacters(this.character.moominpapa,120,8);
        this.reinitializeCharacters(this.character.littlemy,180,2);
        this.reinitializeCharacters(this.character.sniff,100,12);
        this.reinitializeCharacters(this.character.snufkin,150,4);
        this.turns = 1;
        // add the characters back to the screen
        this.addCharacters();
        // set the modal message
        if (status === "win") {
            html = "Congratulations! You removed all the characters' angst, and paved the way for their return to Moomin Valley.";
        } else if (status === "lose") {
            html = "Oh no! The compassion of the other characters removed all of your angst before you were able to provide comfort to them. You made it to Moomin Valley, but not all characters did.";
        } else if (status === "start") {
            html = "Hello! The Moomins and their friends are trying to return to Moomin Valley. To get there, you need to help remove all of their angst. Each character has an initial angst level, and the ability to remove angst from other characters through comfort. Choosing a character makes it the comfort provider. You can then choose another character to provide comfort to. Everytime you provide comfort to another character, they will reciprocate with compassion, removing some of your angst. Your goal is to help all the other characters return to Moomin Valley before losing all of your angst, and returning to Moomin Valley before the other characters."
        }
        // show the overlay and modal
        $("#overlay").show();
        $("#modal").html(html + "<br><br>Click to play.");
        $("#modal").show();
        // look for clicks in the modal
        $("#modal").click(function () {
            if (!game.started) {
                // when clicked, start the game, hide the modal and overlay, show the instructions and characters 
                game.started = 1;
                $("#overlay").hide();
                $("#modal").hide();
                $("#available-characters").show(500);
                $("#instruct").show();
                $("#instruct").html("Choose a comfort giver.");
            }
        });  
        // user chooses characters
        this.gamePlay();
    },

    addCharacters: function () {
        // loop through characters and add them to the screen
        $.each(this.character, function (key, currentCharacter) {
            html = '';
            html = html + '<div class="col removable">';
            // put the key in the HTML for reference later in selection
            html = html + '            <div class="container available" id="' + key + '">';
            html = html + '                <div class="front" style="background-image: url(\'' + currentCharacter.imageLocation + '\')">';
            html = html + '                    <div class="inner">';
            html = html + '                        <p>' + currentCharacter.name + '</p>';
            html = html + '                        <span>Angst: ' + currentCharacter.currentAngst;
            html = html + '                            <br>Comfort: ' + currentCharacter.currentComfortStrength;
            html = html + '                           <br>Compassion: ' + currentCharacter.reciprocateStrength + '</span>';
            html = html + '                   </div>';
            html = html + '               </div>';
            html = html + '               <div class="back">';
            html = html + '                    <div class="inner">';
            html = html + '                        <p>' + currentCharacter.description + '</p>';
            html = html + '                    </div>';
            html = html + '                </div>';
            html = html + '            </div>';
            html = html + '        </div>';
            $("#available-characters").append(html);
        });
    },

    // look for clicks on the characters
    gamePlay: function () {
        $(".available").click(function () {
            // if no giver selected, then select one
            if (!game.giverSelected) {
                $("#giver").show();
                game.giverSelected = 1;
                // get the id of the div clicked
                giverChosen = $(this).attr('id');
                // us the id to find the game character
                $("#giver-image").css("background-image", "url('" + game.character[giverChosen].imageLocation + "')");
                $("#giver-name").text(game.character[giverChosen].name);
                $("#giver-angst").text(game.character[giverChosen].currentAngst);
                $("#giver-comfort").text(game.character[giverChosen].currentComfortStrength);
                $("#giver-compassion").text(game.character[giverChosen].reciprocateStrength);
                $($(this)).hide(600);
                $("#instruct").html("Choose a comfort receiver.");
                game.character[giverChosen].currentGiver = 1;
            }
            // if no receiver selected, select one
            else if (!game.receiverSelected) {
                $("#receiver").show();
                game.receiverSelected = 1;
                // get the id of the div clicked
                receiverChosen = $(this).attr('id');
                // us the id to find the game character
                $("#receiver-image").css("background-image", "url('" + game.character[receiverChosen].imageLocation + "')");
                $("#receiver-name").text(game.character[receiverChosen].name);
                $("#receiver-angst").text(game.character[receiverChosen].currentAngst);
                $("#receiver-comfort").text(game.character[receiverChosen].currentComfortStrength);
                $("#receiver-compassion").text(game.character[receiverChosen].reciprocateStrength);
                $($(this)).hide(600);
                $("#give-comfort").show(400);
                $("#instruct").hide();
            }
        });
        // clicking the button to provide comfort
        $("#give-comfort").unbind("click");
        $("#give-comfort").click(function () {
            console.log($(this));
            game.comfort(game.character[giverChosen], game.character[receiverChosen]);
        });
    }
}

$(document).ready(function () {
    game.resetGame("start");
});