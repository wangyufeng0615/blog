const SATELLITE_TILES =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

const COPY = {
  zh: {
    skip: "跳到路线正文", navRoute: "路线", navQuote: "原书", navMethod: "考据",
    mapLoading: "正在加载卫星影像…", mapErrorTitle: "卫星图暂时无法加载", mapErrorBody: "路线和文字仍可阅读；联网后刷新即可恢复底图。",
    legendRoute: "凯斯夫妇的主路线", legendRelated: "书中相关地点", legendHistory: "转述的历史事件", legendApprox: "虚线与菱形为复原",
    prologue: "序章", epilogue: "尾声", heroAltTitle: "Land Below the Wind", heroTitle: "风下之乡",
    heroDeck: "1938 年，作家阿格尼丝·凯斯随从事林务工作的丈夫哈里·凯斯，进入英属北婆罗洲东南部的河流与雨林。",
    heroNote: "他们从山打根（Sandakan）沿海岸南下至斗湖（Tawau），在卡拉巴坎（Kalabakan）换乘独木舟，逆流翻越分水岭，最后顺夸穆特河（Kuamut）与京那巴当岸河（Kinabatangan River）回到海上。", scrollCue: "向下滚动，每个章节会完整吸附到位。", startRoute: "沿路线出发",
    homeLabel: "山打根", homeTitle: "从 Newlands 离开", homeDate: "1938 年 6 月初",
    homeBody1: "山打根山坡上的 Newlands 是凯斯夫妇生活、写作和林务工作的基地。远征计划曾三次搁置，其中两次是暴雨令河道无法通航；真正出发时，Agnes 仍在发烧，却知道这次再回到花园小径时，身体与记忆都将不同。",
    homeBody2: "今天的 Agnes Keith House 是 1946—47 年战后重建的房屋。它提供可靠的空间锚点，却不应被误读为 1938 年原屋完整保存至今。",
    homeQuote: "“下一次再走上这条花园小径时……心里装满了我想要回味留恋的各种记忆。”",
    homeQuoteSource: "2016 中译本 · 短引",
    homeSource: "来源：Sabah Museum · 1939 初版背景", homeEvidence: "地点锚点｜Newlands 现址可确认；今天的建筑是战后重建。",
    coastLabel: "海岸南下", coastTitle: "Tawau 会合，驶向 Sebatik", coastDate: "远征第一程",
    coastBody1: "他们在 Tawau 与石油公司地质学家 Winki 会合，随后乘一艘挂着黑黄船帆的 bagong 驶往 Sebatik。城里穿的鞋袜被塞进船底，赤脚反倒更适合这段水路。",
    coastBody2: "Winki 要继续钻探试油孔，Harry 则收集树木标本。营地里，他们用立体镜看航拍照片：原本像鱼子酱和小虫的纹理忽然变成树冠、深林与河道。借来的轻帐篷和第一杯浓咖啡，也把日常生活推向了野外。",
    coastQuote: "“我们把鞋袜脱掉，摊在船板上，舒服地光着脚。”",
    coastQuoteSource: "2016 中译本 · 短引",
    coastSource: "原书剧情线索", coastEvidence: "空间精度｜Sebatik 营地的精确位置未找到，暂以 Wallace Bay 作为范围锚点。",
    kalabakanLabel: "进入河网", kalabakanTitle: "从海船换进 perahu",
    kalabakanBody1: "到了 Kalabakang，旅行工具彻底改变：队伍改乘当地制造的 perahu。船身约二十英尺长、底部浑圆，只容一人纵向坐下；行李必须精确码放以维持平衡，人的舒适从一开始就不在考虑范围内。",
    kalabakanBody2: "标本标签把 6 月 3 日钉在这里。旧拼法 Kalabakang 与现代 Kalabakan 指向同一河口，也标志着海岸航行转入内陆河网。",
    kalabakanQuote: "“大多数时候，我们蹲在船舱底部，蜷缩在行李中间……屁股一直泡在永远湿漉漉的船舱里。”",
    kalabakanQuoteSource: "2016 中译本 · 短引",
    kalabakanSource: "原书剧情线索 · 标本日期链",
    tiagauLabel: "逆流而上", tiagauTitle: "雨、急流与湿透的帐篷",
    tiagauBody1: "雨几乎每天午后准时到来，帐篷还没从前一夜干透，下一场雨已经开始。Agnes 把等待搭营的自己比成一尊被小心搬进搬出的瓷观音；真正能让身体重新运转的，只是干衣服、热咖啡和一双干袜子。",
    tiagauBody2: "急流处，船夫有时从岸边拖船，乘客则爬过湿滑岩石；Unggib 甚至叼着点燃的烟斗游在船旁。到 Ulu Tiagau，水路逐渐让位给徒步。",
    tiagauQuote: "“三点扎营，从中午开始瓢泼大雨。太累了，不写了。”",
    tiagauQuoteSource: "2016 中译本 · 短引",
    tiagauSource: "原书剧情线索", tiagauEvidence: "地名对应｜Tiaggau 即 Tiagau；河口可定位，Pengkalan 沿河段为复原。",
    floodLabel: "洪水来临", floodTitle: "河流决定能否继续", floodDate: "Tiagau 上游",
    floodBody1: "Puasa 反复警告洪水风险。船队一面前行，一面把对洪水的担忧唱进节奏里；这不是背景气候，而是随时可能改变路线和时间的力量。",
    floodBody2: "水真正涨起来时，人们把帐篷、帐杆和那把醒目的蓝伞托在水面上。重新上路后，他们又接连闯过六道长急流；船夫在旋涡里推、拉、游、撑，每过一道，队伍都要靠岸把进水的船清空。",
    floodQuote: "“船一直在进水，每过一次急流，我们都得把它推到岸边去清空一次。”",
    floodQuoteSource: "2016 中译本 · 短引",
    floodSource: "原书剧情线索",
    biyudunLabel: "越过分水岭", biyudunTitle: "Biyudun：水蛭与丛林泥",
    biyudunBody1: "在 Biyudun 河谷，水蛭并不遵守“只到膝盖以下”的经验规则。不断检查皮肤、处理伤口和保持衣物，成了与找路同样实际的工作。",
    biyudunBody2: "他们有时让行李走水路，自己穿过丛林。Agnes 越来越疲惫，跌进泥里时甚至感到生理性的厌恶；夜里听雨，她又从 Harry 的强壮与自己的柔弱中重新理解了这段共同承担的旅程。",
    biyudunQuote: "“不过无论如何，我走过来了……这些，兴许比橡胶束身衣要珍贵呢……”",
    biyudunQuoteSource: "2016 中译本 · 短引",
    biyudunSource: "原书剧情线索 · 标本日期链", biyudunEvidence: "空间精度｜标本地名与日期可以核对，现代河道和具体坐标仍属复原。",
    napagunLabel: "最不确定的一段", napagunTitle: "从 Middle Napagun 到河口",
    napagunBody1: "水蛭伤口持续流血，衣服又无法在雨里晾干。Agnes 把旅程写成意志与身体之间的拉扯：精神仍想前进，身体却一次次滑倒在湿岩和泥地里。",
    napagunBody2: "标本标签给出 Middle Napagun 与 Kuala Napagun 的日期，却没有留下足以精确落点的现代坐标。因此这里让路线继续前进，同时保留虚线和菱形的疑问。",
    napagunSource: "原书剧情线索 · 标本日期链", napagunEvidence: "证据边界｜Middle / Kuala Napagun 的日期可核对，坐标按河网关系复原。",
    kuamutLabel: "进入大河", kuamutTitle: "激流之后，Kuala Kuamut", kuamutDate: "1938 年 6 月 18 日以后",
    kuamutBody1: "急流把细长的 perahu 埋进白沫里，船不再只是交通工具，而像在水里挣扎的东西。到 Kuala Kuamut，治安官用仪式迎接他们，并把平日断案的公署让作住处；这里终于再次像一个码头和村落。",
    kuamutBody2: "离开时，Agnes 刚换上最后一套干净衣服，便从松动的独木板上掉进齐膝的泥里。这个狼狈的瞬间之后，复原路线却重新获得明确汇流点：他们将进入更宽阔的 Kinabatangan。",
    kuamutQuote: "“经历了夸马特河的壮美，京那巴当岸河的下游便显得闷热、缓慢而泥泞。”",
    kuamutQuoteSource: "2016 中译本 · 短引",
    kuamutSource: "原书剧情线索",
    returnLabel: "顺流回海", returnTitle: "错过接驳船，再见到海", returnDate: "1938 年 6 月下旬",
    returnBody1: "洪水扰乱了接驳：宾达山（Bintasan）的预定汽船三天前已经来过，又因无法确定等待多久而离开。雨夜里，他们只得向当地人借宿；第二天在拉马（Lamag）一带，泥岸上的鳄鱼又把注意力拉回眼前的河流。",
    returnBody2: "他们终于见到小文的摩托艇，后面一字拖着九只 perahu，像水牛尾巴。船夫们高举船桨欢呼，水从衣服和笑脸上流下；再顺 Kinabatangan 驶入 Sulu Sea，海才真正把他们送回 Sandakan。",
    returnSource: "原书剧情线索",
    relatedLabel: "路线之外的书中世界", relatedTitle: "四个地方，不在 1938 年路线上，却属于《风下之乡》",
    relatedBody: "凯斯夫妇的横穿只是这片土地上众多故事中的一条线。阿拜连接 1935 年的电影探险，仙本那与拿笃连接东岸人物和航路；利尼迪斯则把 1938 年旅程拉回 1890 年一场被殖民报复放大的惨剧。",
    relatedQuote: "“这故事太可怕了。”我说。哈里答：“可正是因为这样的故事，你和我今天才敢在河上旅行。”",
    relatedQuoteSource: "2016 中译本 · 短引",
    relatedEvidence: "图层说明｜相关地点与历史地点始终可见，但不计入 1938 年主路线。", fieldNotes: "田野记录 · 1938",
    readingLead: "原书细读 · 1939 年版", readingTitle: "地图之外，旅程如何被身体记住",
    readingIntro: "以下内容按情节顺序细致转述，正文不复制长段原文。",
    illustrationRights: "引文与插画取自 2016 年生活·读书·新知三联书店中文版，用于非商业文学与历史研究；相关著作权归原作者、译者及出版方等权利人所有。",
    reading1Title: "出发先意味着更换生活方式", reading1Body: "在 Tawau 与 Winki 会合以后，bagong 的黑黄船帆、塞进船底的鞋袜、借来的轻帐篷和一杯营地咖啡，共同标记了日常秩序的退场。到了 Kalabakang，圆底 perahu 又进一步缩小了人的活动空间：每个人纵向坐定，随时舀出船底渗水。",
    reading2Title: "雨水把时间改写成等待", reading2Body: "雨往往在午后到来，帐篷和衣物来不及干透，下一轮潮湿已经开始。急流迫使船夫下水、从岸边拖船；洪水真正升起时，帐篷、杆件和蓝伞都被托在水面上，队伍只能先服从河流，再谈行程。",
    reading3Title: "地图距离与身体距离逐渐分离", reading3Body: "水蛭越过膝盖，伤口在湿衣服下持续渗血；泥、湿岩和反复跌倒把意志消耗成一项具体的身体问题。Agnes 仍然想前进，身体却一次次要求停下。Biyudun 与 Napagun 的短线段因此不能只被读成几公里。",
    reading4Title: "河流最后把他们交还给海", reading4Body: "细长 perahu 在白沫里像被水吞没，到了 Kuala Kuamut，问题才从闯过急流转成组织船只与接驳。洪水又让预定汽船失约。直到 Lamag 一带重新见到汽船，并从 Kinabatangan 驶入苏禄海，旅程才从紧绷的河道重新打开。",
    illustration1Alt: "独木舟上的船夫", illustration1Caption: "独木舟上的船夫｜原书插画，随第十二章《一把蓝雨伞》",
    illustration2Alt: "暴雨中的帐篷营地", illustration2Caption: "雨夜营地｜原书插画",
    illustration3Alt: "队伍穿过茂密的热带雨林", illustration3Caption: "雨林中的队伍｜原书插画，随第十三章《丛林中的泥泞》",
    illustration4Alt: "船夫在急流中拖起独木舟", illustration4Caption: "船夫从急流中拖起 perahu｜原书插画",
    illustration5Alt: "小船载着探险者沿河归来", illustration5Caption: "探险者归来｜原书插画，随第十四章",
    methodLead: "这是一条证据链，也是一张仍可修订的地图。", methodTitle: "路线如何被重建",
    method1Title: "原书与版本", method1Body: "1939 年初版书目明确记载环衬上附有地图；可检索正文用于核对行程场景与旧地名。页面保留两处极短英文原句，并从 2016 中文版选取八则短引；其余剧情均用自己的话转述。五幅插画取自同一版本，并放回对应的情节段落。",
    method2Title: "植物标本标签", method2Body: "Harry G. Keith 采集的标本，把 6 月 3 日至 18 日的一串地名与日期钉在同一条时间线上。",
    method3Title: "历史地名与现代坐标", method3Body: "Sabah Gazetteer、现代地名库与河网用于转换旧拼法。缺少精确证据的点只给复原范围，不伪装成确定坐标。",
    mainRoute: "主路线", placeLedgerLead: "完整地点档案", placeLedgerTitle: "所有点位直接展开",
    placeLedgerIntro: "主路线、书中相关地点与历史事件集中列在这里；日期、证据、坐标与确定性无需点击地图即可阅读。",
    categoryRoute: "1938 年主路线", categoryRelated: "书中相关地点", categoryHistory: "转述的历史事件", certaintyLocated: "可定位", certaintyApprox: "复原范围",
    uncertaintyTitle: "阅读地图时请留意",
    uncertaintyBody: "海上连接线和若干内陆节点是研究性复原，用于表达行程顺序，并不等于 GPS 轨迹。每个点的日期、地名对应与确定性都已在上方档案中展开。",
    footerTitle: "风下之乡 · 路线重建", footerIntro: "为文学、旅行与历史阅读制作的非商业研究页面。", sourceEdition: "1939 初版书目", sourceText: "原书正文检索", sourceIllustrations: "作者自绘插画书目",
    mapCredit: "卫星影像：Esri, Vantor, Earthstar Geographics, and the GIS User Community · 地图渲染：MapLibre GL JS"
  },
  en: {
    skip: "Skip to the route", navRoute: "Route", navQuote: "Book", navMethod: "Research",
    mapLoading: "Loading satellite imagery…", mapErrorTitle: "Satellite imagery is temporarily unavailable", mapErrorBody: "The route and story remain readable. Reconnect and refresh to restore the basemap.",
    legendRoute: "The Keiths’ main route", legendRelated: "Other places in the book", legendHistory: "Retold historical events", legendApprox: "Dashed lines and diamonds are reconstructed",
    prologue: "Prologue", epilogue: "Epilogue", heroAltTitle: "风下之乡", heroTitle: "Land Below the Wind",
    heroDeck: "In 1938, writer Agnes Newton Keith joined her husband Harry, who worked in forestry, on a journey into the rivers and rainforest of southeastern British North Borneo.",
    heroNote: "From Sandakan they sailed south to Tawau, changed to dugout canoes at Kalabakan and travelled upstream. After crossing the watershed, they descended the Kuamut and Kinabatangan to the sea.",
    scrollCue: "Scroll down. Each chapter will snap fully into place.",
    homeLabel: "Sandakan", homeTitle: "Leaving Newlands", homeDate: "Early June 1938",
    homeBody1: "Newlands, on the hill above Sandakan, was the Keiths’ base for domestic life, writing and forestry work. The expedition had already been postponed three times—twice because rain made the rivers impassable. When Agnes finally left, she was still feverish and knew that both body and memory would be altered before she walked up the garden path again.",
    homeBody2: "Today’s Agnes Keith House was rebuilt in 1946–47 after the war. It is a dependable geographical anchor, but should not be read as the intact house of 1938.",
    homeQuote: "“When I next walked up this garden path … my mind would hold all the memories I wanted to linger over.”",
    homeQuoteSource: "New rendering from the 2016 Chinese edition",
    homeSource: "Sources: Sabah Museum · context from the 1939 edition", homeEvidence: "Place anchor | Newlands can be located; the present house is a post-war reconstruction.",
    coastLabel: "Tawau — Sebatik Island", coastTitle: "Meeting at Tawau, sailing to Sebatik", coastDate: "The expedition’s first stage",
    coastBody1: "At Tawau they met Winki, a geologist for the oil company, then sailed for Sebatik in a bagong carrying a black-and-yellow sail. City shoes and socks went into the bottom of the boat; bare feet suited the water better.",
    coastBody2: "Winki planned more oil-test holes while Harry collected tree specimens. Through a stereoscope, aerial photographs that first resembled caviar and insects suddenly became treetops, deep forest and river channels. A light tent borrowed from the Medical Department—and the first strong camp coffee—completed the shift from domestic routine to field life.",
    coastQuote: "“We took off our shoes and socks, spread them on the deck, and settled comfortably into bare feet.”",
    coastQuoteSource: "New rendering from the 2016 Chinese edition",
    coastSource: "Narrative evidence from the book", coastEvidence: "Spatial precision | The Sebatik camp has not been precisely located; Wallace Bay is used as an area anchor.",
    kalabakanLabel: "Kalabakan", kalabakanTitle: "Trading the sea boat for a perahu",
    kalabakanBody1: "At Kalabakang the means of travel changed completely. The party transferred to locally made perahus: roughly twenty feet long, round-bottomed and only one person wide. Baskets had to be placed precisely to preserve balance; human comfort was never part of the calculation.",
    kalabakanBody2: "A specimen label fixes 3 June to this place. The older Kalabakang and modern Kalabakan identify the same river mouth, where coastal travel gave way to an inland river network.",
    kalabakanQuote: "“Most of the time we crouched in the bottom, folded among the luggage … sitting in the water that forever wetted the boat.”",
    kalabakanQuoteSource: "New rendering from the 2016 Chinese edition",
    kalabakanSource: "Narrative evidence from the book · specimen-date sequence",
    tiagauLabel: "Tiagau River", tiagauTitle: "Rain, rapids and a soaking tent",
    tiagauBody1: "Rain arrived almost every afternoon. Agnes compared herself, waiting to be lifted from the perahu into camp, to a porcelain goddess being unpacked and set upon a stand. Dry clothes, hot coffee and dry socks could be enough to make the body function again.",
    tiagauBody2: "At the rapids the men sometimes hauled the boat from shore while passengers climbed over wet rocks; Unggib even swam beside the perahu with his pipe still alight. Near Ulu Tiagau, water travel began to yield to walking.",
    tiagauQuote: "“Camped at three. Torrential rain since noon. Too tired to write.”",
    tiagauQuoteSource: "New rendering from the 2016 Chinese edition",
    tiagauSource: "Narrative evidence from the book", tiagauEvidence: "Place-name match | Tiaggau is Tiagau; the mouth is located, while Pengkalan is reconstructed along the river reach.",
    floodLabel: "Upper Tiagau", floodTitle: "The river decides whether travel continues", floodDate: "Upper Tiagau",
    floodBody1: "Puasa repeatedly warned of floodwater. The boat party travelled while turning that anxiety into rhythm and song: weather was not scenery here, but a force able to rewrite both route and schedule.",
    floodBody2: "When the water rose, the men carried the tent, poles and a conspicuous blue umbrella above the surface. Once moving again, they met six long rapids in succession. The boatmen swam, shoved, hauled and poled through the eddies; after every rapid the party had to beach a perahu and empty it.",
    floodQuote: "“The boat kept filling; after every rapid we had to push it ashore and empty it.”",
    floodQuoteSource: "New rendering from the 2016 Chinese edition",
    floodSource: "Narrative evidence from the book",
    biyudunLabel: "Hulu Biyudun River", biyudunTitle: "Biyudun: leeches and jungle mud",
    biyudunBody1: "In the Biyudun valley the leeches ignored the comforting rule that they stayed below the knee. Checking skin, tending bites and managing clothing became work as practical as finding the route.",
    biyudunBody2: "Sometimes the luggage went by boat while the travellers crossed the jungle. Agnes grew steadily more exhausted; falling into the mud produced something close to physical nausea. Listening to the rain at night, she understood Harry’s strength and her own vulnerability as burdens the marriage carried together.",
    biyudunQuote: "“But however badly, I had come through … perhaps what I gained was more precious than a rubber girdle.”",
    biyudunQuoteSource: "New rendering from the 2016 Chinese edition",
    biyudunSource: "Narrative evidence from the book · specimen-date sequence", biyudunEvidence: "Spatial precision | The specimen name and dates are verifiable; the modern channel and exact coordinates remain reconstructed.",
    napagunLabel: "Middle Napagun — Kuala Napagun", napagunTitle: "From Middle Napagun to its mouth",
    napagunBody1: "Leech bites kept bleeding, while clothes could not be dried in the rain. Agnes framed the journey as a struggle between intention and the body: the will continued, while feet slipped again and again on wet rock and mud.",
    napagunBody2: "Specimen labels provide dates for Middle Napagun and Kuala Napagun, but not enough evidence for precise modern coordinates. The route therefore advances while its dashed line and diamond markers keep the uncertainty visible.",
    napagunSource: "Narrative evidence from the book · specimen-date sequence", napagunEvidence: "Evidence boundary | Dates for Middle and Kuala Napagun can be checked; their coordinates follow a river-network reconstruction.",
    kuamutLabel: "Kuamut River", kuamutTitle: "After the rapids, Kuala Kuamut", kuamutDate: "After 18 June 1938",
    kuamutBody1: "White water buried the narrow perahus in foam until the boats seemed to struggle in the river. At Kuala Kuamut the native chief greeted them ceremonially and offered the government office—normally a place for hearing disputes—as lodging. A recognisable jetty and settlement had finally returned.",
    kuamutBody2: "On departure Agnes put on her last clean clothes, then stepped onto a loose plank and fell knee-deep into mud. Beyond that comic humiliation, the reconstructed route regained a firm confluence: the narrow Kuamut would give way to the broader Kinabatangan.",
    kuamutQuote: "“After the majesty of the Kuamut, the lower Kinabatangan seemed hot, slow and muddy.”",
    kuamutQuoteSource: "New rendering from the 2016 Chinese edition",
    kuamutSource: "Narrative evidence from the book",
    returnLabel: "Kinabatangan River — Sulu Sea", returnTitle: "Missing the launch, finding the sea", returnDate: "Late June 1938",
    returnBody1: "Floodwater disrupted the rendezvous: the launch expected at Bintasan had arrived three days earlier and left because no one knew how long it would have to wait. After borrowing shelter for the rainy night, they encountered a crocodile on a mudbank near Lamag, and the immediate river displaced thoughts of home once again.",
    returnBody2: "At last Winki’s motor launch appeared, towing nine perahus in a line like a water buffalo’s tail. The boatmen raised their paddles and shouted as water ran down their clothes and laughing faces. Only when the Kinabatangan opened into the Sulu Sea did the sea truly carry them back to Sandakan.",
    returnSource: "Narrative evidence from the book",
    relatedLabel: "The book’s world beyond the route", relatedTitle: "Four places outside the 1938 route, yet part of Land Below the Wind",
    relatedBody: "The Keiths’ crossing was only one thread in a landscape full of stories. Abai connects to the Johnsons’ 1935 film expedition; Semporna and Lahad Datu hold the east coast’s people and sea routes. Linidis pulls the 1938 journey back toward an 1890 killing magnified by colonial retaliation.",
    relatedQuote: "“It is a terrible story,” I said. Harry answered, “Yet it is because of stories like this that you and I can travel safely on the river today.”",
    relatedQuoteSource: "New rendering from the 2016 Chinese edition",
    relatedAbaiTitle: "Abai / Johnsonville", relatedAbaiBody: "The Johnsons’ 1935 wildlife-filming camp—another expedition altogether.",
    relatedSempornaTitle: "Semporna", relatedSempornaBody: "An east-coast town where people and coastal stories in the book converge.",
    relatedLahadTitle: "Lahad Datu", relatedLahadBody: "An east-coast reference point in the book’s map and coastal narrative.",
    relatedLinidisTitle: "Linidis", relatedLinidisBody: "The 1890 Walter Flint episode retold in the book: an echo from the past.",
    relatedEvidence: "Yellow dots mark other places in the book; green dots mark historical events. Neither counts toward the 1938 main route.", fieldNotes: "Field notes · 1938",
    notesLabel: "Map notes", notesTitle: "The route and places at a glance",
    notesRouteTitle: "The 1938 main route", notesRelatedTitle: "Beyond the route", notesSourcesTitle: "Sources", notesRightsTitle: "Quotation and illustration rights",
    notesRightsBody: "Eight brief translated excerpts and five author-drawn illustrations come from the 2016 SDX Joint Publishing Chinese edition. English excerpt text on this page is newly rendered from that edition. They are presented for non-commercial literary and historical research; copyright remains with the relevant authors, translators and publishers.",
    readingLead: "Close reading · 1939 edition", readingTitle: "Beyond the map, how the body remembers the journey",
    readingIntro: "These passages closely paraphrase the plot in sequence; no long passage is reproduced here.",
    illustrationRights: "Quotations and illustrations come from the 2016 SDX Joint Publishing Chinese edition and are presented for non-commercial literary and historical research. Copyright remains with the relevant authors, translators and publishers.",
    reading1Title: "Departure first meant changing how one lived", reading1Body: "After meeting Winki at Tawau, the bagong’s black-and-yellow sail, shoes and socks stowed in the bilge, a borrowed light tent and a cup of camp coffee all marked domestic order receding. At Kalabakang the round-bottomed perahu narrowed life again: everyone sat in line and kept bailing the water that seeped in.",
    reading2Title: "Rain rewrote time as waiting", reading2Body: "Rain often arrived in the afternoon; tent and clothing could not dry before the next wet cycle began. Rapids forced boatmen into the water or onto the bank to haul the craft. When the flood rose, tent, poles and blue umbrella were held above the surface. The party first had to obey the river, then speak of an itinerary.",
    reading3Title: "Map distance and bodily distance separated", reading3Body: "Leeches climbed above the knee and bites kept bleeding beneath wet clothes. Mud, slick rock and repeated falls turned willpower into a concrete bodily problem. Agnes still intended to advance; her body repeatedly demanded a halt. The short lines between Biyudun and Napagun cannot be read as kilometres alone.",
    reading4Title: "The river finally returned them to the sea", reading4Body: "Narrow perahus vanished into white foam. At Kuala Kuamut the problem shifted from surviving rapids to organising boats and a rendezvous, which floodwater then disrupted. Only after seeing the launch near Lamag and moving from the Kinabatangan into the Sulu Sea did the journey open out from the river’s tension.",
    illustration1Alt: "A boatman standing in a perahu", illustration1Caption: "Boatman in a perahu | Illustration from the book, opening Chapter 12, ‘A Blue Umbrella’",
    illustration2Alt: "A tent camp under driving rain", illustration2Caption: "Camp in the rain | Illustration from the book",
    illustration3Alt: "A party crossing dense tropical rainforest", illustration3Caption: "The party in the rainforest | Illustration from the book, opening Chapter 13",
    illustration4Alt: "Boatmen hauling a perahu through rapids", illustration4Caption: "Boatmen hauling a perahu through rapids | Illustration from the book",
    illustration5Alt: "Travellers returning by river boat", illustration5Caption: "The explorers return | Illustration from the book, opening Chapter 14",
    methodLead: "This is an evidence chain—and a map that can still be revised.", methodTitle: "How the route was reconstructed",
    method1Title: "The book and its editions", method1Body: "The catalogue record for the 1939 first edition explicitly notes a map on the lining papers. Searchable text was used to verify scenes and historical spellings. The page retains two very short verified English quotations and adds eight brief excerpts from the 2016 Chinese edition; their English text here is newly rendered from that edition. All other plot material is paraphrased. Five illustrations from the same edition return to the scenes they depict.",
    method2Title: "Herbarium specimen labels", method2Body: "Specimens collected by Harry G. Keith pin a sequence of place names and dates, from 3 to 18 June, onto a single timeline.",
    method3Title: "Historical names and modern coordinates", method3Body: "A Sabah Gazetteer, modern gazetteers and river networks help reconcile older spellings. Where precise evidence is missing, the map shows a reconstructed area rather than pretending to know an exact coordinate.",
    mainRoute: "Main route", placeLedgerLead: "Complete place ledger", placeLedgerTitle: "Every point, already open",
    placeLedgerIntro: "Main-route stops, related places and historical events are gathered here. Dates, evidence, coordinates and certainty can be read without touching the map.",
    categoryRoute: "1938 main route", categoryRelated: "Other places in the book", categoryHistory: "Retold historical event", certaintyLocated: "Located", certaintyApprox: "Reconstructed area",
    uncertaintyTitle: "A note on reading this map",
    uncertaintyBody: "The sea connections and several inland points are research reconstructions that express the order of travel, not a GPS track. Dashed lines and diamond markers keep that uncertainty visible.",
    evidenceBookLabel: "Evidence · I", evidenceBookTitle: "The book, its editions and illustrations",
    evidenceBookBody1: "The catalogue record for the 1939 first edition explicitly notes a map on the lining papers. The text, index and searchable pages were used to check the sequence of travel and historical spellings. Two verified English quotations and eight brief excerpts from the supplied Chinese scan are clearly distinguished from the surrounding paraphrase.",
    evidenceBookBody2: "Five illustrations come from the user-supplied 2016 Chinese scan. Instead of forming a separate gallery, they return to the moments they depict: the perahu, the rain camp, the rapids, the rainforest and the journey home.",
    evidenceCoordinatesLabel: "Evidence · II", evidenceCoordinatesTitle: "The dates emerged before the coordinates",
    evidenceCoordinatesBody1: "Plant specimens collected by Harry G. Keith pin a sequence of names and dates, from 3 to 18 June, onto a single timeline. What reads as continuous experience in the book gains several independent temporal anchors from the specimen labels.",
    evidenceCoordinatesBody2: "A Sabah Gazetteer, modern place-name databases and the river network were used to reconcile historical spellings. River mouths and surviving towns can be anchored directly; inland nodes without precise evidence are shown only as reconstructed areas.",
    ledgerCoastLabel: "Place ledger · Coast", ledgerCoastTitle: "From Sandakan to Kalabakan",
    ledgerWatershedLabel: "Place ledger · Watershed", ledgerWatershedTitle: "From Pengkalan to Middle Napagun",
    ledgerRiverLabel: "Place ledger · Downriver", ledgerRiverTitle: "From Kuala Napagun to the Sulu Sea",
    ledgerRelatedLabel: "Place ledger · Related narratives", ledgerRelatedTitle: "Four places outside the 1938 main route",
    sourcesLabel: "Sources and limits", sourcesTitle: "A literary map that remains open to revision",
    sourcesBody: "This page was made for literary, travel and historical reading. Its lines express the itinerary currently supported by the evidence; they should be revised whenever better maps, specimen labels or edition evidence appears.",
    sourceEdition: "Catalogue record for the 1939 first edition", sourceText: "Search the book text", sourceIllustrations: "Catalogue record: illustrated by the author",
    mapCredit: "Satellite imagery: Esri, Vantor, Earthstar Geographics, and the GIS User Community · Map rendering: MapLibre GL JS",
    publicationNote: "Rights note | Quotations and illustrations are presented for non-commercial literary and historical research; copyright remains with the relevant rights holders."
  }
};

