// Closed, themed word bank for Weave, hand-curated (not scraped from a raw
// dictionary, see GAME_DESIGN.md "Word bank" section for why). Common,
// everyday English words only: no proper nouns, no abbreviations, no
// offensive terms. Lengths 3-9, since the grid generator needs to tile
// a board exactly using real words of varying length.
//
// Themed 2026-10-17, at the user's request: Weave originally shipped
// deliberately theme-less (see GAME_DESIGN.md's original "Generation"
// section) and grabbed words from one flat pool by length alone.
// Restructured into 6 categories, then corrected twice since:
//
// 1. (same day) Two category NAMES overclaimed what their own word
//    pools actually covered ("Fur, Feathers & Fins" promised mammals/
//    birds/fish but the pool was full of insects/amphibians/reptiles
//    with none of those; the food category's old name didn't cover
//    its own kitchen tools). Renamed both rather than relabeling over
//    the mismatch.
//
// 2. (2026-10-22) The user flagged a live puzzle - "Under One Roof"
//    with TAP, CRAYON, LADDER, SHELF - as an incoherent set. A
//    rigorous word-by-word recheck found the earlier correction pass
//    had stuffed garage tools (hammer, wrench, drill, ladder, saw,
//    nail, bolt, shovel) and school/craft supplies (crayon, pencil,
//    eraser, paint) into "Under One Roof" to fix THAT pass's naming
//    problem, without checking whether a ladder or a crayon is
//    honestly a household object. It isn't. Split those 12 words
//    into a new 7th category, "DIY & Doodles" (padded with 25 more
//    fact-checked tool/craft words - the 12 alone were too thin and
//    too skewed toward length 6 to reliably tile every grid size),
//    leaving "Under One Roof" as genuine furniture/fixtures/rooms
//    only. The other 5 categories were re-audited the same pass and
//    held up fine (every word in them is honestly food, clothing,
//    an animal, outdoor/nature, or a tech/travel item - no similar
//    "technically defensible but weird together" outliers found).
//
// 3. (2026-10-22, same pass) User asked to check every remaining
//    future puzzle for the same mistake. Reading through all 96 found
//    one more subtler case: "castle", "bridge", "harbor" are man-made
//    structures that read oddly next to pure nature words like
//    VOLCANO/BLIZZARD under "The Great Outdoors" - a weaker version of
//    the same error, caught preemptively instead of waiting for a
//    third user report. Dropped "castle" (no honest home in any of
//    the 7 categories) and moved "bridge"/"harbor"/"tunnel" into
//    Gadgets & Getaways, which already explicitly covers travel
//    (anchor, ship, speedboat, suitcase), unlike Outdoors, which never
//    claimed "and also human structures."
//
// Category NAMES deliberately avoid Sprout's (noodle_games sibling,
// src/data/puzzles.json): Sprout already owns 20 plain descriptive
// category labels covering nearly every common-word domain there is
// (Wild Animals, Kitchen & Cooking, Clothing & Accessories, House &
// Furniture, Tools & Hardware, Weather & Sky, Camping & Nature, Body
// Parts, School & Office, etc) - since Weave's bank is the same kind
// of everyday-word vocabulary, naming these broader buckets has twice
// landed on near-duplicates of Sprout names before shipping (caught
// both times). Named with idiom/wordplay instead of Sprout's flat
// "X & Y" descriptive style, which also reads better for a word game
// and keeps the two games' theme badges from reading as copy-pasted
// when they sit side by side on the hub.
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
    'branch', 'canyon', 'cavern', 'desert', 'forest', 'garden', 'gravel', 'island', 'jungle', 'meadow',
    'pebble', 'summit', 'valley',
    // length 7
    'blossom', 'boulder', 'glacier', 'pathway', 'rainbow', 'sunrise', 'thicket', 'thunder', 'tornado', 'volcano',
    // length 8
    'blizzard', 'hillside', 'mountain', 'seashell', 'sunlight', 'woodland',
    // length 9
    'driftwood', 'footprint', 'moonlight', 'waterfall',
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
  'Under One Roof': [
    // length 3
    'bed', 'box', 'ink', 'key', 'tap', 'wax',
    // length 4
    'door', 'gate', 'iron', 'knob', 'lamp', 'lock', 'roof', 'wall',
    // length 5
    'attic', 'brick', 'brush', 'chair', 'clock', 'couch', 'glass', 'novel', 'paper', 'shelf',
    'table', 'towel',
    // length 6
    'basket', 'candle', 'cellar', 'closet', 'garage', 'mirror', 'pillow', 'window',
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
    'anchor', 'bridge', 'camera', 'engine', 'harbor', 'pickup', 'rocket', 'tablet', 'tunnel',
    // length 7
    'bicycle', 'compass', 'lantern', 'machine', 'printer', 'scooter', 'tractor', 'trailer',
    // length 8
    'airplane', 'computer', 'elevator', 'keyboard', 'suitcase',
    // length 9
    'speedboat', 'telephone',
  ],
  'DIY & Doodles': [
    // length 3
    'axe', 'saw',
    // length 4
    'bolt', 'file', 'nail', 'pipe', 'rope', 'tape', 'vise', 'wire',
    // length 5
    'clamp', 'drill', 'level', 'paint',
    // length 6
    'bucket', 'chisel', 'crayon', 'eraser', 'funnel', 'hammer', 'ladder', 'marker', 'pencil', 'pliers',
    'shovel', 'wrench',
    // length 7
    'glitter', 'palette', 'stapler', 'sticker', 'toolbox',
    // length 8
    'hardware', 'sawhorse', 'toolshed',
    // length 9
    'sandpaper', 'scrapbook', 'sketchpad',
  ],
};

export const THEME_NAMES = Object.keys(THEMES);

// Flat view of every word across all themes, for code that doesn't need
// theme membership (see header comment above).
export const WORD_BANK = Object.values(THEMES).flat();
