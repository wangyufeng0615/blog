// Explanatory synthesis. Quotes are resolved verbatim against the user's extracted corpus.
// `learn` means a discovery route, `need` a mechanical requirement, `alternative` an optional route.
const L = (zh, en) => ({ zh, en });
const n = (id, title, place, facts, refs = [], sources = []) => ({ id, title: L(...title), place: L(...place), facts: facts.map(f => L(...f)), refs, sources });
export const DLC_SOURCES = [
  ['satellite','Deep Space Satellite','https://outerwilds.fandom.com/wiki/Deep_Space_Satellite','40°观测位置；与本机无线电塔及加布罗记录交叉核对。'],
  ['tower','Island Tower','https://outerwilds.fandom.com/wiki/Island_Tower','梦境蜡烛与现实灯光、塔倒塌及区域连通。'],
  ['woods','Shrouded Woodlands','https://outerwilds.fandom.com/wiki/Shrouded_Woodlands','洪水断开连接及从其他入口乘筏返回的路线。'],
  ['canyon','Endless Canyon','https://outerwilds.fandom.com/wiki/Endless_Canyon','树画、熄灯和隐桥路线；避免沿用首发版本地图。'],
  ['simulation','Simulation','https://outerwilds.fandom.com/wiki/Simulation','三种模拟机制和现实身体、文物火焰的关系。'],
  ['prototype','Death · prototype Artifact','https://outerwilds.fandom.com/wiki/Death','第二种失败原型会致死，不能把原型爆炸当成正确的死亡连接方法。'],
  ['vault','Submerged Structure','https://outerwilds.fandom.com/wiki/Submerged_Structure','现实潜水入口、梦境内部与外部的不同通路。'],
  ['endings','Endings','https://outerwilds.fandom.com/wiki/Endings','两项DLC替代结局触发条件和本体结局的幽禁者邀请。'],
  ['raft-discussion','玩家讨论：档案馆的再次访问','https://www.reddit.com/r/outerwilds/comments/108bp8e/','区分初次发现机制与已知机制后的回访捷径。'],
  ['lift-discussion','玩家讨论：峡谷升降机绕路','https://www.reddit.com/r/outerwilds/comments/y4yv20/','先降升降机、熄灯、由另一绿火房间乘筏返回；不承诺完全无敌人。'],
  ['alarm-discussion','玩家讨论：为什么藏光不能过最后的警铃','https://www.reddit.com/r/outerwilds/comments/1ty2oek/','区分黑暗处的哨兵与封印处持续被照亮的通路。'],
  ['vision-discussion','玩家讨论：本体发现如何影响记忆片段','https://www.reddit.com/r/outerwilds/comments/1wv86m5/','建议先调查旧定居点壁画或飞船、闯入者核心；不是完成DLC的硬前置，也不把所莱内姆当成这段记忆的必要条件。'],
  ['patch','Mobius Digital：Patch 13','https://www.mobiusdigitalgames.com/news/patch-13-is-now-available','关卡和行为曾调整，旧视频路线不应作为当前版本的唯一依据。']
].map(([id,title,url,use])=>({id,title,url,use,checked:'2026-10-19'}));