// The Chinese copy is authored directly in the HTML so the page remains fully readable
// even before JavaScript loads. Keep a snapshot so switching back from English restores it.
const DOM_ZH_COPY = {
  ...COPY.zh,
  ...Object.fromEntries(Array.from(document.querySelectorAll("[data-i18n]"), (element) => [element.dataset.i18n, element.textContent.trim()])),
  ...Object.fromEntries(Array.from(document.querySelectorAll("[data-i18n-alt]"), (element) => [element.dataset.i18nAlt, element.getAttribute("alt") || ""]))
};

const PLACE_EN = {
  newlands: { name: "Newlands / Agnes Keith House", date: "1934–1939", meta: "Sandakan · present site confirmed", note: "The Keiths’ base for living and writing in North Borneo, and the anchor for both departure and return. The present house is a post-war reconstruction." },
  tawau: { name: "Tawau", date: "First stage of the 1938 expedition", meta: "An explicit stop in the book", note: "The Keiths reached Tawau by coastal steamer, met the geologist Winki and prepared to enter the river systems of southeastern North Borneo." },
  sebatik: { name: "Sebatik Island camp", date: "About early June 1938", meta: "Wallace Bay used as a provisional anchor", note: "The book confirms a night at Winki’s camp on Sebatik Island, but no reliable coordinate for the camp has been found. Wallace Bay is used here as a historical anchor." },
  kalabakan: { name: "Kalabakan (old Kalabakang)", date: "3 June 1938", meta: "Specimen record + A Sabah Gazetteer", note: "The start of the Kalabakan–Kuamut crossing. Kalabakang is the historical spelling; Kalabakan is the modern standard form." },
  tiagau: { name: "Tiagau River (old Tiaggau)", date: "6 June 1938", meta: "River mouth can be located", note: "The expedition left the Kalabakan and moved upstream along its Tiagau tributary. Tiaggau is the older spelling." },
  pengkalan: { name: "Pengkalan", date: "8 June 1938", meta: "Specimen locality; coordinate reconstructed along the river", note: "Harry Keith’s specimen label records Pengkalan, Tiaggau River, at roughly 340 feet above sea level." },
  "ulu-tiagau": { name: "Hulu Tiagau", date: "9 June 1938", meta: "Upper-river coordinate + specimen date", note: "The upper Tiagau. From here, the expedition entered the overland and watershed-crossing stage." },
  biyudun: { name: "Hulu Biyudun River", date: "11–12 June 1938", meta: "Specimen locality; exact modern river course unresolved", note: "Specimen labels at Harvard and Michigan both preserve this place name. It is a crucial node in reconstructing the crossing." },
  "napagun-mid": { name: "Middle Napagun", date: "14 June 1938", meta: "Specimen date confirmed; coordinate reconstructed", note: "A middle-stage locality in the transition from the Biyudun system towards the Kuamut basin. The name is not consistently preserved on modern maps." },
  "napagun-mouth": { name: "Kuala Napagun", date: "15–16 June 1938", meta: "Specimen dates confirmed; coordinate reconstructed", note: "Kuala indicates a river mouth or confluence. The position shown here follows the dated sequence and the relationship between river systems." },
  kasuyun: { name: "Kasuyun", date: "18 June 1938", meta: "Specimen locality; coordinate represents a river reach", note: "By this point the expedition had entered the Kuamut system and would continue downstream." },
  "kuala-kuamut": { name: "Kuala Kuamut", date: "Late June 1938", meta: "Coordinate from A Sabah Gazetteer", note: "The confluence of the Kuamut and Kinabatangan. From here the book follows the river east towards the Sulu Sea." },
  "kina-mouth": { name: "Kinabatangan River Mouth", date: "Late June 1938", meta: "Geographical anchor at the river mouth", note: "The book describes the boat leaving the Kinabatangan for the open sea before returning to Sandakan." },
  abai: { name: "Abai / Johnsonville", date: "1935", meta: "Martin and Osa Johnson’s camp", note: "The filmmaking expedition described in the book’s “Visitors” section. It belongs to someone else’s expedition and is therefore kept off the Keiths’ 1938 route." },
  semporna: { name: "Semporna", date: "Several passages in the book", meta: "A coastal setting for people and stories", note: "Associated with Abanawas and other stories, Semporna is an important place in the book’s east-coast world but not a continuous stop on this crossing." },
  "lahad-datu": { name: "Lahad Datu", date: "Coastal passages in the book", meta: "Coastal town", note: "A place in the first-edition map and coastal narrative, shown separately as geographical context." },
  linidis: { name: "Linidis", date: "Event of 1890", meta: "Upper Kalabakan; exact position unresolved", note: "The longhouse locality associated with the Walter Flint episode retold in the book. This is historical narrative, not a place visited on the Keiths’ expedition." }
};

