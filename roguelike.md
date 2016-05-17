/*
    let player = new Player("Hank")
    let one = new Level(player)
    one.print();
one.spawnCat(3,2);
one.spawnDog(3,1);
one.spawnPlayer(1,2);
console.log(one.map)
one.print();
*/

/* Notes

The roguelike board is an array of tile objects

Each tile object can contain many things, in rough order of precedence:

	-The Player
	-Terrain
	-Enemies
	-Items or Objects

On each turn, the player may attempt once to move once into an adjacent tile.  

The tile must have an object method that checks for the results of this attempt.
	
Impassible Contents:
	-If the terrain is a wall, the player fails to move, and the turn is wasted.  The game tick is triggered.
	-If the tile inventory contains an enemy, the player fails to move, and instead attacks the enemy.  The game tick (and a response from each adjacent enemy) is triggered.

Open tiles:
	-If the terrain is a floor, the player object is moved into the tile and displayed there, taking precedence over all other things.
	-Thus, the player can enter tiles with corpses, health items, weapons, and other sundry passable objects.
	-A successful entry method from the tile object triggers the entry of the player into the tile and the display of any messages regarding items in the tile.

The Player Object:
	-The controls are bound to movement attempt methods of the player object, which trigger entry attempt methods on adjacent tiles.
	-The player object may also trigger methods to add things to its own inventory.


//NEW IDEA

testmove method on tiles

returns based on tile contents as player attempts to enter

then it does as above, the player is not stored "in inventory" per se for ease of manipulation, monsters should probably work the same way.

player.trymove(destination)
{
if destination.testmove==1, player.moveto(destination)
}

then maybe destination.onentered(player)

probably implement shadows/fogofwar based on a simple mask, not yet rays

How would ray casting work?


System Arrays:

Monsters []
Players []

need to set up classes for monsters and the player that hold 

{
	business logic stats,
	row: y,
	col: x,
	ID: immutable ID tag,
	inventory: [],
	equipped: item from inventory, // How to make this work with references and dropping items??
	method.attack(),
	method.attacked(),
}


Turfs:

{
	name: "floor",
	symbol: "+",
	passable: 1,
	mobs:[],
	inventory:[],
	has_monster: _id,
}

if ENTERING && TILE_HAS_MONSTER = attack monster?
	-when a monster enters a tile, it sets the has_monster flag to its id, when it dies or leaves, it removes it.
	-all monsters are generated and stored in an array.  they contain their row, column, and id along with all the other monster stuff.
	-when you attempt to enter a tile with has_monster, the correct monster is retrieved by the find() method on the monster array with the ID set to has_monster



if ENTERING && TILE_IS_WALL = bang head on wall


so each terrain needs to have a symbol
it renders its symbol
if it has an item in it it renders that


so... player.move(dir),
gives us player.testEnter(tile),
gives us some data about what's in that tile,
player applies appropriate method to it,







//GAME OF GUTS mapgen

-> Cellular automaton walls need to be distinct from normal walls
-> Map needs to show preview of where walls will expand to on next turn

->Mutating tiles - each cell follows rules but they can be mutated




->Age dependent behavior:
	If a cell is of normal age or dead, it behaves normally (sustain = 3)
	If a cell is between 10 and 50 generations old, it behaves with sustain = 4
	If a cell is over 50 generations old, it does not reproduce*/



//New map generation 5/9/16

-> Map must first be expressed as a graph of rooms and connections.
-> Map has eight cells, each is adjacent to the ones above/below and left/right of it
-> Each cell has a 100% chance of being populated with SOMETHING
-> So an array of 8 objects, each with:
	what is in it?
		large tunnel or
		room
	neighbors
		connection to each neighbor?
			connection type?
	So we can prepopulate thus:

	[0][1][2][3]
	[4][5][6][7]

first pass: 

for each cell

	populate(){
		80% chance of a room,
		20% chance of just a tunnel,
	}

for each cell

	connect(neighbor){
		if other neighbor is connected to me, stop
		if I am a room and neighbor is a room, 20% chance of an open connection which leads to a larger open room
		otherwise, 40% total chance connection is a tunnel
		otherwise, 40% total chance of no connection
	}

so...
	assess room types
	assess connections
	populate rooms
	populate tunnel connections