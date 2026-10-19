import type { DestinationDetail } from "@/types/content";

// Day lengths are rounded and vary by a few days each year. Midnight sun and polar night dates follow data/light-moments.ts.
export const destinationDetails: Record<string, DestinationDetail> = {
  // Norway
  oslo: {
    body: [
      "Oslo sits at the head of a long fjord, with forest on three sides and islands on the fourth. The metro runs to the trailheads; the harbour has saunas and swimming steps.",
      "Late spring to early autumn is easiest, when the island ferries run often and people eat outside. December is dark, cold and candlelit, with skiing in the hills above the city from about January.",
      "The museum quarter at Bygdøy is busy on summer afternoons. Go in the morning, and spend the afternoon on the fjord instead.",
    ],
    slowWay: { stops: ["copenhagen", "oslo"], text: "The overnight ferry from Copenhagen. Dinner in the Kattegat, breakfast as you sail up the Oslofjord." },
    light: { summer: "Around midsummer, about eighteen and a half hours of daylight and no real dark.", winter: "About six hours of daylight in December, low and soft." },
  },
  bergen: {
    body: [
      "Bergen is a harbour town between seven hills, with the old wooden wharf of Bryggen on one side of the bay and the fish market on the other. It rains often; locals barely notice.",
      "Come between May and September for the long evenings and the boats to the fjords. Winter is wet and quiet, with good restaurants and few visitors.",
      "Cruise ships fill the centre on many summer days. Walk up Fløyen on foot rather than queuing for the funicular, and see Bryggen early in the morning.",
    ],
    slowWay: { stops: ["oslo", "bergen"], text: "The Bergen Line from Oslo: seven hours over the Hardangervidda plateau. That's the point." },
    light: { summer: "Close to nineteen hours of daylight in June, with a long, blue dusk.", winter: "About six hours of daylight in December, often under cloud." },
  },
  geirangerfjord: {
    body: [
      "The Geirangerfjord winds between near-vertical walls, with waterfalls on both sides and old farms clinging to ledges high above the water. Some are reached only by steep paths.",
      "The ferries and mountain roads run from about May to September. June brings the fullest waterfalls and snow still on the tops; September is quieter.",
      "In summer large cruise ships arrive most days. Stay a night by the fjord and take the boat early or late, when the village is yours again.",
    ],
    slowWay: { stops: ["oslo", "alesund", "geiranger"], text: "The Rauma Line through the Romsdal valley to Ålesund, then the ferry from Hellesylt into the fjord." },
    light: { summer: "About twenty hours of daylight in June; the sun drops behind the walls before it sets.", winter: "Short days, and the sun stays behind the mountains for weeks." },
  },
  naeroyfjord: {
    body: [
      "The Nærøyfjord is an arm of the Sognefjord, narrowing to a few hundred metres between mountains well over a thousand metres high. Small farms and villages sit where the land allows.",
      "May to September is the season for boats and kayaks. Spring brings meltwater and waterfalls; autumn, gold birch and quiet water.",
      "Flåm gets busy around the midday cruise ships and trains. Stay a night nearby, and be on the water in the morning or evening.",
    ],
    slowWay: { stops: ["oslo", "flam"], text: "The Bergen Line to Myrdal, then the Flåm Railway down to the fjord. Continue by boat to Bergen in summer." },
    light: { summer: "Roughly nineteen hours of daylight in June, softened by the valley walls.", winter: "About five to six hours of daylight; the sun barely clears the mountains." },
  },
  lofoten: {
    body: [
      "Lofoten is a chain of islands with mountains straight out of the sea, fishing villages of red and yellow cabins, and white-sand beaches with very cold water.",
      "Summer brings the midnight sun and long hikes. Late winter, February and March, brings snow on the peaks, drying cod on the racks and a fair chance of the aurora.",
      "The main road gets crowded in July. Base yourself in one quieter village and walk, rather than driving the length of the islands in a day.",
    ],
    slowWay: { stops: ["oslo", "trondheim", "bodo", "svolvaer"], text: "The Dovre Line to Trondheim, the Nordland Line over the Arctic Circle to Bodø, then the ferry across the Vestfjord." },
    light: { summer: "Midnight sun from about late May to mid-July.", winter: "A short polar night around midwinter; a few hours of blue twilight at noon." },
  },
  tromso: {
    body: [
      "Tromsø is a small, lively city on an island, with mountains and fjords on every side. It is the natural base for the Arctic in winter and for long summer nights.",
      "From late September to late March it sits under the auroral oval; from about November to January there are whales in the fjords to the north. In June it forgets to get dark.",
      "Aurora tours from the centre can feel crowded. We prefer a cabin out of town, or a driver who will follow the clear sky inland.",
    ],
    slowWay: { stops: ["stockholm", "kiruna", "abisko", "narvik", "tromso"], text: "The night train from Stockholm to Kiruna, the Ofoten Line down to Narvik, then the bus north to Tromsø." },
    light: { summer: "Midnight sun from mid-May to late July.", winter: "Polar night from late November to mid-January; blue light at noon." },
  },
  "north-cape": {
    body: [
      "The North Cape is a high cliff on the island of Magerøya, above the Barents Sea. The mainland's true northern point is a long hike to the west; the cape is where people come.",
      "June and July are the months for the midnight sun. In winter the road is opened in convoy behind a snowplough, weather permitting.",
      "The visitor centre is busy around midnight in summer. Walk a little way along the cliffs, or visit the fishing villages nearby, to have the view to yourself.",
    ],
    slowWay: { stops: ["helsinki", "rovaniemi", "saariselka", "north-cape"], text: "The night train to Rovaniemi, north to Saariselkä, then across the border through Karasjok and along the Porsangerfjord." },
    light: { summer: "Midnight sun from about mid-May to the end of July.", winter: "Polar night from about late November to late January." },
  },
  svalbard: {
    body: [
      "Svalbard is a group of Arctic islands halfway to the North Pole. Longyearbyen is the main settlement; beyond it are glaciers, tundra and polar bears, which is why you never leave town unguided.",
      "March and April bring sun on snow and the last of the aurora. Summer brings the midnight sun, open water and boat trips along the glaciers.",
      "This is a fragile place. We use small operators, keep groups small and stay long enough to make the flight worthwhile.",
    ],
    slowWay: { stops: ["tromso", "svalbard"], text: "It's a flight. There is no sensible way to reach Svalbard by sea, so we make the rest of the trip slow and fly from Tromsø." },
    light: { summer: "Midnight sun from about late April to late August.", winter: "Polar night from late October to mid-February." },
  },

  // Sweden
  stockholm: {
    body: [
      "Stockholm is built on fourteen islands, with the old town in the middle and water at the end of every street. Beyond it lie tens of thousands of islands, reached by public boats.",
      "May to August is for the archipelago: swimming from smooth rocks, a night on an island. December has markets and candles, and early dark.",
      "The old town fills up on summer afternoons. Spend those hours on a boat, and walk Gamla stan in the early morning.",
    ],
    slowWay: { stops: ["copenhagen", "stockholm"], text: "About five hours by train from Copenhagen, over the Øresund Bridge and through southern Sweden's forests and lakes." },
    light: { summer: "About eighteen and a half hours of daylight at midsummer, and light nights.", winter: "About six hours of daylight in December." },
  },
  gothenburg: {
    body: [
      "Gothenburg is Sweden's harbour city: relaxed, green and good for seafood. The west coast stretches north from it, with granite skerries and white-and-red fishing villages.",
      "June to September is best on the coast, for swimming, boats and shellfish. Autumn is oyster and lobster season.",
      "Bohuslän's villages get busy in July. Come in late August or September, when the water is still warm enough and the crowds have gone.",
    ],
    slowWay: { stops: ["copenhagen", "gothenburg"], text: "About three and a half hours by train from Copenhagen, across the Øresund Bridge and up the coast." },
    light: { summer: "About eighteen hours of daylight in June.", winter: "About seven hours of daylight in December." },
  },
  "swedish-lapland": {
    body: [
      "Abisko sits between a long mountain lake and the high fells, in a rain shadow that keeps the skies clearer than much of the north. Kiruna, the mining town, is an hour away by train.",
      "From September to March it is one of Europe's better places for the aurora. Summer brings the midnight sun, the Kungsleden trail and long days in the birch forest.",
      "Kiruna is moving, building by building, because of the mine. Abisko is quieter; we usually sleep there.",
    ],
    slowWay: { stops: ["copenhagen", "stockholm", "kiruna", "abisko"], text: "By train to Stockholm, then the night train north. You wake up above the Arctic Circle." },
    light: { summer: "Midnight sun from about late May to mid-July.", winter: "A short polar night around midwinter; long, dark skies for the aurora." },
  },
  gotland: {
    body: [
      "Gotland is a large, flat island in the Baltic. Visby, its walled medieval town, is the centre; the rest is farmland, limestone sea stacks, churches and long empty roads.",
      "May, June and September are best: warm, light and calm. July belongs to Swedish holidaymakers, and early August has a busy medieval week in Visby.",
      "Hire a bicycle and head south or north to Fårö. Visby is lovely, but the island is the reason to come.",
    ],
    slowWay: { stops: ["stockholm", "visby"], text: "Train to Nynäshamn, then about three hours by ferry to Visby." },
    light: { summer: "About eighteen hours of daylight in June.", winter: "About seven hours of daylight in December." },
  },

  // Denmark
  copenhagen: {
    body: [
      "Copenhagen is flat, calm and made for cycling. People swim in the harbour, eat very well, and treat good design as normal.",
      "May to September is for the harbour baths and long evenings outside. December has markets and early dark; the rest of winter is grey and quiet.",
      "Nyhavn is crowded and expensive. Cross the water to Christianshavn or Refshaleøen, or cycle out to the beaches at Amager.",
    ],
    slowWay: { stops: ["oslo", "copenhagen"], text: "The overnight ferry from Oslo. Breakfast in the Kattegat, coffee in Copenhagen by mid-morning." },
    light: { summer: "About seventeen and a half hours of daylight at midsummer.", winter: "About seven hours of daylight in December." },
  },
  skagen: {
    body: [
      "Skagen is the northern tip of Denmark, where the Skagerrak meets the Kattegat at a long sand spit. Yellow houses, dunes, and a light the painters of the 1880s came for.",
      "May to September is best. Midsummer evenings on the beach are a Danish tradition.",
      "The town is busy with Danish holidaymakers in July. Walk out to Grenen in the early morning, or visit in June or September.",
    ],
    slowWay: { stops: ["copenhagen", "skagen"], text: "About five and a half hours by train from Copenhagen, changing in Aalborg and Frederikshavn." },
    light: { summer: "About eighteen hours of daylight in June, with light reflected off two seas.", winter: "About seven hours of daylight in December." },
  },
  funen: {
    body: [
      "Funen is Denmark's garden island: farms, castles, and small islands to the south reached by small ferries. Odense is the town in the middle.",
      "May to September is the season for cycling and island-hopping. Early summer brings strawberries and new potatoes from the farm stalls.",
      "Skip the hurry. Take a bicycle onto a ferry to Ærø or another small island and stay at least a night.",
    ],
    slowWay: { stops: ["copenhagen", "odense"], text: "About an hour and a quarter by train from Copenhagen, over the Great Belt bridge." },
    light: { summer: "About seventeen and a half hours of daylight at midsummer.", winter: "About seven hours of daylight in December." },
  },
  "faroe-islands": {
    body: [
      "The Faroes are eighteen steep, green islands in the North Atlantic, joined by tunnels, bridges and ferries. Villages of turf-roofed houses, sheep, sea cliffs and seabirds.",
      "May to August is the season: puffins, long light and the best chance of calm. The weather changes by the minute all year.",
      "Several of the famous hikes cross private land and charge a fee; respect it. Plan a spare day in case a boat or path is closed by weather.",
    ],
    slowWay: { stops: ["copenhagen", "hirtshals", "torshavn"], text: "By train to the top of Jutland, then about a day and a half on the North Atlantic ferry from Hirtshals." },
    light: { summer: "Close to twenty hours of daylight in June, and no real dark.", winter: "About five hours of daylight in December, often under cloud." },
  },

  // Finland
  helsinki: {
    body: [
      "Helsinki is a calm capital on the Baltic, with good architecture, public saunas by the sea and islands a short ferry ride from the market square.",
      "May to August brings long evenings and island trips. December has markets and dark afternoons; January and February bring ice and sauna weather.",
      "The cruise-ship crowds gather around the Senate Square and the market in summer. Go to Suomenlinna or the island saunas instead, and come back for dinner.",
    ],
    slowWay: { stops: ["stockholm", "helsinki"], text: "The overnight ferry from Stockholm, through the archipelagos at dusk. You arrive in time for breakfast." },
    light: { summer: "About nineteen hours of daylight at midsummer; the nights stay light.", winter: "About six hours of daylight in December." },
  },
  "finnish-lapland": {
    body: [
      "Finnish Lapland is forest and fells, rounded hills above the treeline. Rovaniemi sits on the Arctic Circle; Saariselkä, further north, is quieter and closer to the wilderness.",
      "From late September to March there are long nights for the aurora, and snow for skiing and sledding from about December. Early September brings ruska, the autumn colours.",
      "Rovaniemi is busy and commercial around Christmas. Spend a night there if you like, then head north to Saariselkä for space and silence.",
    ],
    slowWay: { stops: ["helsinki", "rovaniemi", "saariselka"], text: "The night train from Helsinki to Rovaniemi, then a few hours north by bus to the fells." },
    light: { summer: "Midnight sun from about late May to mid-July.", winter: "A few weeks of polar night, kaamos, around midwinter." },
  },
  lakeland: {
    body: [
      "Eastern Finland is more water than land: lakes, islands and forest, and a sauna at nearly every cabin. Savonlinna, with its medieval castle, sits between two lakes.",
      "June to August is the season, with warm water and long, light evenings. In winter the lakes freeze and become skating and skiing routes.",
      "Savonlinna fills up during its summer opera festival. Stay in a cabin on the lake rather than in town, and take the lake ferries.",
    ],
    slowWay: { stops: ["helsinki", "savonlinna"], text: "About four hours by train from Helsinki, changing at Parikkala." },
    light: { summer: "About twenty hours of daylight in June; the nights never quite darken.", winter: "Under six hours of daylight in December." },
  },
};