function preferredLanguage() {
  if (window.location.pathname.replace(/\/+$/, "").endsWith("/en")) return "en";
  const requested = new URLSearchParams(window.location.search).get("lang");
  if (requested === "en" || requested === "zh") return requested;
  return "zh";
}

let currentLang = preferredLanguage();

const points = [
  { id: "newlands", name: "纽兰兹（Newlands）/ 阿格尼丝·凯斯故居（Agnes Keith House）", category: "route", date: "1934–1939", coord: [118.1155, 5.8431], certainty: "located", meta: "山打根（Sandakan）· 现址可确认", note: "凯斯夫妇在北婆罗洲生活与写作的基地，也是路线的出发与回返锚点。现建筑为战后重建。" },
  { id: "tawau", name: "斗湖（Tawau）", category: "route", date: "1938 年远征前段", coord: [117.8853, 4.2435], certainty: "located", meta: "书中明确停靠", note: "夫妇乘海岸船抵达斗湖（Tawau），与地质学家 Winki 会合，准备进入东南部河流系统。" },
  { id: "sebatik", name: "塞巴蒂克岛营地（Sebatik Island camp）", category: "route", date: "约 1938 年 6 月初", coord: [117.6625, 4.25], certainty: "approx", meta: "暂以华莱士湾（Wallace Bay）为锚点", note: "书中确认在塞巴蒂克岛的 Winki 营地过夜，但营地精确位置未见坐标；这里暂以历史地名华莱士湾表示。" },
  { id: "kalabakan", name: "卡拉巴坎（Kalabakan，old Kalabakang）", category: "route", date: "1938-06-03", coord: [117.4833, 4.4083], certainty: "located", meta: "标本记录 + A Sabah Gazetteer", note: "正式进入卡拉巴坎—夸穆特（Kalabakan–Kuamut）横穿。Kalabakang 是旧拼法，Kalabakan 是现代标准拼法。" },
  { id: "tiagau", name: "蒂高河（Tiagau River，old Tiaggau）", category: "route", date: "1938-06-06", coord: [117.3875, 4.4625], certainty: "located", meta: "河口坐标可确认", note: "远征队离开卡拉巴坎主河，沿蒂高支流逆流而上。Tiaggau 是旧拼法。" },
  { id: "pengkalan", name: "彭加兰（Pengkalan）", category: "route", date: "1938-06-08", coord: [117.342, 4.565], certainty: "approx", meta: "标本地点；坐标为河段复原", note: "Harry Keith 的标本标签记录了 Pengkalan, Tiaggau River，海拔约 340 英尺。" },
  { id: "ulu-tiagau", name: "上蒂高（Hulu Tiagau）", category: "route", date: "1938-06-09", coord: [117.2833, 4.7167], certainty: "located", meta: "上游坐标 + 标本日期", note: "蒂高河上游；此后转入徒步与翻越分水岭阶段。" },
  { id: "biyudun", name: "上比尤敦河（Hulu Biyudun River）", category: "route", date: "1938-06-11–12", coord: [117.205, 4.79], certainty: "approx", meta: "标本地点；现代精确河道待校准", note: "Harvard 与 Michigan 的标本标签均保留此地名。它是复原横穿路线的关键节点。" },
  { id: "napagun-mid", name: "中纳帕贡（Middle Napagun）", category: "route", date: "1938-06-14", coord: [117.19, 4.94], certainty: "approx", meta: "标本日期确定；坐标为复原", note: "从比尤敦水系向夸穆特流域过渡的中段地点。现代地图上未稳定保留此名称。" },
  { id: "napagun-mouth", name: "纳帕贡河口（Kuala Napagun）", category: "route", date: "1938-06-15–16", coord: [117.255, 5.025], certainty: "approx", meta: "标本日期确定；坐标为复原", note: "Kuala 表示河口或汇流处。此处位置依日期顺序与河网关系暂定。" },
  { id: "kasuyun", name: "卡苏云（Kasuyun）", category: "route", date: "1938-06-18", coord: [117.405, 5.105], certainty: "approx", meta: "标本地点；坐标为夸穆特河段范围", note: "远征队已经进入夸穆特（Kuamut）水系，随后顺流而下。" },
  { id: "kuala-kuamut", name: "夸穆特河口（Kuala Kuamut）", category: "route", date: "1938 年 6 月下旬", coord: [117.4875, 5.2167], certainty: "located", meta: "A Sabah Gazetteer 坐标", note: "夸穆特河与京那巴当岸河（Kinabatangan River）的汇流点。书中从这里继续沿下游前往苏禄海。" },
  { id: "kina-mouth", name: "京那巴当岸河口（Kinabatangan River Mouth）", category: "route", date: "1938 年 6 月下旬", coord: [118.571, 5.627], certainty: "located", meta: "河口地理锚点", note: "书中写到船从京那巴当岸河驶入海上，随后返回山打根（Sandakan）。" },
  { id: "abai", name: "阿拜（Abai / Johnsonville）", category: "related", date: "1935", coord: [118.3831, 5.6877], certainty: "located", meta: "Martin 与 Osa Johnson 的营地", note: "书中“Visitors”部分记述的电影探险营地。它属于书中他人的探险，不应并入凯斯夫妇的 1938 年横穿路线。" },
  { id: "semporna", name: "仙本那（Semporna）", category: "related", date: "书中多处", coord: [118.6119, 4.4791], certainty: "located", meta: "人物与海岸叙事地点", note: "与 Abanawas 等故事相关，也是书中东岸世界的重要城镇，但并非本次横穿的连续节点。" },
  { id: "lahad-datu", name: "拿笃（Lahad Datu）", category: "related", date: "书中海岸段落", coord: [118.3276, 5.0216], certainty: "located", meta: "沿岸城镇", note: "原书地图与海岸航行叙事中的地点，作为东岸空间背景单独标出。" },
  { id: "linidis", name: "利尼迪斯（Linidis）", category: "history", date: "1890 年事件", coord: [117.26, 4.56], certainty: "approx", meta: "卡拉巴坎河上游；精确位置待校准", note: "书中转述 Walter Flint 事件所涉及的长屋地点。它是历史叙事，不是凯斯夫妇亲历路线。" }
];