export const DLC_PHASES = [
 {id:'arrival',title:L('01 找到外星站','01 Find the Stranger'),summary:L('照片不是坏了：先找到一个本来不该存在的轮廓。','The camera is working. Find the silhouette that should not be there.'),nodes:[
  n('radio',['新展品 → 无线电塔','New exhibit → Radio Tower'],['木炉星 · 天文台／无线电塔','Timber Hearth · observatory / Radio Tower'],[
   ['新展品把你引向接收深空卫星照片的无线电塔。三张照片里只有一张多出异常黑影，霍恩费斯一度怀疑设备损坏。','The new exhibit points to the Radio Tower. Only one of its three satellite photos shows an extra silhouette; Hornfels initially suspects the equipment.'],
   ['加布罗检查镜头，确认没有灰尘、划痕或故障迹象。这是重新观察照片的理由，不是另一颗新行星的坐标。','Gabbro finds no dust, scratches or fault. This motivates another observation; it does not give you coordinates for a new planet.']
  ],['TH_RADIO_TOWER_X1','DLG:Gabbro_SatelliteNote:Everything looks a-okay'],['satellite']),
  n('alignment',['复现约40°的异常照片','Recreate the photograph at about 40°'],['太阳高轨 · 深空卫星','High solar orbit · Deep Space Satellite'],[
   ['跟随卫星，观察其角度显示；接近照片所示的40°时朝太阳看，会看到遮挡太阳的轮廓。向它飞近，穿过隐蔽力场。','Follow the satellite and its angle display. Near the photographed 40° alignment, look toward the Sun for the silhouette, then fly toward it and through the cloak.'],
   ['40°是方便找到目标的观察位置，不是解锁外星站的开关；知道位置后可以直接飞过去。','The alignment helps locate the station; it does not unlock it. Once its position is known, you can fly straight there.']
  ],['IP_RING_WORLD_X1'],['satellite']),
  n('stranger',['进入人工环形世界','Enter an artificial ring world'],['外星站 · 停泊区／河流洼地','The Stranger · hangar / River Lowlands'],[
   ['用灯光操作入口，进入环形河流。主要区域是河流洼地、余烬群岛、隐藏峡谷和水库；木筏靠照亮操纵装置行驶。','Use light to operate the entrance. The river links the River Lowlands, Cinder Isles, Hidden Gorge and Reservoir; light operates the rafts.'],
   ['这里不是哈斯人或挪麦人所造。先读幻灯片与视觉记录，再结合飞船日志；不要把陌生文字当作挪麦文字。','This is neither Hearthian nor Nomai construction. Read the slide reels, visions and ship log; do not treat its writing as Nomai text.']
  ],['IP_RING_WORLD_X1','IP_ZONE_1_X1','IP_ZONE_2_X1','IP_ZONE_3_X1','IP_ZONE_4_X2'],['simulation'])
 ]},
 {id:'entry',title:L('02 文物、绿火与梦境','02 Artifact, green fire and the dream'),summary:L('完整文物和绿火缺一不可；普通提灯不替代文物。','A working Artifact and a green fire are both needed; a normal lantern will not do.'),nodes:[
  n('artifact',['取得可用的文物','Find a working Artifact'],['河流洼地 · 幽灵物质车间','River Lowlands · ghost-matter workshop'],[
   ['车间内有可用文物。先用侦察兵拍照确认幽灵物质分布，沿安全入口取走；幽灵物质不是肉眼可见的绿色火焰。','The workshop contains working Artifacts. Use Scout photographs to check the ghost matter and take a safe entrance; ghost matter is distinct from green fire.'],
   ['文物有聚光和遮光功能。实验室另有失败原型，不能把任意提灯或会爆炸的原型当成可用文物。','The working Artifact can focus and conceal its light. The lab also contains failed prototypes; neither an ordinary lantern nor an explosive prototype substitutes for it.']
  ],['IP_ZONE_1_X2','IP_ZONE_3_ENTRANCE_X3'],['simulation','prototype']),
  n('lab',['实验记录教你如何连接','The laboratory shows how to connect'],['隐藏峡谷 · 损毁的实验室','Hidden Gorge · Damaged Laboratory'],[
   ['峡谷的卷盘指出外壳爆炸破洞。可从外部破洞进入第二测试间，查看三种原型实验和绿火前入睡的视觉记录。','A reel in the gorge reveals the explosion and hull breach. Enter the second chamber from outside to study three prototype experiments and the vision of sleeping at a green fire.'],
   ['第三次实验似乎成功。这里提供使用方法；如果你自己先试出正确方法，不必再把实验室当作硬性门锁。','The third experiment appears successful. The lab teaches the method; it is not a mandatory lock if you discover the method yourself.']
  ],['IP_ZONE_3_ENTRANCE_R1','IP_ZONE_3_ENTRANCE_X1','IP_ZONE_3_ENTRANCE_X2','IP_ZONE_3_ENTRANCE_X3']),
  n('fire-rooms',['打开壁画后的绿火房间','Open the green-fire rooms'],['洼地／岛屿高塔／峡谷；水库另有入口','Lowlands / Island Tower / gorge; a fourth at the Reservoir'],[
   ['岛屿高塔的卷盘显示：移走圆形房间里的提灯，使特定壁画不再被照亮，出现通道。居民的身体在绿火旁。','The Island Tower reel shows lanterns being removed from a circular mural room, leaving a particular mural dark and opening a passage. Bodies sit around the green fire.'],
   ['三处村落各通往一片梦境区域；水库沉没构筑物里的绿火通往地下湖内部。记住现实身体留在哪间房。','The three settlement rooms lead to three dream regions. The Reservoir fire leads inside the submerged structure above the lake. Remember where your physical body remains.']
  ],['IP_ZONE_2_LIGHTHOUSE_X1','IP_PRISON_X1','IP_PRISON_X2'],['simulation','vault']),
  n('dream',['手持文物，在绿火旁入睡','Sleep at a green fire holding the Artifact'],['现实 → 模拟世界','Physical world → simulation'],[
   ['持可用文物在绿火附近打盹，醒来进入对应梦境；此处的文物已亮起。聚光可操作装置，遮光可隐藏自己的光。','Doze near a green fire while holding a working Artifact. You arrive in its dream region with the Artifact lit. Focus operates mechanisms; conceal hides your light.'],
   ['梦境内火焰熄灭通常使活着的身体醒来；现实身体的火焰被洪水熄灭也会断开连接。梦境区域可由河流木筏互通。','Losing the dream flame normally wakes a living body. Floodwater extinguishing the physical flame also disconnects you. Dream regions are linked by rafts.']
  ],['IP_ZONE_3_ENTRANCE_X2','IP_DREAM_ZONE_1_R1','IP_DREAM_ZONE_2_R1','IP_DREAM_ZONE_3_R1'],['simulation'])
 ]},
 {id:'trail',title:L('03 从密封储藏库追到焚片室','03 Follow the vault’s trail'),summary:L('先找到寻找档案馆的方法；三个封印的密码已经不在了。','Find the archive trail. The three seal codes have already been destroyed.'),nodes:[
  n('lake',['到地下湖看见三道封印','Reach the lake and its three seals'],['水库 · 沉没的构筑物','Reservoir · Submerged Structure'],[
   ['从现实水下构筑物的底部开口游入，带文物在内部绿火旁入睡，再沿梦境里的楼梯和升降机下到地下湖。','Swim into the physical structure from underneath. Sleep at its green fire with the Artifact, then take the dream stairs and elevator down to the lake.'],
   ['现实里的箱体和梦境里岸边的储藏库不是同一套可直接打开的门。梦境岸边有三道封印、三组控制装置。','The physical container and dream vault are not doors you open in the same way. The dream shore has three seals and three control interfaces.']
  ],['IP_PRISON_X1','IP_PRISON_X2','IP_DREAM_LAKE_X1'],['vault']),
  n('vault-vision',['尝试开门，接住漏出的光','Try the vault and receive its vision'],['梦境 · 地下湖岸','Simulation · lake shore'],[
   ['转动储藏库前的机关。链条拉住门，片刻后绿光漏出；光中的记忆指向岛屿高塔上层壁画房间。','Turn the vault mechanism. The chains hold the door shut; light leaks out after a moment. Its vision points to the mural room high in the Island Tower.'],
   ['这是寻找下一条线索的提示，不是要求你对三个密码反复穷举。','This is a clue to your next investigation, not an instruction to brute-force three codes.']
  ],['IP_DREAM_LAKE_X2','IP_ZONE_2_CODE_R1']),
  n('symbol-room',['在梦境吹灭蜡烛，现实灯才灭','Extinguish dream candles to darken the real mural'],['现实岛屿高塔 ↔ 梦境星光海湾高塔','Physical Island Tower ↔ Starlit Cove tower'],[
   ['高塔背面入口通往上层。梦境中点亮通向塔后入口的路径，进入对应壁画房，吹灭两侧蜡烛；醒来查看现实中的暗壁画。','Use the tower’s rear entrance for its upper floor. In the dream, project the route to its rear entrance and extinguish the corresponding mural-room candles. Wake and inspect the now-dark physical mural.'],
   ['符号室三份封印内容已烧毁；焚片符号和控制室符号的序列还在。焚片序列才是追查档案馆的入口。','Three vault-code containers are burned. The slide-burning and control-room sequences remain. The slide-burning sequence advances the archive investigation.']
  ],['IP_ZONE_2_LIGHTHOUSE_X2','IP_DREAM_ZONE_2_X4','IP_ZONE_2_CODE_X1','IP_ZONE_2_CODE_X2','IP_ZONE_2_CODE_X3'],['tower']),
  n('temple',['用焚片符号打开遗弃神庙','Use the slide-burning code in the temple'],['隐藏峡谷 · 遗弃神庙','Hidden Gorge · Abandoned Temple'],[
   ['从峡谷侧面的通道进入神庙，而不是跨断桥。楼上输入符号室取得的序列，打开神庙地下密室。','Enter the temple via the gorge passage rather than the broken bridge. Enter the Symbol Room sequence upstairs to open the chamber below.'],
   ['记录显示居民曾扫描卷盘，再焚毁实体幻灯片；这里的地图投影标出三处隐藏焚片室。','A reel shows the inhabitants scanning reels before destroying physical slides. The map projections locate three concealed slide-burning rooms.']
  ],['IP_ZONE_3_LAB_X1','IP_ZONE_3_LAB_X3','IP_ZONE_3_LAB_X4','IP_ZONE_3_LAB_X2','IP_MAP_PROJECTION_1_X1','IP_MAP_PROJECTION_2_X1','IP_MAP_PROJECTION_3_X1']),
  n('burning-rooms',['三处焚片室 → 三个隐藏入口','Three burning rooms → three hidden entrances'],['河流洼地／余烬群岛／隐藏峡谷','River Lowlands / Cinder Isles / Hidden Gorge'],[
   ['按投影分别找回隐藏卷盘：洼地卷盘画出森林音乐屋的壁炉；群岛卷盘画出熄灯后的井；峡谷卷盘画出熄灯后的树形壁画。','Follow each projection to a hidden reel: the Lowlands reel shows a forest lodge fireplace, the Isles reel a darkened well, and the gorge reel a tree mural in darkness.'],
   ['这些是档案馆入口线索。没有要求按“森林→海湾→峡谷”固定顺序探索，也不要求把密码找齐。','These reveal archive entrances. The forest, cove and canyon have no mandatory visit order, and you are not collecting intact vault passwords.']
  ],['IP_ZONE_1_SECRET_X1','IP_ZONE_2_SECRET_X1','IP_ZONE_3_SECRET_X1'])
 ]},
 {id:'archives',title:L('04 三座档案馆，三种机制','04 Three archives, three mechanisms'),summary:L('每一列是“如何到达 → 学到什么”。档案馆本身没有可用的封印密码。','Each column reads “how to reach it → what it teaches.” None contains a usable seal code.'),nodes:[
  n('woods',['覆盖林地：从壁炉后进入','Shrouded Woodlands: behind the fireplace'],['河流洼地对应的梦境','The River Lowlands dream'],[
   ['跟随绿灯与音乐找到森林深处的集会屋；档案馆在屋内壁炉后。居民还在时会阻拦，不能只盯着火焰找开关。','Follow the lights and music to the gathering house. Its archive is behind the fireplace. The inhabitants obstruct access while present; the fire itself is not a switch puzzle.'],
   ['先打开这里通往木筏的路，再从不会被同一波洪水淹没的另一绿火房间进入，乘梦境木筏回来。洼地被淹后，屋内居民随现实火焰熄灭而消失。','Open the raft access first, then enter through another physical fire room unaffected by that flood and raft back. After the Lowlands flood, the occupants vanish as their physical flames go out.']
  ],['IP_DREAM_LIBRARY_1_R1','IP_DREAM_LIBRARY_1_X1','IP_DREAM_LIBRARY_1_X2'],['woods']),
  n('cove',['星光海湾：熄灯后下井','Starlit Cove: darken the well'],['岛屿高塔对应的梦境','The Island Tower dream'],[
   ['按卷盘线索找到区域的熄灯装置，关闭照亮井口的灯，再遮住文物的光越过警铃哨兵，下井绕开巡逻者抵达档案馆。','Find the area’s extinguishing mechanism, darken the well, then conceal your Artifact while passing the sentry. Descend and get around the patrolling inhabitants to reach the archive.'],
   ['只有自己藏光并不足以穿过仍被环境灯照亮的哨兵通路。这里学习的死亡机制可用于之后回访，但不是必须预先知道才能初次进馆。','Concealing your light alone will not help on a path still illuminated externally. The death mechanism taught here enables a later shortcut; it is not required knowledge for a first visit.']
  ],['IP_DREAM_ZONE_2_X2','IP_DREAM_LIBRARY_2_R1','IP_DREAM_LIBRARY_2_X1','IP_DREAM_LIBRARY_2_X2'],['simulation','alarm-discussion']),
  n('canyon',['无尽峡谷：暗处穿过树形壁画','Endless Canyon: through the dark tree mural'],['隐藏峡谷对应的梦境','The Hidden Gorge dream'],[
   ['找到通往熄灯装置的隐蔽路线，熄灭旅馆灯光；之后通向底层树形壁画。内部桥会随熄灯消失，需重新点亮或改从码头升降机侧进入。','Find the hidden route to the extinguishing mechanism and darken the lodge. Reach the tree mural below; the interior bridge goes out with the lights, so relight it or approach from the dock elevator.'],
   ['点亮内部桥的常规路线需要绕开居民；也可事先把升降机降到码头，熄灯后从另一绿火房间乘筏回来。后者减少潜行，不保证门前完全无人。','The normal internal-bridge route involves evading inhabitants. Alternatively, lower the dock elevator first and return by raft after darkening the lodge. This reduces stealth, not every possible encounter.']
  ],['IP_DREAM_ZONE_3_X2','IP_DREAM_LIBRARY_3_R1','IP_DREAM_LIBRARY_3_X1','IP_DREAM_LIBRARY_3_X2'],['canyon','lift-discussion']),
  n('raft-rule',['机制一：过渡黑暗中离开木筏','Mechanism 1: leave the raft in a transition'],['覆盖林地 · 禁忌档案室','Woodlands · Forbidden Archive'],[
   ['错误报告显示居民在区域切换的黑暗过渡中跳离木筏，落到模拟世界下方。普通露天河段跳水只会熄灭文物，不能替代这个条件。','The error report shows a passenger leaving a raft during the dark transition and falling beneath the simulation. Jumping into an ordinary open river extinguishes the Artifact instead.'],
   ['这提供从下层接近地下湖和一处封印的方法；也能用于重新访问部分档案馆。','This opens access to the lower lake and a seal, and can also shorten later archive visits.']
  ],['IP_DREAM_1_RULE_X1'],['raft-discussion']),
  n('death-rule',['机制二：死亡也能连接，警铃叫不醒','Mechanism 2: death connects; bells cannot wake the dead'],['星光海湾 · 禁忌档案室','Cove · Forbidden Archive'],[
   ['一卷显示入睡和死亡都能点亮文物；另一卷显示警铃无法唤醒已死的现实身体。持可用文物，在绿火范围内死亡，仍可进入模拟世界。','One reel shows both sleep and death lighting the Artifact. Another shows bells failing to wake a dead physical body. Dying within range of green fire while holding a working Artifact can still connect you.'],
   ['可站到绿火上实现；不是让失败原型爆炸。身体死后不能再靠警铃返回现实，探索时仍要保护文物火焰。','Standing in the green fire is one way; an exploding failed prototype is not a substitute. Bells cannot return a dead body to life, and your Artifact flame still needs protection.']
  ],['IP_DREAM_2_RULE_X1','IP_DREAM_2_RULE_X2'],['simulation','prototype']),
  n('radius-rule',['机制三：离开文物的投影范围','Mechanism 3: walk beyond the Artifact’s projection'],['无尽峡谷 · 禁忌档案室','Canyon · Forbidden Archive'],[
   ['放下点亮的文物，走得足够远，看到简化的绿色模拟结构；平常看不见的平台和路径在这里显露。','Set down the lit Artifact and walk beyond its projection radius to see the simplified green structure, including paths and platforms normally invisible.'],
   ['这不是关闭整座模拟世界。文物留在原处；看清路线后仍要按需要取回它，才能使用照光／熄火装置。','This does not turn off the simulation. The Artifact remains where you left it; retrieve it when light-operated mechanisms require it.']
  ],['IP_DREAM_3_RULE_X1'],['simulation'])
 ]},
 {id:'seals',title:L('05 用机制解开三道封印','05 Apply the mechanisms to three seals'),summary:L('三种方法分别解决三个障碍，全部完成才能打开储藏库。','Each mechanism solves a different obstacle. All three seals must be extinguished.'),nodes:[
  n('raft-seal',['渡筏封印：从世界下方接近','Raft seal: approach from beneath the world'],['梦境 · 地下湖下层','Simulation · lower lake'],[
   ['带着文物，在连接区域的黑暗过渡中离开木筏，落到下层。沿可行走的下层路径到相应封印，熄灭它的火。','Take the Artifact off a raft during a dark transition to land below. Follow the lower route to the corresponding seal and extinguish its flame.'],
   ['此方法绕过的是水面和渡行障碍；它不会顺便解除另外两道封印。','This bypasses the water-crossing obstacle; it does not disable the other two seals.']
  ],['IP_DREAM_1_RULE_X1','IP_DREAM_LAKE_X1'],['simulation']),
  n('alarm-seal',['警铃封印：让现实身体听不到','Alarm seal: remove the living body’s response'],['梦境 · 持续照明的哨兵通路','Simulation · the externally lit sentry path'],[
   ['持可用文物在现实绿火范围内死亡后进入。警铃虽然会响，无法叫醒现实身体；走过通路，熄灭对应封印。','Connect by dying at the physical green fire with a working Artifact. The alarm still rings but cannot wake the body; cross the path and extinguish its seal.'],
   ['这里有持续环境照明，仅遮住自己的文物解决不了问题。保持灰烬双星计划运行，仍能在记忆回传后开始下一循环。','The external lighting makes concealment alone insufficient. With the Ash Twin Project still active, memory transmission can still start your next loop.']
  ],['IP_DREAM_2_RULE_X1','IP_DREAM_2_RULE_X2'],['simulation','alarm-discussion']),
  n('bridge-seal',['隐桥封印：看见并对齐平台','Bridge seal: reveal and align the platforms'],['梦境 · 地下湖的隐形平台','Simulation · invisible lake platforms'],[
   ['把文物留在安全处，走出投影范围，观察控制装置如何改变平台位置。调整至连续可走的路径后，取回文物通过并熄灭封印。','Leave the Artifact somewhere safe, step beyond its projection, and observe how the interface moves the platforms. Align a walkable route, retrieve the Artifact, then cross and extinguish the seal.'],
   ['所需的是看清几何结构，不是从被烧毁的卷盘里找回一组完整密码。','You need to see the geometry, not recover an intact code from destroyed slides.']
  ],['IP_DREAM_3_RULE_X1','IP_ZONE_2_CODE_X2'],['simulation']),
  n('open-vault',['三道封印全灭 → 开门','All three seals out → open the vault'],['梦境 · 密封储藏库','Simulation · Sealed Vault'],[
   ['确认三个发光封印都已熄灭，回到岸边转动开门机关。进入储藏库，向下抵达幽禁者所在处。','Check that all three glowing seals are extinguished and operate the shore mechanism. Enter and descend to the Prisoner.'],
   ['解封发生在模拟世界；不要把它写成打开现实箱体、复活肉身或阻止太阳爆炸。','This releases a vault in the simulation; it does not open the physical container, revive a body, or stop the Sun.']
  ],['IP_SARCOPHAGUS_X2','IP_DREAM_LAKE_X1'],['vault'])
 ]},
 {id:'farewell',title:L('06 交换记忆，再决定如何告别','06 Exchange memories and say farewell'),summary:L('DLC的相遇有自己的终点；宇宙之眼仍沿本体路线抵达。','The encounter concludes here. Reaching the Eye still follows the base-game route.'),nodes:[
  n('meeting',['用视觉记忆互相讲述历史','Share history through visions'],['密封储藏库 · 幽禁者','Sealed Vault · the Prisoner'],[
   ['幽禁者先展示自己为何被囚禁。你再用视觉火把分享本星系的故事，使他知道短暂释放的信号曾被接收到。','The Prisoner shows why they were confined. Use the vision torch to share your solar system’s history, letting them learn that the briefly released signal was heard.'],
   ['为补全所展示的历史，建议先读旧定居点壁画或探索飞船，并调查闯入者核心。不必先通关本体；直接探索DLC也能相遇，但部分记忆片段会省略。','For a fuller vision, first investigate the Old Settlement murals or the Vessel, and the Interloper’s core. Completing the base ending is not required: a direct DLC playthrough can reach this encounter, but some historical scenes are omitted.']
  ],['IP_SARCOPHAGUS_X3','IP_SARCOPHAGUS_X4','DLG:Prisoner_Eye_Campfire:I hadn’t dared to hope'],['endings','vision-discussion']),
  n('farewell',['水边最后的愿景','The final vision at the water'],['地下湖 · 储藏库外','Subterranean Lake · outside the vault'],[
   ['幽禁者离开后，查看水边留下的视觉火把，观看最后的告别愿景。它不是一艘等待你实际登上的逃生船。','After the Prisoner leaves, inspect the vision torch at the water for their farewell. The vision is not an escape raft waiting for you to board.'],
   ['脚印通向水中；“熄灭火焰、结束模拟中的存在”是场景暗示，不要写成日志明确记载的对白或复活后的远航。','Footprints lead into the water. Ending their simulated existence is an implication of the scene, not an explicit spoken log entry or a voyage after physical revival.']
  ],['IP_SARCOPHAGUS_X5'],['vault']),
  n('eye-coda',['下一循环去眼，邀请他的记忆','On a later loop, reach the Eye and invite their memory'],['本体终局 · 远古空地营火','Base ending · Ancient Glade campfire'],[
   ['完成相遇后，不必在同一循环逃回飞船。保持计划运行，下一轮按本体路线取得核心、带入飞船、输入眼坐标。','You do not need to escape to the ship in the same loop. Keep the Project active, then follow the base route on a later loop: core, Vessel and Eye coordinates.'],
   ['眼中的幽禁者会询问你是否愿意记住他；可以邀请，也可以告别。相遇扩展了本体终局，不增加一套新的宇宙之眼坐标。','At the Eye, the Prisoner asks whether you want to remember them. You may invite them or say goodbye. The encounter enriches the ending without adding new Eye coordinates.']
  ],['DLG:Prisoner_Eye_Choice:Are you certain you want to remember me','DLG:Prisoner_Eye_Choice:Join us. Let’s see what happens.','DLG:Prisoner_Eye_Campfire:What comes next cannot be done alone'],['endings'])
 ]},
 {id:'history',title:L('07 把被删去的历史接回本体','07 Reconnect the erased history'),summary:L('这是历史因果链，独立于玩家寻找线索的顺序。','Historical causation is distinct from your order of discovery.'),nodes:[
  n('home-moon',['追随眼的信号，付出故乡的代价','Follow the signal at the cost of home'],['覆盖林地档案馆 · 完整历史卷盘','Woodlands archive · intact history reel'],[
   ['未焚毁的卷盘补出建造外星站的牺牲：他们消耗故乡资源建造远行设施，离开环状行星旁的母星卫星。','The intact reel restores the sacrifice behind the Stranger: their home moon’s resources were consumed to build the vessel that took them away.'],
   ['这里补全的是残缺历史，不是一件解封时必须携带的道具。','This completes a damaged historical record; it is not an item required at the vault.']
  ],['IP_DREAM_1_STORY_X1','IP_DREAM_1_STORY_X2'],['woods']),
  n('block-signal',['恐惧眼的力量，封锁信号','Fear the Eye and block its signal'],['星光海湾档案馆 · 完整历史卷盘','Cove archive · intact history reel'],[
   ['他们观察眼的力量后感到恐惧，建造并发射阻挡信号的装置。幽禁者在眼中的对白补充了这种拒绝结束的心态。','After observing the Eye’s power they became afraid, built a signal blocker and launched it. The Prisoner’s Eye dialogue adds their reluctance to let their story end.'],
   ['这是居民对眼的反应；不能把他们看到的毁灭图像直接当成“眼主动恶意杀害挪麦人”的证据。','This describes their response, not proof that the Eye maliciously killed the Nomai.']
  ],['IP_DREAM_2_STORY_X2','DLG:Prisoner_Eye_Choice:When my kind found the Eye']),
  n('build-dream',['把失去的故乡重建为模拟世界','Recreate their lost home in a simulation'],['无尽峡谷档案馆 · 完整历史卷盘','Canyon archive · intact history reel'],[
   ['完整卷盘说明梦境按他们的母星卫星重建。现实肉身死亡后，点亮的文物仍可维持连接；不等于真实故乡被复原。','The intact reel shows a simulation modeled on their home moon. Lit Artifacts can sustain a connection after physical death; the real home moon was not restored.'],
   ['被焚毁的实体记录和模拟世界中的完整档案共同解释了为何玩家必须追查被隐藏的资料。','The burned physical records and intact simulated archives explain why the missing history must be recovered from hidden places.']
  ],['IP_DREAM_3_STORY_X2','IP_ZONE_3_LAB_X2','IP_DREAM_2_RULE_X1']),
  n('release-signal',['短暂放开信号 → 被永久幽禁','Briefly release the signal → imprisonment'],['幽禁者的视觉记忆','The Prisoner’s vision'],[
   ['幽禁者曾关闭阻挡装置，眼的信号短暂传出；其他居民重新封锁信号，并把他囚禁。封印密码随后被销毁。','The Prisoner briefly disabled the blocker. The others restored it and confined them; the seal codes were later destroyed.'],
   ['“短暂”有幽禁者对白支持，具体持续多久没有明确记载；不要为此补造时间表。','The Prisoner explicitly describes a brief release. Its exact duration is not stated.']
  ],['IP_SARCOPHAGUS_X3','IP_ZONE_2_CODE_X2','DLG:Prisoner_Eye_Campfire:I hadn’t dared to hope']),
  n('heard-signal',['那次回声把两段故事连起来','That brief echo connects both stories'],['幽禁者 ↔ 挪麦飞船 ↔ 玩家','Prisoner ↔ Nomai Vessel ↔ you'],[
   ['玩家展示的记忆把信号、挪麦人的追寻、灭绝和哈斯人的探索连在一起。幽禁者终于知道自己的行动并未毫无结果。','Your vision connects the signal with the Nomai search, their extinction and Hearthian exploration. The Prisoner learns that their action was not in vain.'],
   ['这是一条跨时代的因果联系，不能把幽禁者、艾斯科尔和现代哈斯人画成见过面的同代团队。','This is a causal link across eras, not evidence that the Prisoner, Escall and modern Hearthians met or worked together.']
  ],['IP_SARCOPHAGUS_X4','DLG:Prisoner_Eye_Choice:my efforts weren’t in vain','DLG:Prisoner_Eye_Campfire:I hadn’t dared to hope'])
 ]},
 {id:'alternatives',title:L('08 另外可走的路，不倒置初次线索','08 Alternatives without circular prerequisites'),summary:L('橙色是可选绕路。先学会机制，和用机制回访，是两件事。','Orange marks optional alternatives. Learning a mechanism and using it to revisit are different steps.'),nodes:[
  n('lift-route',['峡谷：先降升降机，再绕回码头','Canyon: lower the elevator, return by raft'],['亮灯时准备 → 熄灯 → 换入口乘筏','Prepare with lights on → darken → raft from another fire'],[
   ['亮灯时走到内部桥另一侧，把码头升降机降下。返回熄灯装置关灯，离开梦境，从另一现实绿火房间重新进入，乘梦境木筏回峡谷。','With the lights on, cross the interior bridge and lower the dock elevator. Darken the lodge, leave the dream, re-enter through another physical fire and raft back to the canyon.'],
   ['升降机把你带到树形壁画那一侧，绕过大段旅馆。无需预先知道投影范围机制；仍应观察底层居民的位置。','The elevator returns you to the mural side, bypassing much of the lodge. You do not need advance knowledge of projection radius; check inhabitants near the lower route.']
  ],['IP_DREAM_LIBRARY_3_R1'],['lift-discussion','canyon']),
  n('known-radius',['已知投影机制：峡谷隐桥回访','Known projection mechanism: canyon bridge shortcut'],['无尽峡谷 · 码头侧隐桥','Endless Canyon · hidden dock-side bridge'],[
   ['如果已经发现离灯机制，可以先查看隐形桥，再取回文物沿记住的路径前往码头侧。树形壁画仍需要处于黑暗中。','If you already know the radius mechanism, reveal the hidden bridge, retrieve the Artifact and follow the remembered path toward the dock side. The tree mural must still be dark.'],
   ['不要把这条捷径画成初次进入档案馆的唯一前置，否则会变成“先知道馆内答案才能进馆”的循环。','Do not make this the only first-visit prerequisite: that would require knowing the archive’s answer before entering it.']
  ],['IP_DREAM_3_RULE_X1'],['canyon','raft-discussion']),
  n('known-death',['已知死亡机制：海湾警铃回访','Known death mechanism: revisit the cove'],['星光海湾 · 水井','Starlit Cove · well'],[
   ['如果已自行试出死亡连接，或已经看过档案卷盘，可在绿火旁死亡后穿过警铃区域。它是替代进入方式，不是初次探索必须取得的能力。','If you independently discover death-connection or have seen its reel, enter after physical death and pass the alarm. It is an alternative route, not an ability required for the first visit.'],
   ['死亡不能让你无视巡逻者或火焰熄灭；这两类障碍与警铃不同。','Death does not make you immune to inhabitants or an extinguished flame. Those are different hazards.']
  ],['IP_DREAM_2_RULE_X1','IP_DREAM_2_RULE_X2'],['raft-discussion','simulation']),
  n('known-raft',['已知过渡机制：从下层回访森林档案','Known transition mechanism: revisit from below'],['区域切换黑暗 → 地下湖','Dark transition → Subterranean Lake'],[
   ['在正确过渡时机离筏到下层，可接近森林档案馆。普通跳河不行；只有首次已学会或偶然试出，才能把它作为你的路线。','Leaving a raft in the correct transition reaches the lower area near the forest archive. An ordinary river jump will not. This route assumes prior knowledge or independent discovery.'],
   ['常规路线仍是从其他入口等待洼地火焰熄灭后返回；无需先靠捷径取得它自身的线索。','The regular route still works: return from another fire after the Lowlands flames go out. No shortcut is required to learn its own clue.']
  ],['IP_DREAM_1_RULE_X1'],['raft-discussion','woods']),
  n('control-room',['阻挡器控制室不是第四道封印','The blocker control room is not a fourth seal'],['现实 · 水库','Physical world · Reservoir'],[
   ['符号室另有控制室序列，可查看水库控制室的烧毁界面和断开连接的投影。它补充历史与技术背景。','The Symbol Room also has a control-room sequence. Inside the Reservoir room are a burned interface and a disconnected-link projection, adding historical and technical context.'],
   ['不必修复它才能完成DLC，也不应把“关闭阻挡器、找到眼的新坐标”写成玩家的必经目标。','Repairing it is not a DLC completion requirement. Do not invent a mandatory objective to disable the blocker or find new Eye coordinates.']
  ],['IP_ZONE_4_X3','IP_ZONE_2_CODE_X1'])
 ]},
 {id:'limits',title:L('09 时间、循环与两种替代结局','09 Time, the loop and two alternative endings'),summary:L('普通DLC探索保留灰烬双星计划；两项替代结局需要先停掉循环。','Keep the Ash Twin Project active for normal exploration. Both alternatives require disabling the loop first.'),nodes:[
  n('flood',['洪水改变入口，现实身体决定断连','The flood changes access; the physical body matters'],['现实外星站 ↔ 梦境','Physical Stranger ↔ simulation'],[
   ['约循环第13分钟大坝溃决，洼地绿火被淹；岛屿高塔更晚倒塌，约20分30秒。峡谷入口位于更高处，不会被同一波洪水淹没。','The dam breaks at roughly 13 minutes, flooding the Lowlands fire. The Island Tower falls later, around 20:30. The higher gorge fire is not flooded by the same wave.'],
   ['这些是近似流程时间，并非游戏文本给出的精确倒计时。从洼地入梦的人自己也会断连，不能原地等待居民消失后继续行动。','These are approximate gameplay timings, not exact timers stated in the text. If your body is at the Lowlands fire, you disconnect too; do not wait there expecting to remain after the occupants vanish.']
  ],['IP_ZONE_4_X4'],['tower','woods','canyon']),
  n('loop',['外星站逃过爆炸，不等于逃过记忆回传','Escaping the blast does not escape memory transmission'],['外星站轨迹／灰烬双星计划','Stranger trajectory / Ash Twin Project'],[
   ['外星站自动驶出超新星范围。但只要灰烬双星计划仍运行，结束时仍会回传你的记忆；在绿火旁死亡解谜也没有自动关闭计划。','The Stranger moves beyond the supernova. While the Ash Twin Project remains active, it still transmits your memories; dying at a green fire does not disable the Project.'],
   ['完成幽禁者相遇无需先取出高级核心。先停循环反而会改变死亡与等待的结果。','The Prisoner encounter does not require removing the advanced warp core. Disabling the loop changes what death and waiting do.']
  ],['IP_ZONE_4_X4','TT_TIME_LOOP_DEVICE_X3','GD_STATUE_WORKSHOP_X2','IP_DREAM_2_RULE_X1'],['endings']),
  n('stranger-ending',['替代结局：被遗弃的世界','Alternative ending: the abandoned world'],['先取出高级核心 → 外星站等候','Remove the advanced core → wait aboard the Stranger'],[
   ['先关闭灰烬双星计划，再留在驶出爆炸范围的现实外星站，等待终局文本出现。仅仅飞来外星站、保持循环开启，不会得到这个结局。','Disable the Ash Twin Project, then wait in the physical Stranger beyond the blast. Visiting with the loop still active does not trigger this ending.'],
   ['结局原文已提取，编号814；简中对“beyond the reach of the supernova”的表述不够自然，机制判断同时核对英文。','The extracted ending text is UI 814. Its Chinese wording of “beyond the reach of the supernova” is awkward, so the English also informs the interpretation.']
  ],['UI:814'],['endings']),
  n('dream-ending',['替代结局：无法醒来的梦','Alternative ending: unable to wake'],['先关闭计划 → 绿火旁死亡 → 留在模拟世界','Disable the Project → die at green fire → remain in the simulation'],[
   ['先取出高级核心，带可用文物在绿火旁死亡并进入模拟世界，保持文物火焰且不要被终止连接，等待结局。','Remove the advanced warp core, connect by dying at a green fire with a working Artifact, and remain connected with its flame intact until the ending.'],
   ['这是编号815的替代结局，不是普通解封时每次在绿火上死亡都会触发的结局，也不是救出幽禁者后的必然收场。','This is alternative ending UI 815, not the result of every green-fire death during normal exploration, nor the unavoidable end of meeting the Prisoner.']
  ],['UI:815','IP_DREAM_2_RULE_X1'],['endings'])
 ]}
];

