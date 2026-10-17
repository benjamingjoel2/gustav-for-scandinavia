import type { BlackBookEntry } from "@/types/content";

// PLACEHOLDERS. Venue names are invented until each place is visited and verified.
// Architecture and design entries may name real public buildings, as places only, never as partners.
export const blackBook: BlackBookEntry[] = [
  // Restaurants
  { id: "kokken-norrebro", name: "Køkken Nørrebro", placeholder: true, city: "Copenhagen, Nørrebro", destinationSlug: "copenhagen", country: "denmark", theme: "restaurant", note: "Twelve tables, one short menu, and whatever the farms on Zealand sent that morning. Book the counter." },
  { id: "matsal-soder", name: "Matsal Söder", placeholder: true, city: "Stockholm, Södermalm", destinationSlug: "stockholm", country: "sweden", theme: "restaurant", note: "Swedish home cooking done carefully: meatballs, pickled herring, lingonberries. Locals come on a Tuesday." },
  { id: "kjokken-lokka", name: "Kjøkken Løkka", placeholder: true, city: "Oslo, Grünerløkka", destinationSlug: "oslo", country: "norway", theme: "restaurant", note: "A small room by the Akerselva river. Norwegian fish, mountain herbs, and a wine list with opinions." },
  { id: "sjohus-kitchen", name: "Sjøhus Kitchen", placeholder: true, city: "Bergen, Nordnes", destinationSlug: "bergen", country: "norway", theme: "restaurant", note: "Fish soup and the day's catch in an old warehouse by the water. Ask for a window when it rains, which it will." },
  { id: "hjallur-torshavn", name: "Hjallur", placeholder: true, city: "Tórshavn, Faroe Islands", destinationSlug: "faroe-islands", country: "denmark", theme: "restaurant", note: "Wind-dried lamb and fish, the way Faroese families have kept them for centuries. An acquired taste, worth acquiring." },

  // Bakeries
  { id: "bageri-nord", name: "Bageri Nord", placeholder: true, city: "Copenhagen, Vesterbro", destinationSlug: "copenhagen", country: "denmark", theme: "bakery", note: "Sourdough rye and cardamom buns from 7am. There is a queue on Saturdays; it moves." },
  { id: "bageri-vasastan", name: "Bageri Vasastan", placeholder: true, city: "Stockholm, Vasastan", destinationSlug: "stockholm", country: "sweden", theme: "bakery", note: "The place for fika: cinnamon buns, strong coffee, and a window seat to watch the street wake up." },
  { id: "bakeriet-majorstuen", name: "Bakeriet Majorstuen", placeholder: true, city: "Oslo, Majorstuen", destinationSlug: "oslo", country: "norway", theme: "bakery", note: "Skillingsboller and dark bread for the walk up to Frogner Park. Early is better." },
  { id: "leipomo-kallio", name: "Leipomo Kallio", placeholder: true, city: "Helsinki, Kallio", destinationSlug: "helsinki", country: "finland", theme: "bakery", note: "Karelian pies with egg butter, and korvapuusti still warm at eight. A neighbourhood bakery, not a destination one." },
  { id: "konditori-haga", name: "Konditori Haga", placeholder: true, city: "Gothenburg, Haga", destinationSlug: "gothenburg", country: "sweden", theme: "bakery", note: "Cinnamon buns the size of a side plate, served in a wooden-house street. Share one." },

  // Saunas
  { id: "badstue-bjorvika", name: "Badstue Bjørvika", placeholder: true, city: "Oslo, Bjørvika", destinationSlug: "oslo", country: "norway", theme: "sauna", note: "A floating public sauna on the harbour, a short walk from the Opera House. Jump into the fjord between rounds." },
  { id: "saunaklubi-ranta", name: "Saunaklubi Ranta", placeholder: true, city: "Helsinki, Hernesaari", destinationSlug: "helsinki", country: "finland", theme: "sauna", note: "A public sauna by the sea where Helsinki goes after work. Wood smoke, a ladder into the Baltic, a bowl of soup afterwards." },
  { id: "havnebad-sauna", name: "Havnebadets Sauna", placeholder: true, city: "Copenhagen, Islands Brygge", destinationSlug: "copenhagen", country: "denmark", theme: "sauna", note: "A small wooden sauna on the harbour baths. Copenhageners swim here in January and call it normal." },
  { id: "savusauna-saimaa", name: "Savusauna Saimaa", placeholder: true, city: "Savonlinna, Lake Saimaa", destinationSlug: "lakeland", country: "finland", theme: "sauna", note: "A smoke sauna heated for most of the day, then a swim in the lake. Finns consider this the real thing." },
  { id: "tunturisauna", name: "Tunturisauna", placeholder: true, city: "Saariselkä, Finnish Lapland", destinationSlug: "finnish-lapland", country: "finland", theme: "sauna", note: "Heat, then a roll in the snow under a dark sky. If the aurora comes, you will see it from the bench outside." },

  // Design
  { id: "form-og-brug", name: "Form og Brug", placeholder: true, city: "Copenhagen, Indre By", destinationSlug: "copenhagen", country: "denmark", theme: "design", note: "Vintage Danish furniture and lamps, restored with care. They ship, so the chair can follow you home." },
  { id: "form-sodermalm", name: "Formrum Söder", placeholder: true, city: "Stockholm, Södermalm", destinationSlug: "stockholm", country: "sweden", theme: "design", note: "Swedish glass, textiles and ceramics from small studios. Everything here is meant to be used." },
  { id: "muotoilu-punavuori", name: "Muotoilutalo Punavuori", placeholder: true, city: "Helsinki, Design District", destinationSlug: "helsinki", country: "finland", theme: "design", note: "Finnish design, old and new, in a quiet street of the Design District. Good for a single, well-chosen thing." },
  { id: "brukskunst-oslo", name: "Brukskunst Oslo", placeholder: true, city: "Oslo, St. Hanshaugen", destinationSlug: "oslo", country: "norway", theme: "design", note: "Wool blankets, wooden bowls and Norwegian ceramics. The owners know who made each piece." },
  { id: "hantverk-gbg", name: "Hantverkshuset", placeholder: true, city: "Gothenburg, Linnéstaden", destinationSlug: "gothenburg", country: "sweden", theme: "design", note: "A collective of local makers sharing one shop. Linen, silver, and the occasional chair." },

  // Architecture
  { id: "oslo-opera-roof", name: "Oslo Opera House roof walk", placeholder: true, city: "Oslo, Bjørvika", destinationSlug: "oslo", country: "norway", theme: "architecture", note: "A public building you are allowed to walk on. Go at sunset and sit on the marble with half of Oslo." },
  { id: "kamppi-chapel", name: "Kamppi Chapel of Silence", placeholder: true, city: "Helsinki, Kamppi", destinationSlug: "helsinki", country: "finland", theme: "architecture", note: "A curved wooden room in the busiest square in the city. Nothing happens inside, which is the point." },
  { id: "stockholm-city-library", name: "Stockholm Public Library", placeholder: true, city: "Stockholm, Vasastan", destinationSlug: "stockholm", country: "sweden", theme: "architecture", note: "Asplund's round reading room, books on every wall. Free to enter and quietly busy." },
  { id: "black-diamond", name: "The Royal Library, Black Diamond", placeholder: true, city: "Copenhagen, Slotsholmen", destinationSlug: "copenhagen", country: "denmark", theme: "architecture", note: "Black granite and glass leaning over the harbour. The atrium is open to all; bring a book." },
  { id: "bryggen-walk", name: "Bryggen", placeholder: true, city: "Bergen, Bryggen", destinationSlug: "bergen", country: "norway", theme: "architecture", note: "The old wooden wharf, crooked and still standing. Walk the narrow passages behind the facades early, before the tour groups." },

  // Cabins
  { id: "rorbu-henningsvaer", name: "Rorbu Henningsvær", placeholder: true, city: "Henningsvær, Lofoten", destinationSlug: "lofoten", country: "norway", theme: "cabin", note: "A red fisherman's cabin on stilts over the water. In summer the sun circles above the peaks all night." },
  { id: "stuga-abisko", name: "Fjällstuga Abisko", placeholder: true, city: "Abisko, Swedish Lapland", destinationSlug: "swedish-lapland", country: "sweden", theme: "cabin", note: "A simple wooden cabin at the edge of the national park. Wood stove, skis by the door, a clear view north." },
  { id: "kota-saariselka", name: "Kelo Kota", placeholder: true, city: "Saariselkä, Finnish Lapland", destinationSlug: "finnish-lapland", country: "finland", theme: "cabin", note: "A log cabin among the fells, with its own sauna. Quiet enough to hear the snow settle." },
  { id: "mokki-saimaa", name: "Mökki Saimaa", placeholder: true, city: "Lake Saimaa, Lakeland", destinationSlug: "lakeland", country: "finland", theme: "cabin", note: "A lakeside mökki with a rowing boat and a jetty. Finns spend their summers like this, and they have a point." },
  { id: "hytte-kvaloya", name: "Hytte Kvaløya", placeholder: true, city: "Kvaløya, near Tromsø", destinationSlug: "tromso", country: "norway", theme: "cabin", note: "A cabin on the island west of the city, away from street lights. A good place to wait for the aurora." },

  // Islands
  { id: "skargardsbrygga", name: "Skärgårdskaféet", placeholder: true, city: "Stockholm archipelago, Utö", destinationSlug: "stockholm", country: "sweden", theme: "island", note: "A ferry-only island with one café, bicycles to rent and smooth rocks to swim from. Take the early boat." },
  { id: "faro-gotland", name: "Fårö", placeholder: true, city: "Fårö, Gotland", destinationSlug: "gotland", country: "sweden", theme: "island", note: "A short car ferry from Gotland to limestone sea stacks, empty beaches and one or two places for lunch." },
  { id: "suomenlinna", name: "Suomenlinna", placeholder: true, city: "Helsinki, Suomenlinna", destinationSlug: "helsinki", country: "finland", theme: "island", note: "A sea fortress fifteen minutes from the market square by public ferry. Bring a picnic and stay for the evening light." },
  { id: "vrango", name: "Vrångö", placeholder: true, city: "Gothenburg, southern archipelago", destinationSlug: "gothenburg", country: "sweden", theme: "island", note: "Car-free, at the far end of the tram-and-ferry line. Granite skerries, a nature trail and a small harbour kiosk." },
  { id: "mykines", name: "Mykines", placeholder: true, city: "Mykines, Faroe Islands", destinationSlug: "faroe-islands", country: "denmark", theme: "island", note: "Puffins in summer, a village of a few houses, and a ferry that runs when the sea allows. Plan a spare day." },

  // Galleries
  { id: "galleri-lys-skagen", name: "Galleri Lys", placeholder: true, city: "Skagen, Gammel Skagen", destinationSlug: "skagen", country: "denmark", theme: "gallery", note: "A small gallery for painters who still come for the light. Walk to the beach afterwards and see what they meant." },
  { id: "galleri-nordlys", name: "Galleri Nordlys", placeholder: true, city: "Tromsø, Sentrum", destinationSlug: "tromso", country: "norway", theme: "gallery", note: "Northern artists, Sámi craft and photography in an old timber house. A good hour on a dark afternoon." },
  { id: "kunsthal-vesterbro", name: "Kunsthal Vesterbro", placeholder: true, city: "Copenhagen, Vesterbro", destinationSlug: "copenhagen", country: "denmark", theme: "gallery", note: "Contemporary work in a former meatpacking hall. Free most days, and the bar next door is good." },
  { id: "konsthall-skeppsholmen", name: "Konsthall Skeppsholmen", placeholder: true, city: "Stockholm, Skeppsholmen", destinationSlug: "stockholm", country: "sweden", theme: "gallery", note: "A small exhibition space on the museum island. Combine it with a walk along the water to Moderna Museet." },
  { id: "galleri-henningsvaer", name: "Galleri Havgap", placeholder: true, city: "Henningsvær, Lofoten", destinationSlug: "lofoten", country: "norway", theme: "gallery", note: "Paintings of the islands, in the islands. The fishing village outside the window does most of the work." },
];