const pointById = new Map(points.map((point) => [point.id, point]));

function localizedPoint(point) {
  if (currentLang === "zh") return point;
  return { ...point, ...(PLACE_EN[point.id] || {}) };
}

function updateMapAccessibility() {
  const mapElement = document.querySelector("#map");
  mapElement?.setAttribute("aria-label", currentLang === "zh" ? "沙巴卫星地图，显示《风下之乡》相关路线" : "Satellite map of Sabah showing routes and places from Land Below the Wind");
  document.querySelector(".map-legend")?.setAttribute("aria-label", currentLang === "zh" ? "地图图例" : "Map legend");
  document.querySelector(".chapter-progress")?.setAttribute("aria-label", currentLang === "zh" ? "章节进度" : "Chapter progress");
  document.querySelector("#route-story")?.setAttribute("aria-label", currentLang === "zh" ? "路线地图与章节" : "Route map and chapters");
}

function applyLanguage(language) {
  currentLang = language === "en" ? "en" : "zh";
  const copy = currentLang === "zh" ? DOM_ZH_COPY : COPY.en;
  const metadata = currentLang === "zh"
    ? {
        title: "风下之乡路线地图｜阿格尼丝·凯斯 1938 北婆罗洲旅程",
        description: "沿阿格尼丝·凯斯 1938 年穿越英属北婆罗洲的旅程，以卫星地图重建《风下之乡》的河流、雨林、地点与历史路线。",
        socialTitle: "风下之乡路线地图｜Land Below the Wind",
        socialDescription: "沿阿格尼丝·凯斯 1938 年穿越北婆罗洲的旅程，在卫星地图上重建《风下之乡》的路线与地点。",
        locale: "zh_CN",
        imageAlt: "《风下之乡》1938 年北婆罗洲旅程地图"
      }
    : {
        title: "Land Below the Wind Journey Map | Agnes Keith in North Borneo, 1938",
        description: "A satellite-map reconstruction of Agnes Newton Keith’s 1938 journey through the rivers and rainforests of British North Borneo in Land Below the Wind.",
        socialTitle: "Land Below the Wind | A 1938 North Borneo Journey Map",
        socialDescription: "Follow Agnes Newton Keith’s 1938 journey through British North Borneo on a richly annotated satellite map.",
        locale: "en_US",
        imageAlt: "Map of Agnes Newton Keith’s 1938 journey through North Borneo"
      };
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  document.title = metadata.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", metadata.socialTitle);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", metadata.socialDescription);
  document.querySelector('meta[property="og:locale"]')?.setAttribute("content", metadata.locale);
  document.querySelector('meta[property="og:image:alt"]')?.setAttribute("content", metadata.imageAlt);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", metadata.socialTitle);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", metadata.socialDescription);
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = copy[element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    const value = copy[element.dataset.i18nAlt];
    if (value) element.setAttribute("alt", value);
  });
  document.querySelectorAll("[data-lang]").forEach((link) => {
    if (link.dataset.lang === currentLang) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  markerElements.forEach((element, id) => {
    const point = localizedPoint(pointById.get(id));
    element.setAttribute("aria-label", `${point.name}, ${point.date}`);
    const label = element.querySelector(".map-marker-label");
    if (label) label.textContent = point.name;
  });
  renderPlaceLedger();
  updateMapAccessibility();
}

const routeOrder = ["newlands", "tawau", "sebatik", "kalabakan", "tiagau", "pengkalan", "ulu-tiagau", "biyudun", "napagun-mid", "napagun-mouth", "kasuyun", "kuala-kuamut", "kina-mouth", "newlands"];
const chapterOrder = ["home", "coast", "kalabakan", "tiagau", "flood", "biyudun", "napagun", "kuamut", "return", "related"];
const chapterViews = {
  overview: { center: [117.83, 5.06], zoom: 6.25, bearing: -8, pitch: 22 },
  home: { center: [118.1155, 5.8431], zoom: 10.7, bearing: -18, pitch: 42 },
  coast: { center: [117.95, 4.86], zoom: 6.55, bearing: -7, pitch: 30 },
  kalabakan: { center: [117.49, 4.4], zoom: 9.35, bearing: -12, pitch: 42 },
  tiagau: { center: [117.35, 4.57], zoom: 9.6, bearing: -15, pitch: 46 },
  flood: { center: [117.285, 4.705], zoom: 10.05, bearing: 8, pitch: 50 },
  biyudun: { center: [117.22, 4.82], zoom: 10, bearing: 16, pitch: 50 },
  napagun: { center: [117.235, 4.99], zoom: 9.55, bearing: 12, pitch: 48 },
  kuamut: { center: [117.43, 5.15], zoom: 9.15, bearing: -8, pitch: 44 },
  return: { center: [118.06, 5.47], zoom: 7.65, bearing: -12, pitch: 34 },
  related: { center: [117.96, 5.05], zoom: 6.6, bearing: 0, pitch: 18 }
};

function cubicSeaArc(start, control1, control2, end, steps = 32) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps;
    const inverse = 1 - t;
    return [
      inverse ** 3 * start[0] + 3 * inverse * inverse * t * control1[0] + 3 * inverse * t * t * control2[0] + t ** 3 * end[0],
      inverse ** 3 * start[1] + 3 * inverse * inverse * t * control1[1] + 3 * inverse * t * t * control2[1] + t ** 3 * end[1]
    ];
  });
}