const e=(from,to,kind='learn',zh='线索指向',en='leads to')=>({from,to,kind,label:L(zh,en)});
export const DLC_EDGES = [
 e('radio','alignment'),e('alignment','stranger'),e('stranger','artifact'),e('stranger','lab'),e('stranger','fire-rooms'),
 e('lab','dream','learn','学会使用方法','teaches connection'),e('artifact','dream','need','持有文物','Artifact required'),e('fire-rooms','dream','need','绿火旁','at green fire'),
 e('dream','lake'),e('lake','vault-vision'),e('vault-vision','symbol-room'),e('symbol-room','temple'),e('temple','burning-rooms'),
 e('burning-rooms','woods'),e('burning-rooms','cove'),e('burning-rooms','canyon'),
 e('woods','raft-rule','learn','馆内错误报告','error report'),e('cove','death-rule','learn','馆内错误报告','error report'),e('canyon','radius-rule','learn','馆内错误报告','error report'),
 e('raft-rule','raft-seal','need','应用机制','apply'),e('death-rule','alarm-seal','need','应用机制','apply'),e('radius-rule','bridge-seal','need','应用机制','apply'),
 e('raft-seal','open-vault','need','全部解除','all required'),e('alarm-seal','open-vault','need','全部解除','all required'),e('bridge-seal','open-vault','need','全部解除','all required'),
 e('open-vault','meeting'),e('meeting','farewell'),e('farewell','eye-coda','optional','可选：本体终局','optional'),
 e('home-moon','block-signal','history','历史：先后','history'),e('block-signal','build-dream','history','历史：后续','history'),e('build-dream','release-signal','history','历史：后续','history'),e('release-signal','heard-signal','history','跨时代的因果','across eras'),
 e('canyon','lift-route','alternative','另一解','alternative'),e('radius-rule','known-radius','alternative','已知后回访','revisit'),e('death-rule','known-death','alternative','已知后回访','revisit'),e('raft-rule','known-raft','alternative','已知后回访','revisit')
];
