# codename:rl1k concept file

## Concept
### Backstory
You are a monk. You have spent decades meditating at the footsteps of an unknown crypt, rumoured by other scholars to be the source of a great evil. You were skeptic from the beginning of your journey, but in the last few months you felt a strange presence in your thoughts. The time has come to enter the crypt and investigate this rumor.

### Environment
You explore an ancient labyrinthic crypt in search for the evil presence you perceived in the apex of your decade-long meditation. You fight through hordes of minor demons and condemned souls, find long lost parchments with ancient knowledge and attempt to decipher your way through the ever descending dungeons.

### Development
As you delve deeper and deeper into the catacombs, the evil presence you seek begins to reveal itself. Your mind decays. Corrupted beings ask you impossible questions and fill your head with profanities about everything you consider sacred. You fight abominations and rotten warriors. Imprisoned souls cry for your help as their torturers rot their heads with lies, but will you sacrifice your ever diminishing time and sanity to help them? Choices mould your character as you descend the crypt.

### Resolution
Exhausted, wounded and disgraced, your mind has a final moment of clarity. You are covered in innocent blood. You have sinned greatly, for all creatures are children of Gaia, even those who chose the path of caos. The cavernous walls around you are whispering. Your bones are rotting. Your flesh is stained. You drop your sword and shout for redemption, as the cavern fills your head with decaying words. A beautiful, eteral slime embraces your skin. It makes you feel restored and cleanses your mind of all rotten thoughts. In perfect harmony, you mediate for decades. Will you accept your new found faith ?

## Game Mechanics

### Basic elements
 
 * You control a character in a 2D top-down brawler environment.
 * Progress in the game is made by advancing through mazes and defeating foes in combat.
 * You have an inventory with equipment (e.g., weapons, armour, potions, scrolls).
 * The main resources you have to manage are your health, your sanity and your age.

### Health
The health mechanic will be pretty standard: If you get hit, you loose health. If you drink a potion or rest, you regain health.

### Sanity
Sanity is a measure of your mental well being, and it's a resource you'll have to gamble in order to progress in the game, e.g.:

 * Certain types of enemies may decrease your sanity when you fight with them, but will yield greater rewards.
 * In order to rescue captive souls and imprisoned creatures, you'll have to sacrifice some of your sanity.
 * Certain items may reduce your sanity in return for greater abilities.

When your sanity decreases, you start to feel closer to the source of all evil that you seek. For the player, this will mean, e.g.:

 * Visual effects that make the game more difficult, like darkness, fogginess and flashes.
 * Foes disguised as loot, which attack you unexpectedly.
 * More difficult labyrinth paths to solve.

This effects worsen as the sanity reserves of the player decrease.

### Age
You start your quest as a 40 year old monk. You expect to live about 120 years, the average life expectancy of the spiritually gifted. Your abilities are affected by your age (e.g., reduced strength but increased spiritual knowledge in an elderly stage). Age is managed in the following ways:

 * When you meditate, you get older. In return, meditation improves your skills and may be required in certain stages of the game.
 * You may regain life back by stealing it from innocent souls, which you will find during your journey, at a greater cost of your sanity. You'll also be violating your vows as a monk, which may impede you of, e.g., following certain skill tree paths.

## Milestones
### Stage 0: Game-Engine
 1. Setup a development environment with Javascript and Phaserjs.
 2. Have a working basic 2D top-down game mechanic, with player movement and random enemy movement.
 3. Have a tiled map with collision.  
 4. Add level switching mechanics.
 5. Add basic player-enemy interaction, i.e., decrease life on stabbing. 
 6. Add basic AI.
 7. Add enemy loot.
 8. Add inventory.
 9. Add chests and other types of loot. 
 10. ...
 11. Integrate all these basic engine aspects into a 2D top-down player-vs-enemies brawler.
 
### Stage 1: Working-Concept

 1. Have custom sprites for the game.
 2. Have player switch weapons.
 3. Player & Enemy spell casting.
 4. Interact with scenario.
 5. Procedural Maze generation.
 6. Non-Foe characters.
 7. Basic dialog between player and npcs.
 8. Implement basic sanity management with a foggy or dark screen crawling in when sanity fades away.
 9. Implement basic age management with a meditation action.
 10. ...
 11. Integrate all these into a working proof-of-concept with the right environment feel and game mechanics.
 
### Stage 2: Game

1. ...