const routeGeometry = {
  // The book confirms the ports but does not preserve a ship's log. These three
  // maritime links are deliberately smooth, schematic arcs rather than GPS-like tracks.
  0: (from, to) => cubicSeaArc(from, [119.05, 5.62], [119.15, 4.52], to, 40),
  1: (from, to) => cubicSeaArc(from, [117.82, 4.19], [117.72, 4.18], to, 16),
  2: (from, to) => [from, [117.634, 4.274], [117.603, 4.305], [117.571, 4.338], [117.527, 4.37], to],
  3: (from, to) => [from, [117.47, 4.404], [117.459, 4.455], [117.429, 4.447], [117.407, 4.452], to],
  4: (from, to) => [from, [117.374, 4.489], [117.382, 4.515], [117.361, 4.537], to],
  5: (from, to) => [from, [117.326, 4.592], [117.334, 4.618], [117.307, 4.645], [117.314, 4.675], [117.292, 4.697], to],
  6: (from, to) => [from, [117.265, 4.735], [117.25, 4.755], [117.23, 4.768], to],
  7: (from, to) => [from, [117.193, 4.825], [117.201, 4.858], [117.187, 4.892], to],
  8: (from, to) => [from, [117.205, 4.956], [117.216, 4.98], [117.242, 5.001], to],
  9: (from, to) => [from, [117.29, 5.035], [117.322, 5.056], [117.355, 5.075], [117.39, 5.092], to],
  10: (from, to) => [from, [117.424, 5.113], [117.447, 5.128], [117.456, 5.154], [117.451, 5.179], [117.469, 5.198], to],
  11: (from, to) => [from, [117.528, 5.21], [117.593, 5.279], [117.655, 5.331], [117.723, 5.393], [117.811, 5.498], [117.92, 5.495], [118.036, 5.421], [118.187, 5.453], [118.292, 5.536], [118.38, 5.679], [118.473, 5.651], to],
  12: (from, to) => cubicSeaArc(from, [118.64, 5.72], [118.4, 5.94], to, 20)
};

