// Closed word bank for Weave, hand-curated (not scraped from a raw
// dictionary, see GAME_DESIGN.md "Word bank" section for why). Common,
// everyday English words only: no proper nouns, no abbreviations, no
// offensive terms. Lengths 3-9, since the grid generator needs to tile
// a board exactly using real words of varying length.
//
// This is the closed-bank trade-off Tandem's wordBank.js already
// documents: a fixed list can never cover every real word a player
// might try to trace. Content gaps get reported and patched over time,
// not pre-solved.
//
// Pre-deploy once-over (2026-10-07): read through every word by hand,
// all 323 are real, correctly-spelled, common English words, nothing
// flagged. Also fixed the length-bucket comments below, several words
// had drifted into the wrong bucket as entries got added incrementally
// (e.g. "candle" and "crayon" sitting under "length 5" despite being
// 6 letters). Purely cosmetic, scripts/*.mjs compute real lengths
// programmatically so this never affected the actual game, but
// confusing to read. Re-sorted by actual length, 0 words added or
// removed (323 before, 323 after).
export const WORD_BANK = [
  // length 3
  'cat', 'dog', 'sun', 'fox', 'owl', 'bee', 'ant', 'pig', 'cow', 'bat',
  'rat', 'sky', 'ice', 'web', 'egg', 'jam', 'key', 'leg', 'map', 'net',
  'oak', 'pan', 'rib', 'sea', 'tap', 'van', 'wax', 'zip', 'fig', 'jar',
  'hat', 'bag', 'cup', 'bed', 'box', 'fan', 'gum', 'hay', 'ink', 'log',

  // length 4
  'frog', 'lion', 'wolf', 'bear', 'deer', 'swan', 'hawk', 'crow', 'moth', 'wasp',
  'lamb', 'goat', 'mule', 'seal', 'fish', 'crab', 'clam', 'reef', 'pond', 'lake',
  'hill', 'rock', 'sand', 'dust', 'wind', 'rain', 'snow', 'star', 'moon', 'cake',
  'soup', 'rice', 'bean', 'corn', 'peas', 'herb', 'sage', 'mint', 'lime', 'plum',
  'pear', 'kiwi', 'cape', 'gate', 'lock', 'knob', 'door', 'wall', 'roof', 'lamp',
  'sock', 'belt', 'coat', 'vest', 'boot', 'ring', 'gold', 'iron', 'coal', 'salt',
  'comb', 'toad',

  // length 5
  'tiger', 'zebra', 'camel', 'horse', 'mouse', 'otter', 'beach', 'ocean', 'river', 'field',
  'cloud', 'storm', 'stone', 'brick', 'glass', 'metal', 'paper', 'cloth', 'wheel', 'chair',
  'table', 'couch', 'shelf', 'candy', 'spoon', 'knife', 'plate', 'towel', 'brush', 'glove',
  'scarf', 'shirt', 'skirt', 'dress', 'pants', 'apple', 'grape', 'lemon', 'melon', 'onion',
  'wheat', 'toast', 'bacon', 'juice', 'bread', 'sugar', 'honey', 'cream', 'clock', 'watch',
  'radio', 'phone', 'music', 'movie', 'novel', 'story', 'paint', 'eagle', 'shark', 'whale',
  'snake', 'goose', 'attic',

  // length 6
  'candle', 'crayon', 'garden', 'forest', 'valley', 'meadow', 'desert', 'island', 'bridge', 'castle',
  'tunnel', 'cavern', 'basket', 'bottle', 'pencil', 'eraser', 'ladder', 'hammer', 'wrench', 'shovel',
  'pillow', 'window', 'mirror', 'closet', 'garage', 'cellar', 'orange', 'banana', 'cherry', 'coffee',
  'butter', 'cheese', 'cookie', 'noodle', 'salmon', 'turkey', 'rabbit', 'turtle', 'monkey', 'donkey',
  'beetle', 'spider', 'branch', 'jungle', 'canyon', 'summit', 'violin', 'guitar', 'wallet', 'sandal',
  'jacket', 'helmet', 'engine', 'rocket', 'harbor', 'anchor', 'walnut', 'peanut', 'gravel', 'pebble',

  // length 7
  'blanket', 'ceiling', 'kitchen', 'cricket', 'feather', 'trumpet', 'sweater', 'chimney', 'balcony', 'hallway',
  'library', 'stadium', 'volcano', 'glacier', 'compass', 'lantern', 'cabinet', 'curtain', 'bicycle', 'scooter',
  'trailer', 'raccoon', 'penguin', 'octopus', 'dolphin', 'panther', 'leopard', 'giraffe', 'buffalo', 'sparrow',
  'peacock', 'pumpkin', 'spinach', 'avocado', 'coconut', 'mustard', 'ketchup', 'vinegar', 'oatmeal', 'blossom',
  'thicket', 'boulder', 'thunder', 'tornado', 'rainbow', 'sunrise', 'hamster', 'pancake', 'cabbage', 'popcorn',
  'pathway', 'doorway',

  // length 8
  'mattress', 'blizzard', 'mountain', 'elephant', 'squirrel', 'dinosaur', 'flamingo', 'hedgehog', 'kangaroo', 'umbrella',
  'backpack', 'notebook', 'calendar', 'envelope', 'scissors', 'necklace', 'suitcase', 'keyboard', 'computer', 'sandwich',
  'meatball', 'broccoli', 'zucchini', 'cucumber', 'doughnut', 'sunlight', 'seashell', 'woodland', 'hillside',

  // length 9
  'crocodile', 'moonlight', 'waterfall', 'driftwood', 'footprint', 'butterfly', 'chocolate', 'blueberry', 'raspberry', 'pineapple',
  'cranberry', 'asparagus', 'artichoke', 'porcupine', 'alligator', 'chameleon', 'dragonfly',
];
