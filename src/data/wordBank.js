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

  // length 5
  'tiger', 'zebra', 'camel', 'horse', 'mouse', 'otter', 'beach', 'ocean', 'river', 'field',
  'cloud', 'storm', 'stone', 'brick', 'glass', 'metal', 'paper', 'cloth', 'wheel', 'chair',
  'table', 'couch', 'shelf', 'candy', 'spoon', 'knife', 'plate', 'towel', 'brush', 'comb',
  'glove', 'scarf', 'shirt', 'skirt', 'dress', 'pants', 'apple', 'grape', 'lemon', 'melon',
  'onion', 'wheat', 'toast', 'bacon', 'juice', 'bread', 'sugar', 'honey', 'cream', 'candle',
  'clock', 'watch', 'radio', 'phone', 'music', 'movie', 'novel', 'story', 'paint', 'crayon',
  'eagle', 'shark', 'whale', 'snake', 'toad', 'goose',

  // length 6
  'garden', 'forest', 'valley', 'meadow', 'desert', 'island', 'bridge', 'castle', 'tunnel', 'cavern',
  'basket', 'bottle', 'pencil', 'eraser', 'ladder', 'hammer', 'wrench', 'shovel', 'pillow', 'blanket',
  'window', 'ceiling', 'mirror', 'closet', 'kitchen', 'garage', 'attic', 'cellar', 'orange', 'banana',
  'cherry', 'coffee', 'butter', 'cheese', 'cookie', 'noodle', 'salmon', 'turkey', 'rabbit', 'turtle',
  'monkey', 'donkey', 'beetle', 'cricket', 'spider', 'feather', 'branch', 'jungle', 'canyon', 'summit',
  'violin', 'guitar', 'trumpet', 'wallet', 'sandal', 'jacket', 'sweater', 'helmet', 'engine', 'rocket',

  // length 7
  'chimney', 'balcony', 'hallway', 'library', 'stadium', 'harbor', 'volcano', 'glacier',
  'compass', 'lantern', 'anchor', 'cabinet', 'curtain', 'mattress', 'bicycle', 'scooter', 'trailer',
  'raccoon', 'penguin', 'octopus', 'dolphin', 'panther', 'leopard', 'giraffe', 'buffalo', 'sparrow', 'peacock',
  'pumpkin', 'spinach', 'avocado', 'coconut', 'walnut', 'peanut', 'mustard', 'ketchup', 'vinegar', 'oatmeal',
  'blossom', 'thicket', 'gravel', 'pebble', 'boulder', 'thunder', 'blizzard', 'tornado', 'rainbow', 'sunrise',

  // length 8
  'mountain', 'elephant', 'squirrel', 'dinosaur', 'crocodile', 'flamingo', 'hedgehog', 'kangaroo', 'hamster',
  'umbrella', 'backpack', 'notebook', 'calendar', 'envelope', 'scissors', 'necklace', 'suitcase', 'keyboard', 'computer',
  'sandwich', 'pancake', 'meatball', 'broccoli', 'zucchini', 'cucumber', 'cabbage', 'doughnut', 'popcorn',
  'sunlight', 'seashell', 'woodland', 'hillside', 'moonlight', 'waterfall', 'driftwood', 'pathway', 'doorway', 'footprint',

  // length 9
  'butterfly', 'chocolate', 'blueberry', 'raspberry', 'pineapple', 'cranberry', 'asparagus', 'artichoke',
  'porcupine', 'alligator', 'chameleon', 'dragonfly',
];