const routeSegments = routeOrder.slice(0, -1).map((fromId, index) => {
  const toId = routeOrder[index + 1];
  const from = pointById.get(fromId);
  const to = pointById.get(toId);
  const coordinates = routeGeometry[index]?.(from.coord, to.coord) || [from.coord, to.coord];
  return {
    type: "Feature",
    properties: {
      from: fromId,
      to: toId,
      certainty: [0, 1, 2, 6, 7, 8, 9, 12].includes(index) ? "approx" : "located",
      mode: [0, 1, 12].includes(index) ? "sea" : "river",
      index,
      active: true
    },
    geometry: { type: "LineString", coordinates }
  };
});

// The overview must fit the route geometry itself, not only its named stops.
// In particular, the two long sea arcs extend well beyond their port markers.
const routeOverviewBounds = routeSegments
  .flatMap((feature) => feature.geometry.coordinates)
  .reduce((bounds, coordinate) => [
    [Math.min(bounds[0][0], coordinate[0]), Math.min(bounds[0][1], coordinate[1])],
    [Math.max(bounds[1][0], coordinate[0]), Math.max(bounds[1][1], coordinate[1])]
  ], [[Infinity, Infinity], [-Infinity, -Infinity]]);

document.querySelector("#progress-list").innerHTML = chapterOrder
  .map((chapter, index) => `<li aria-label="${String(index + 1).padStart(2, "0")}" data-progress-chapter="${chapter}"></li>`)
  .join("");
document.documentElement.style.setProperty("--chapter-count", String(chapterOrder.length + 1));

const mapStatus = document.querySelector("#map-status");
const mapError = document.querySelector("#map-error");
const markerElements = new Map();
const journeyProgressFill = document.querySelector("#journey-progress-fill");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const routeProgressByChapter = {
  overview: 13, home: 0, coast: 2, kalabakan: 3, tiagau: 6,
  flood: 7, biyudun: 8, napagun: 10, kuamut: 11, return: 13, related: 13
};
const routeRangeByChapter = {
  overview: [0, 12], home: [0, 0], coast: [0, 1], kalabakan: [2, 2],
  tiagau: [3, 5], flood: [5, 6], biyudun: [6, 7], napagun: [8, 9],
  kuamut: [9, 10], return: [11, 12], related: [-1, -1]
};
let map;
let activeChapter = "overview";
let mapReady = false;
let currentRouteProgress = routeSegments.length;
let routeAnimationFrame = null;
let journeyHeadMarker = null;

function renderPlaceLedger() {
  const lists = document.querySelectorAll("[data-ledger-ids]");
  if (!lists.length) return;
  const copy = currentLang === "zh" ? DOM_ZH_COPY : COPY.en;
  const categoryLabels = {
    route: copy.categoryRoute,
    related: copy.categoryRelated,
    history: copy.categoryHistory
  };
  lists.forEach((list) => {
    const compact = list.dataset.ledgerMode === "compact";
    const ids = list.dataset.ledgerIds.split(",");
    const entries = ids.map((id) => {
      const point = pointById.get(id);
      const localized = localizedPoint(point);
      const globalIndex = points.findIndex((candidate) => candidate.id === id) + 1;
      const item = document.createElement("li");
      item.className = `ledger-entry ledger-entry--${point.category}`;

      const heading = document.createElement("div");
      heading.className = "ledger-entry-heading";
      const title = document.createElement("h3");
      title.textContent = `${String(globalIndex).padStart(2, "0")}  ${localized.name}`;
      const kind = document.createElement("span");
      kind.className = "ledger-kind";
      kind.textContent = categoryLabels[point.category];
      heading.append(title, kind);

      const evidence = document.createElement("p");
      evidence.className = "ledger-evidence";
      evidence.textContent = `${localized.date} · ${localized.meta}`;
      if (compact) {
        item.classList.add("ledger-entry--compact");
        item.append(heading, evidence);
        return item;
      }
      const note = document.createElement("p");
      note.className = "ledger-note";
      note.textContent = localized.note;
      const coordinate = document.createElement("p");
      coordinate.className = "ledger-coordinate";
      const certainty = point.certainty === "approx" ? copy.certaintyApprox : copy.certaintyLocated;
      coordinate.textContent = `${point.coord[1].toFixed(4)}°N, ${point.coord[0].toFixed(4)}°E · ${certainty}`;

      item.append(heading, evidence, note, coordinate);
      return item;
    });
    list.replaceChildren(...entries);
  });
}

