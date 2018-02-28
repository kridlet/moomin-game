var giverSelected = 0;
var receiverSelected = 0;

var game = {
    turns: 1,
    character: {
        moominpapa: {
            currentAngst: 120,
            currentComfortStrength: 8,
            reciprocateStrength: 10,
            comfortStrengthIncrease: 8,
            name: 'Moomin Pappa',
            description: 'Boyish and adventurous. He likes to be present when something unusual happens. He is philosophical at times and likes writing his memoirs.',
            imageLocation: 'assets/images/moominpappa-main.png',
            inMoominValley: 0
        },
        littlemy: {
            currentAngst: 180,
            currentComfortStrength: 2,
            reciprocateStrength: 25,
            comfortStrengthIncrease: 2,
            name: 'Little My',
            description: 'A mischievous little girl with a brave, spunky personality. She likes adventure, but loves catastrophes, and often does mean things on purpose. She finds messiness and untidiness exciting.',
            imageLocation: 'assets/images/little-my-main.png',
            inMoominValley: 0
        },
        sniff: {
            currentAngst: 100,
            currentComfortStrength: 12,
            reciprocateStrength: 5,
            comfortStrengthIncrease: 12,
            name: 'Sniff',
            description: 'He likes to take part in everything, but is afraid to do anything dangerous. Sniff appreciates all valuables and makes many plans to get rich, but does not succeed.',
            imageLocation: 'assets/images/sniff-main.png',
            inMoominValley: 0
        },
        snufkin: {
            currentAngst: 150,
            currentComfortStrength: 4,
            reciprocateStrength: 20,
            comfortStrengthIncrease: 4,
            name: 'Snufkin',
            description: 'A lonesome philosophical traveller, who likes to play the harmonica and wanders around the world with only a few things, so as not to make his life complicated. He is carefree, calm, and fearless.',
            imageLocation: 'assets/images/snufkin-main.png',
            inMoominValley: 0
        }
    },

    comfort: function (giver, receiver) {
        // while (giver.currentAngst > 0 && receiver.currentAngst > 0) {
            giver.currentComfortStrength = giver.comfortStrengthIncrease * this.turns;
            receiver.currentAngst = receiver.currentAngst - giver.currentComfortStrength;
            if (receiver.currentAngst > 0) {
                giver.currentAngst = giver.currentAngst - receiver.reciprocateStrength;
            }
            this.updateStatus("giver", giver.currentAngst, giver.currentComfortStrength);
            this.updateStatus("receiver", receiver.currentAngst, receiver.currentComfortStrength);
            this.turns++;
            if (receiver.currentAngst < 1) {
                $("#give-comfort").hide();
                $("#receiver").hide(600);
                receiver.inMoominValley = 1;
                // are there any left? 
                var found = game.character.find(function(element) {
                    return element > 10;
                  });
                  
                  console.log(found);
                receiverSelected = 0;
                // break;
            }
            if (giver.currentAngst < 1) {
                $("#give-comfort").hide();
                $("#giver").hide();
                $("#available-characters").hide();
                this.resetGame("lose");
                // break;
            }
        // }
    },

    updateStatus: function (character, angst, strength) {
        if (character === "giver") {
            $("#giver-angst").text(angst);
            $("#giver-comfort").text(strength);
        }
        else {
            $("#receiver-angst").text(angst);
            $("#receiver-comfort").text(strength);
        }
    },

    resetGame: function (status) {
        if (status === "win") {
            html = "Congratulations! You removed all the characters angst, and paved the way for their return to Moomin Valley.";
        } else {
            html = "Oh no! The compassion of the other characters removed all of your angst before you were able to provide comfort to them. You made it to Moomin Valley, but not all characters did.";
        }
        $("#receiver").hide(600);
        $("#giver").hide(600);
        $("#overlay").show();
        $("#modal").html(html +"<br><br>Click to play again.");
        $("#modal").show();
        receiverSelected = 0;
        started = 0;
    }
}

function addCharacters() {
    // add characters to screen
    $.each(game.character, function (key, currentCharacter) {
        html = '';
        html = html + '<div class="col">';
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
}
$(document).ready(function () {
    var started = 0;
    $("#instruct").hide();
    $("#give-comfort").hide();
    $("#receiver").hide();
    $("#giver").hide();
    $("#available-characters").hide();
    addCharacters();
    $("#modal").click(function () {   
        if (!started) {
            started = 1;
            $("#overlay").hide();
            $("#modal").hide();
            $("#available-characters").show(500);
            $("#instruct").show();
            $("#instruct").html("Choose a comfort giver.");
        }
    });

    $(".available").click(function () {
        console.log($(this));
        if (!giverSelected) {
            $("#giver").show();
            giverSelected = 1;
            giverChosen = $(this).attr('id');
            $("#giver-image").css("background-image", "url('" + game.character[giverChosen].imageLocation + "')");
            $("#giver-name").text(game.character[giverChosen].name);
            $("#giver-angst").text(game.character[giverChosen].currentAngst);
            $("#giver-comfort").text(game.character[giverChosen].currentComfortStrength);
            $("#giver-compassion").text(game.character[giverChosen].reciprocateStrength);
            $($(this)).hide(600);
            $("#instruct").html("Choose a comfort receiver.");
        }
        else if (!receiverSelected) {
            $("#receiver").show();
            receiverSelected = 1;
            receiverChosen = $(this).attr('id');
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

    $("#give-comfort").click(function() {
        game.comfort(game.character[giverChosen], game.character[receiverChosen]);
    });
});