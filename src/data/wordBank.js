// Closed, themed word bank for Weave, hand-curated (not scraped from a raw
// dictionary, see GAME_DESIGN.md "Word bank" section for why). Common,
// everyday English words only: no proper nouns, no abbreviations, no
// offensive terms. Lengths 3-9, since the grid generator needs to tile
// a board exactly using real words of varying length.
//
// Themed 2026-10-17, at the user's request: Weave originally shipped
// deliberately theme-less (see GAME_DESIGN.md's original "Generation"
// section and the "no theme" copy this change replaces in App.jsx /
// HowToPlay.jsx) and grabbed words from one flat pool by length alone.
// Every one of the original 323 words got sorted into exactly one of
// the 6 categories below (verified programmatically: 0 missing, 0
// duplicates, 0 unaccounted for); the 39 new words are padding, fact-
// checked common compounds/nouns added so the thinner categories
// (clothing, tools/vehicles) still have enough length variety to
// reliably tile every weekday's grid size on their own, same bar as the
// rest of this bank. generate-puzzles.mjs now picks ONE category per
// day and draws that day's whole word set from it, instead of the full
// bank, so every word on a given day's grid shares a real theme.
//
// Category NAMES deliberately avoid Sprout's (noodle_games sibling,
// src/data/puzzles.json): Sprout already owns 20 plain descriptive
// category labels covering nearly every common-word domain there is
// (Wild Animals, Kitchen & Cooking, Clothing & Accessories, House &
// Furniture, Tools & Hardware, Weather & Sky, Camping & Nature, etc) -
// since Weave's bank is built from the same kind of everyday-word
// vocabulary, a first pass at naming these 6 broader buckets landed on
// near-duplicates of several (caught before shipping, not after).
// Renamed to idiom/wordplay-flavored names instead of Sprout's flat
// "X & Y" descriptive style, which also reads better for a word game
// and makes the two games' theme badges feel designed, not copied, when
// they sit side by side on the hub.
//
// THEMES below is the source of truth; WORD_BANK (flat, all categories
// merged) stays exported for scripts/verify-puzzles.mjs's membership
// check and any future tooling that just wants "is this a real bank
// word" without caring which theme it belongs to.
export const THEMES = {
  'Fur, Feathers & Fins': [
    // length 3
    'cat', 'dog', 'fox', 'owl', 'bee', 'ant', 'pig', 'cow', 'bat', 'rat',
    'web',
    // length 4
    'frog', 'lion', 'wolf', 'bear', 'deer', 'swan', 'hawk', 'crow', 'moth', 'wasp',
    'lamb', 'goat', 'mule', 'seal', 'fish', 'crab', 'clam', 'toad',
    // length 5
    'tiger', 'zebra', 'camel', 'horse', 'mouse', 'otter', 'eagle', 'shark', 'whale', 'snake',
    'goose',
    // length 6
    'rabbit', 'turtle', 'monkey', 'donkey', 'beetle', 'spider',
    // length 7
    'cricket', 'feather', 'raccoon', 'penguin', 'octopus', 'dolphin', 'panther', 'leopard', 'giraffe', 'buffalo',
    'sparrow', 'peacock', 'hamster',
    // length 8
    'elephant', 'squirrel', 'dinosaur', 'flamingo', 'hedgehog', 'kangaroo',
    // length 9
    'crocodile', 'butterfly', 'porcupine', 'alligator', 'chameleon', 'dragonfly',
  ],
  'Earth, Wind & Weather': [
    // length 3
    'sun', 'sky', 'ice', 'oak', 'sea', 'hay', 'log',
    // length 4
    'reef', 'pond', 'lake', 'hill', 'rock', 'sand', 'dust', 'wind', 'rain', 'snow',
    'star', 'moon', 'coal',
    // length 5
    'beach', 'ocean', 'river', 'field', 'cloud', 'storm', 'stone',
    // length 6
    'garden', 'forest', 'valley', 'meadow', 'desert', 'island', 'bridge', 'castle', 'tunnel', 'cavern',
    'branch', 'jungle', 'canyon', 'summit', 'harbor', 'gravel', 'pebble',
    // length 7
    'volcano', 'glacier', 'blossom', 'thicket', 'boulder', 'thunder', 'tornado', 'rainbow', 'sunrise', 'pathway',
    // length 8
    'blizzard', 'mountain', 'sunlight', 'seashell', 'woodland', 'hillside',
    // length 9
    'moonlight', 'waterfall', 'driftwood', 'footprint',
  ],
  'Food, Glorious Food': [
    // length 3
    'egg', 'jam', 'pan', 'rib', 'fig', 'jar', 'cup', 'gum',
    // length 4
    'cake', 'soup', 'rice', 'bean', 'corn', 'peas', 'herb', 'sage', 'mint', 'lime',
    'plum', 'pear', 'kiwi', 'salt',
    // length 5
    'candy', 'spoon', 'knife', 'plate', 'apple', 'grape', 'lemon', 'melon', 'onion', 'wheat',
    'toast', 'bacon', 'juice', 'bread', 'sugar', 'honey', 'cream',
    // length 6
    'bottle', 'orange', 'banana', 'cherry', 'coffee', 'butter', 'cheese', 'cookie', 'noodle', 'salmon',
    'turkey', 'walnut', 'peanut',
    // length 7
    'pumpkin', 'spinach', 'avocado', 'coconut', 'mustard', 'ketchup', 'vinegar', 'oatmeal', 'pancake', 'cabbage',
    'popcorn',
    // length 8
    'sandwich', 'meatball', 'broccoli', 'zucchini', 'cucumber', 'doughnut',
    // length 9
    'chocolate', 'blueberry', 'raspberry', 'pineapple', 'cranberry', 'asparagus', 'artichoke',
  ],
  'Under One Roof': [
    // length 3
    'key', 'map', 'tap', 'wax', 'bed', 'box', 'ink', 'leg',
    // length 4
    'gate', 'lock', 'knob', 'door', 'wall', 'roof', 'lamp', 'gold',
    // length 5
    'brick', 'glass', 'paper', 'chair', 'table', 'couch', 'shelf', 'towel', 'brush', 'clock',
    'novel', 'attic',
    // length 6
    'candle', 'basket', 'pillow', 'window', 'mirror', 'closet', 'garage', 'cellar',
    // length 7
    'blanket', 'ceiling', 'kitchen', 'chimney', 'balcony', 'hallway', 'library', 'cabinet', 'curtain', 'doorway',
    // length 8
    'mattress', 'notebook', 'calendar', 'envelope',
  ],
  'Dressed to the Nines': [
    // length 3
    'zip', 'hat', 'bag',
    // length 4
    'cape', 'sock', 'belt', 'coat', 'vest', 'boot', 'ring', 'comb', 'robe', 'cuff',
    // length 5
    'cloth', 'glove', 'scarf', 'shirt', 'skirt', 'dress', 'pants', 'watch', 'cloak', 'visor',
    // length 6
    'wallet', 'sandal', 'jacket', 'helmet', 'mitten', 'bonnet', 'blouse', 'collar', 'slacks',
    // length 7
    'sweater', 'necktie', 'pajamas',
    // length 8
    'umbrella', 'backpack', 'necklace', 'trousers', 'cardigan', 'slippers',
    // length 9
    'nightgown', 'waistcoat',
  ],
  'Gadgets & Getaways': [
    // length 3
    'net', 'van', 'fan', 'saw', 'jet',
    // length 4
    'iron', 'nail', 'ship', 'cart', 'bolt', 'disc',
    // length 5
    'metal', 'wheel', 'radio', 'phone', 'music', 'movie', 'story', 'paint', 'drill', 'truck',
    'plane', 'drone', 'robot', 'wagon',
    // length 6
    'crayon', 'pencil', 'eraser', 'ladder', 'hammer', 'wrench', 'shovel', 'violin', 'guitar', 'engine',
    'rocket', 'anchor', 'camera', 'tablet', 'pickup',
    // length 7
    'trumpet', 'stadium', 'compass', 'lantern', 'bicycle', 'scooter', 'trailer', 'tractor', 'machine', 'printer',
    // length 8
    'scissors', 'suitcase', 'keyboard', 'computer', 'airplane', 'elevator',
    // length 9
    'telephone', 'speedboat',
  ],
};

export const THEME_NAMES = Object.keys(THEMES);

// Flat view of every word across all themes, for code that doesn't need
// theme membership (see header comment above).
export const WORD_BANK = Object.values(THEMES).flat();