function sliceCoordinates(coordinates, fraction) {
  if (fraction <= 0) return [coordinates[0], coordinates[0]];
  if (fraction >= 1) return coordinates;
  const lengths = coordinates.slice(1).map((coordinate, index) => {
    const previous = coordinates[index];
    return Math.hypot(coordinate[0] - previous[0], coordinate[1] - previous[1]);
  });
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const target = total * fraction;
  const result = [coordinates[0]];
  let travelled = 0;
  for (let index = 0; index < lengths.length; index += 1) {
    const length = lengths[index];
    if (travelled + length >= target) {
      const local = length ? (target - travelled) / length : 0;
      const start = coordinates[index];
      const end = coordinates[index + 1];
      result.push([start[0] + (end[0] - start[0]) * local, start[1] + (end[1] - start[1]) * local]);
      break;
    }
    result.push(coordinates[index + 1]);
    travelled += length;
  }
  return result;
}

function sliceCoordinateRange(coordinates, startFraction, endFraction) {
  const start = Math.max(0, Math.min(1, startFraction));
  const end = Math.max(start, Math.min(1, endFraction));
  const endSlice = sliceCoordinates(coordinates, end);
  const startPoint = sliceCoordinates(coordinates, start).at(-1);
  if (start <= 0) return endSlice;

  const lengths = coordinates.slice(1).map((coordinate, index) => {
    const previous = coordinates[index];
    return Math.hypot(coordinate[0] - previous[0], coordinate[1] - previous[1]);
  });
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const startDistance = total * start;
  let travelled = 0;
  let firstWholePoint = coordinates.length;
  for (let index = 0; index < lengths.length; index += 1) {
    travelled += lengths[index];
    if (travelled > startDistance) {
      firstWholePoint = index + 1;
      break;
    }
  }
  return [startPoint, ...endSlice.slice(firstWholePoint)];
}

function progressFeatureCollection(progress) {
  const complete = Math.floor(progress);
  const fraction = progress - complete;
  const features = routeSegments.slice(0, complete).map((feature) => ({
    ...feature,
    properties: { ...feature.properties },
    geometry: { ...feature.geometry, coordinates: [...feature.geometry.coordinates] }
  }));
  if (fraction > 0 && routeSegments[complete]) {
    const feature = routeSegments[complete];
    features.push({
      ...feature,
      properties: { ...feature.properties },
      geometry: { ...feature.geometry, coordinates: sliceCoordinates(feature.geometry.coordinates, fraction) }
    });
  }
  return { type: "FeatureCollection", features };
}

function progressTrailFeatureCollection(progress, span = 0.58) {
  const end = Math.max(0, Math.min(routeSegments.length, progress));
  const start = Math.max(0, end - span);
  const firstIndex = Math.floor(start);
  const lastIndex = Math.min(routeSegments.length - 1, Math.max(firstIndex, Math.ceil(end) - 1));
  const features = [];

  for (let index = firstIndex; index <= lastIndex; index += 1) {
    const feature = routeSegments[index];
    if (!feature) continue;
    const localStart = index === firstIndex ? start - index : 0;
    const localEnd = index === lastIndex ? end - index : 1;
    if (localEnd <= localStart) continue;
    features.push({
      ...feature,
      properties: { ...feature.properties },
      geometry: {
        ...feature.geometry,
        coordinates: sliceCoordinateRange(feature.geometry.coordinates, localStart, localEnd)
      }
    });
  }

  return { type: "FeatureCollection", features };
}

function progressHead(progress) {
  if (progress >= routeSegments.length) return routeSegments.at(-1).geometry.coordinates.at(-1);
  const index = Math.floor(progress);
  const coordinates = routeSegments[index].geometry.coordinates;
  return sliceCoordinates(coordinates, progress - index).at(-1);
}

function setRouteProgress(progress) {
  currentRouteProgress = Math.max(0, Math.min(routeSegments.length, progress));
  const source = map?.getSource("route-progress");
  const trail = map?.getSource("route-trail");
  if (source) source.setData(progressFeatureCollection(currentRouteProgress));
  if (trail) trail.setData(progressTrailFeatureCollection(currentRouteProgress));
  journeyHeadMarker?.setLngLat(progressHead(currentRouteProgress));
  if (journeyProgressFill) journeyProgressFill.style.transform = `scaleX(${currentRouteProgress / routeSegments.length})`;
}

function animateRouteProgress(target, immediate = false) {
  if (routeAnimationFrame) cancelAnimationFrame(routeAnimationFrame);
  const destination = Math.max(0, Math.min(routeSegments.length, target));
  const origin = currentRouteProgress;
  if (immediate || reduceMotion.matches || Math.abs(destination - origin) < 0.01) {
    setRouteProgress(destination);
    return;
  }
  const started = performance.now();
  const duration = Math.min(850, 520 + Math.abs(destination - origin) * 70);
  const animate = (timestamp) => {
    const linear = Math.min(1, (timestamp - started) / duration);
    const eased = linear < 0.5
      ? 4 * linear * linear * linear
      : 1 - Math.pow(-2 * linear + 2, 3) / 2;
    setRouteProgress(origin + (destination - origin) * eased);
    if (linear < 1) routeAnimationFrame = requestAnimationFrame(animate);
  };
  routeAnimationFrame = requestAnimationFrame(animate);
}

function flyToChapter(chapter, duration = 1500) {
  const view = chapterViews[chapter];
  if (!map || !view) return;
  const narrative = document.querySelector(`.chapter[data-chapter="${chapter}"] .chapter-card, .chapter[data-chapter="${chapter}"] .hero-copy`);
  const narrativeRect = narrative?.getBoundingClientRect();
  const desktopPadding = window.innerWidth > 820 && narrativeRect
    ? {
        top: 78,
        right: Math.max(32, Math.round(window.innerWidth * 0.025)),
        bottom: 42,
        left: Math.min(Math.round(narrativeRect.right + 44), window.innerWidth - 320)
      }
    : { top: 0, right: 0, bottom: 0, left: 0 };
  if (chapter === "overview") {
    const overviewPadding = window.innerWidth > 820
      ? {
          top: Math.max(desktopPadding.top, Math.round(window.innerHeight * 0.08)),
          right: Math.max(desktopPadding.right, Math.round(window.innerWidth * 0.11)),
          bottom: Math.max(desktopPadding.bottom, Math.round(window.innerHeight * 0.11)),
          left: desktopPadding.left
        }
      : { top: 78, right: 24, bottom: 36, left: 24 };
    map.fitBounds(routeOverviewBounds, {
      padding: overviewPadding,
      bearing: view.bearing,
      pitch: view.pitch,
      maxZoom: view.zoom,
      duration: reduceMotion.matches ? 0 : duration,
      essential: false
    });
    return;
  }
  map.easeTo({
    ...view,
    padding: desktopPadding,
    retainPadding: false,
    duration: reduceMotion.matches ? 0 : duration,
    essential: false
  });
}

function mapStyle() {
  return {
    version: 8,
    sources: {
      imagery: {
        type: "raster",
        tiles: [SATELLITE_TILES],
        tileSize: 256,
        maxzoom: 19,
        attribution: "Source: Esri, Vantor, Earthstar Geographics, and the GIS User Community"
      }
    },
    layers: [{ id: "imagery", type: "raster", source: "imagery", paint: { "raster-saturation": -0.08, "raster-contrast": 0.12, "raster-brightness-max": 0.82 } }]
  };
}

function initializeMap() {
  if (!window.maplibregl) {
    showMapError();
    return;
  }
  map = new maplibregl.Map({
    container: "map",
    style: mapStyle(),
    ...chapterViews.overview,
    minZoom: 5.3,
    maxZoom: 15,
    maxBounds: [[114.6, 3.1], [120.2, 7.7]],
    attributionControl: false,
    interactive: false
  });
  map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: "metric" }), "bottom-left");
  map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
  map.on("load", () => {
    mapReady = true;
    mapStatus.classList.add("is-hidden");
    mapError.hidden = true;
    addRouteLayers();
    addJourneyHeadMarker();
    addMarkers();
    updateRouteHighlight(activeChapter);
    setRouteProgress(routeProgressByChapter[activeChapter] ?? routeSegments.length);
    flyToChapter(activeChapter, 0);
    updateMapAccessibility();
  });
  map.on("error", (event) => {
    const message = event?.error?.message?.toLowerCase() || "";
    if (!mapReady && (message.includes("style") || message.includes("webgl"))) showMapError();
  });
  window.setTimeout(() => {
    if (!mapReady && !map.isStyleLoaded()) showMapError();
  }, 10000);
}

