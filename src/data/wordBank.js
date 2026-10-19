// Closed, themed word bank for Weave, hand-curated (not scraped from a raw
// dictionary, see GAME_DESIGN.md "Word bank" section for why). Common,
// everyday English words only: no proper nouns, no abbreviations, no
// offensive terms. Lengths 3-9, since the grid generator needs to tile
// a board exactly using real words of varying length.
//
// Themed 2026-10-17, at the user's request: Weave originally shipped
// deliberately theme-less (see GAME_DESIGN.md's original "Generation"
// section) and grabbed words from one flat pool by length alone.
// Restructured, then audited and corrected the same day (the user
// explicitly asked to verify every word actually fits its stated
// theme, not just that the file was internally consistent): two
// category NAMES overclaimed what their word pools actually covered
// ("Fur, Feathers & Fins" promised mammals/birds/fish but the pool was
// full of insects, amphibians, reptiles and mollusks with none of
// those; "Gadgets & Getaways" included music/movie/story/instruments/
// a stadium, none of which are a gadget or a trip). Renamed both to
// honest, broader names (Creatures Great & Small, Gadgets & Getaways
// kept but emptied of its non-gadget/non-travel words instead) rather
// than just relabeling over a mismatch. Also dropped words that don't
// honestly belong to ANY theme (web, feather - animal PRODUCTS, not
// animals; leg - a body part, which also collides with Sprout's real
// "Body Parts" category; music/movie/story/stadium/violin/guitar/
// trumpet/metal - abstract or venue/instrument words with no clean
// concrete-object fit), and relocated household/garage tools
// (hammer, wrench, shovel, saw, nail, bolt, drill, ladder, scissors,
// iron, paint, crayon, pencil, eraser) from Gadgets & Getaways into
// Under One Roof, where they actually belong, plus map (navigation,
// not household) into Gadgets & Getaways and gold (jewelry material)
// into Dressed to the Nines.
//
// Category NAMES also deliberately avoid Sprout's (noodle_games
// sibling, src/data/puzzles.json): Sprout already owns 20 plain
// descriptive category labels covering nearly every common-word
// domain there is (Wild Animals, Kitchen & Cooking, Clothing &
// Accessories, House & Furniture, Tools & Hardware, Weather & Sky,
// Camping & Nature, Body Parts, etc) - since Weave's bank is built
// from the same kind of everyday-word vocabulary, a first pass at
// naming these 6 broader buckets landed on near-duplicates of several
// (caught before shipping, not after). Named with idiom/wordplay
// instead of Sprout's flat "X & Y" descriptive style, which also reads
// better for a word game and keeps the two games' theme badges from
// reading as copy-pasted when they sit side by side on the hub.
//
// THEMES below is the source of truth; WORD_BANK (flat, all categories
// merged) stays exported for scripts/verify-puzzles.mjs's membership
// check and any future tooling that just wants "is this a real bank
// word" without caring which theme it belongs to.
export const THEMES = {
  'Creatures Great & Small': [
    // length 3
    'ant', 'bat', 'bee', 'cat', 'cow', 'dog', 'fox', 'owl', 'pig', 'rat',
    // length 4
    'bear', 'clam', 'crab', 'crow', 'deer', 'fish', 'frog', 'goat', 'hawk', 'lamb',
    'lion', 'moth', 'mule', 'seal', 'swan', 'toad', 'wasp', 'wolf',
    // length 5
    'camel', 'eagle', 'goose', 'horse', 'mouse', 'otter', 'shark', 'snake', 'tiger', 'whale',
    'zebra',
    // length 6
    'beetle', 'donkey', 'monkey', 'rabbit', 'spider', 'turtle',
    // length 7
    'buffalo', 'cricket', 'dolphin', 'giraffe', 'hamster', 'leopard', 'octopus', 'panther', 'peacock', 'penguin',
    'raccoon', 'sparrow',
    // length 8
    'dinosaur', 'elephant', 'flamingo', 'hedgehog', 'kangaroo', 'squirrel',
    // length 9
    'alligator', 'butterfly', 'chameleon', 'crocodile', 'dragonfly', 'porcupine',
  ],
  'The Great Outdoors': [
    // length 3
    'hay', 'ice', 'log', 'oak', 'sea', 'sky', 'sun',
    // length 4
    'coal', 'dust', 'hill', 'lake', 'moon', 'pond', 'rain', 'reef', 'rock', 'sand',
    'snow', 'star', 'wind',
    // length 5
    'beach', 'cloud', 'field', 'ocean', 'river', 'stone', 'storm',
    // length 6
    'branch', 'bridge', 'canyon', 'castle', 'cavern', 'desert', 'forest', 'garden', 'gravel', 'harbor',
    'island', 'jungle', 'meadow', 'pebble', 'summit', 'tunnel', 'valley',
    // length 7
    'blossom', 'boulder', 'glacier', 'pathway', 'rainbow', 'sunrise', 'thicket', 'thunder', 'tornado', 'volcano',
    // length 8
    'blizzard', 'hillside', 'mountain', 'seashell', 'sunlight', 'woodland',
    // length 9
    'driftwood', 'footprint', 'moonlight', 'waterfall',
  ],
  'Under One Roof': [
    // length 3
    'bed', 'box', 'ink', 'key', 'saw', 'tap', 'wax',
    // length 4
    'bolt', 'door', 'gate', 'iron', 'knob', 'lamp', 'lock', 'nail', 'roof', 'wall',
    // length 5
    'attic', 'brick', 'brush', 'chair', 'clock', 'couch', 'drill', 'glass', 'novel', 'paint',
    'paper', 'shelf', 'table', 'towel',
    // length 6
    'basket', 'candle', 'cellar', 'closet', 'crayon', 'eraser', 'garage', 'hammer', 'ladder', 'mirror',
    'pencil', 'pillow', 'shovel', 'window', 'wrench',
    // length 7
    'balcony', 'blanket', 'cabinet', 'ceiling', 'chimney', 'curtain', 'doorway', 'hallway', 'kitchen', 'library',
    // length 8
    'calendar', 'envelope', 'mattress', 'notebook', 'scissors',
  ],
  'Dressed to the Nines': [
    // length 3
    'bag', 'hat', 'zip',
    // length 4
    'belt', 'boot', 'cape', 'coat', 'comb', 'cuff', 'gold', 'ring', 'robe', 'sock',
    'vest',
    // length 5
    'cloak', 'cloth', 'dress', 'glove', 'pants', 'scarf', 'shirt', 'skirt', 'visor', 'watch',
    // length 6
    'blouse', 'bonnet', 'collar', 'helmet', 'jacket', 'mitten', 'sandal', 'slacks', 'wallet',
    // length 7
    'necktie', 'pajamas', 'sweater',
    // length 8
    'backpack', 'cardigan', 'necklace', 'slippers', 'trousers', 'umbrella',
    // length 9
    'nightgown', 'waistcoat',
  ],
  'Gadgets & Getaways': [
    // length 3
    'fan', 'jet', 'map', 'net', 'van',
    // length 4
    'cart', 'disc', 'ship',
    // length 5
    'drone', 'phone', 'plane', 'radio', 'robot', 'truck', 'wagon', 'wheel',
    // length 6
    'anchor', 'camera', 'engine', 'pickup', 'rocket', 'tablet',
    // length 7
    'bicycle', 'compass', 'lantern', 'machine', 'printer', 'scooter', 'tractor', 'trailer',
    // length 8
    'airplane', 'computer', 'elevator', 'keyboard', 'suitcase',
    // length 9
    'speedboat', 'telephone',
  ],
  'Cooking Up a Storm': [
    // length 3
    'cup', 'egg', 'fig', 'gum', 'jam', 'jar', 'pan', 'rib',
    // length 4
    'bean', 'cake', 'corn', 'herb', 'kiwi', 'lime', 'mint', 'pear', 'peas', 'plum',
    'rice', 'sage', 'salt', 'soup',
    // length 5
    'apple', 'bacon', 'bread', 'candy', 'cream', 'grape', 'honey', 'juice', 'knife', 'lemon',
    'melon', 'onion', 'plate', 'spoon', 'sugar', 'toast', 'wheat',
    // length 6
    'banana', 'bottle', 'butter', 'cheese', 'cherry', 'coffee', 'cookie', 'noodle', 'orange', 'peanut',
    'salmon', 'turkey', 'walnut',
    // length 7
    'avocado', 'cabbage', 'coconut', 'ketchup', 'mustard', 'oatmeal', 'pancake', 'popcorn', 'pumpkin', 'spinach',
    'vinegar',
    // length 8
    'broccoli', 'cucumber', 'doughnut', 'meatball', 'sandwich', 'zucchini',
    // length 9
    'artichoke', 'asparagus', 'blueberry', 'chocolate', 'cranberry', 'pineapple', 'raspberry',
  ],
};

export const THEME_NAMES = Object.keys(THEMES);

// Flat view of every word across all themes, for code that doesn't need
// theme membership (see header comment above).
export const WORD_BANK = Object.values(THEMES).flat();