function showMapError() {
  mapStatus.classList.add("is-hidden");
  mapError.hidden = false;
}

function addRouteLayers() {
  map.addSource("route", { type: "geojson", data: { type: "FeatureCollection", features: routeSegments } });
  map.addSource("route-progress", { type: "geojson", data: progressFeatureCollection(currentRouteProgress) });
  map.addSource("route-trail", { type: "geojson", data: progressTrailFeatureCollection(currentRouteProgress) });
  map.addLayer({
    id: "route-casing", type: "line", source: "route",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#06140f",
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 4.6, 11, 6.8],
      "line-opacity": ["case", ["boolean", ["get", "active"], false], 0.62, 0.28]
    }
  });
  map.addLayer({
    id: "route-line-located", type: "line", source: "route",
    filter: ["==", ["get", "certainty"], "located"],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#81948d",
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 1.55, 11, 2.7],
      "line-opacity": ["case", ["boolean", ["get", "active"], false], 0.72, 0.28]
    }
  });
  map.addLayer({
    id: "route-line-approx", type: "line", source: "route",
    filter: ["==", ["get", "certainty"], "approx"],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#81948d",
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 1.55, 11, 2.7],
      "line-opacity": ["case", ["boolean", ["get", "active"], false], 0.72, 0.28],
      "line-dasharray": [3.2, 2.4]
    }
  });
  map.addLayer({
    id: "route-progress-casing", type: "line", source: "route-progress",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#06140f",
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 5.1, 11, 7.2],
      "line-opacity": 0.76
    }
  });
  map.addLayer({
    id: "route-progress-located", type: "line", source: "route-progress",
    filter: ["==", ["get", "certainty"], "located"],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#93d8c8",
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 2.15, 11, 3.6],
      "line-opacity": 0.98
    }
  });
  map.addLayer({
    id: "route-progress-approx", type: "line", source: "route-progress",
    filter: ["==", ["get", "certainty"], "approx"],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#93d8c8",
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 2.15, 11, 3.6],
      "line-opacity": 0.98,
      "line-dasharray": [3.2, 2.4]
    }
  });
  map.addLayer({
    id: "route-trail-glow", type: "line", source: "route-trail",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#c8fff1",
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 7, 11, 12],
      "line-opacity": 0.19,
      "line-blur": 3.2
    }
  });
  map.addLayer({
    id: "route-trail-located", type: "line", source: "route-trail",
    filter: ["==", ["get", "certainty"], "located"],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#e4fff8",
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 2.8, 11, 4.2],
      "line-opacity": 0.96
    }
  });
  map.addLayer({
    id: "route-trail-approx", type: "line", source: "route-trail",
    filter: ["==", ["get", "certainty"], "approx"],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#e4fff8",
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 2.8, 11, 4.2],
      "line-opacity": 0.96,
      "line-dasharray": [1.5, 1.65]
    }
  });
}

function addJourneyHeadMarker() {
  const element = document.createElement("div");
  element.className = "route-journey-head";
  element.setAttribute("aria-hidden", "true");
  journeyHeadMarker = new maplibregl.Marker({ element, anchor: "center" })
    .setLngLat(progressHead(currentRouteProgress))
    .addTo(map);
}

function addMarkers() {
  points.forEach((point) => {
    const localized = localizedPoint(point);
    const element = document.createElement("div");
    element.className = `map-marker${point.certainty === "approx" ? " is-approx" : ""}`;
    element.dataset.category = point.category;
    element.dataset.pointId = point.id;
    element.setAttribute("role", "img");
    element.setAttribute("aria-label", `${localized.name}, ${localized.date}`);
    const label = document.createElement("span");
    label.className = "map-marker-label";
    label.textContent = localized.name;
    element.appendChild(label);
    new maplibregl.Marker({ element, anchor: "center" }).setLngLat(point.coord).addTo(map);
    markerElements.set(point.id, element);
  });
  map.on("moveend", updateMarkerLabels);
  updateMarkerLabels();
}

const persistentLabels = new Set(["newlands", "tawau", "kalabakan", "kuala-kuamut", "kina-mouth"]);
const contextLabels = new Set(["abai", "semporna", "lahad-datu", "linidis"]);
const chapterFocusLabels = {
  overview: new Set(["newlands", "tawau", "kalabakan", "kuala-kuamut", "kina-mouth"]),
  home: new Set(["newlands"]),
  coast: new Set(["tawau", "sebatik"]),
  kalabakan: new Set(["kalabakan"]),
  tiagau: new Set(["tiagau", "pengkalan", "ulu-tiagau"]),
  flood: new Set(["pengkalan", "ulu-tiagau"]),
  biyudun: new Set(["ulu-tiagau", "biyudun"]),
  napagun: new Set(["biyudun", "napagun-mid", "napagun-mouth"]),
  kuamut: new Set(["kasuyun", "kuala-kuamut"]),
  return: new Set(["kuala-kuamut", "kina-mouth", "newlands"]),
  related: contextLabels
};

function updateMarkerLabels() {
  if (!map) return;
  const zoom = map.getZoom();
  const focusLabels = chapterFocusLabels[activeChapter] || new Set();
  markerElements.forEach((element, id) => {
    const point = pointById.get(id);
    const label = element.querySelector(".map-marker-label");
    const isFocused = focusLabels.has(id);
    const visible = isFocused
      || persistentLabels.has(id)
      || (activeChapter === "related" && contextLabels.has(id))
      || (point.category === "route" ? zoom >= 8.5 : zoom >= 9.5);
    const projected = map.project(point.coord);
    const labelWidth = Math.max(label?.scrollWidth || 0, label?.getBoundingClientRect().width || 0);
    element.classList.toggle("is-label-left", projected.x + 19 + labelWidth > window.innerWidth - 18);
    element.classList.toggle("is-chapter-focus", isFocused);
    label?.classList.toggle("is-visible", visible);
  });
}

function updateRouteHighlight(chapter) {
  if (!map?.getSource("route")) return;
  const [minimum, maximum] = routeRangeByChapter[chapter] || [-1, -1];
  routeSegments.forEach((feature) => {
    feature.properties.active = feature.properties.index >= minimum && feature.properties.index <= maximum;
  });
  map.getSource("route").setData({ type: "FeatureCollection", features: routeSegments });
}

function activateChapter(chapter) {
  if (activeChapter === chapter) return;
  const previousChapter = activeChapter;
  activeChapter = chapter;
  document.querySelectorAll(".chapter").forEach((element) => element.classList.toggle("is-active", element.dataset.chapter === chapter));
  const index = chapterOrder.indexOf(chapter);
  document.querySelectorAll("#progress-list li").forEach((element, itemIndex) => element.classList.toggle("is-active", itemIndex === index));
  updateRouteHighlight(chapter);
  updateMarkerLabels();
  const rewindFromOverview = previousChapter === "overview" && chapter === "home";
  animateRouteProgress(routeProgressByChapter[chapter] ?? currentRouteProgress, rewindFromOverview);
  flyToChapter(chapter, 720);
}

const chapterElements = [...document.querySelectorAll(".chapter")];
document.body.classList.add("story-stepped");

function syncStoryState() {
  const rect = document.querySelector("#route-story").getBoundingClientRect();
  const storyInView = rect.bottom > 120 && rect.top < window.innerHeight - 120;
  document.body.classList.toggle("story-in-view", storyInView);
  document.documentElement.classList.toggle("story-snapping", storyInView);
  if (!storyInView) return;

  const triggerY = window.innerHeight * 0.5;
  const visibleChapter = chapterElements.find((chapter) => {
    const chapterRect = chapter.getBoundingClientRect();
    return chapterRect.top <= triggerY && chapterRect.bottom > triggerY;
  });
  if (visibleChapter) activateChapter(visibleChapter.dataset.chapter);
}

let storySyncFrame;
function requestStorySync() {
  cancelAnimationFrame(storySyncFrame);
  storySyncFrame = requestAnimationFrame(syncStoryState);
}
window.addEventListener("scroll", requestStorySync, { passive: true });
syncStoryState();

let resizeCameraFrame;
window.addEventListener("resize", () => {
  cancelAnimationFrame(resizeCameraFrame);
  resizeCameraFrame = requestAnimationFrame(() => {
    syncStoryState();
    flyToChapter(activeChapter, 0);
  });
}, { passive: true });

applyLanguage(currentLang);
window.addEventListener("load", initializeMap);
