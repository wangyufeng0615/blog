// Source data for /outer-wilds-clues/. gen.mjs resolves q(...) quotes against the extracted game text
// (official English + Simplified Chinese) and writes the published assets.
// Node: { id, t: goal|target|gate|clue|alt|loc, label, place, info[], quote[], src[], req: all|any,
//         alt: official|luck, at: <loc id> (where to read how to get there), tag: timing|risk, verify, kids[] }
export const L = (zh, en) => ({ zh, en });
// LOG:<ship log entry id> · NOMAI:<substring of the English text> · DLG:<substring of dialogue/sign text>
export const q = (key) => ({ $q: key });
const wiki = (page, en, zh = en) => ({ label: L(`官方 Wiki · ${zh}`, `Outer Wilds Wiki · ${en}`), url: `https://outerwilds.fandom.com/wiki/${page}` });
const TIMING = 'timing';

export const BANDS = [
  {
    key: 'main',
    title: L('通关主线', 'Main path'),
    band: L('', ''),
    roots: [{
      id: 'goal', t: 'goal', label: L('跃迁到宇宙之眼', 'Warp to the Eye of the Universe'), place: L('黑棘星深处 · 挪麦飞船舰桥', 'Deep in Dark Bramble · the Vessel’s bridge'), req: 'all',
      info: [L('把高级跃迁核心装进飞船，在舰桥的三面柱上输入坐标，飞船就会跃迁到宇宙之眼。', 'Install the advanced warp core in the Vessel, enter the coordinates on the three-sided pillar on the bridge, and the Vessel warps to the Eye.'),
             L('取出核心的同时时间循环就停了，所以这一步只能放在最后一轮。', 'Taking the core out stops the time loop, so this has to be your last loop.')],
      quote: [q('LOG:DB_VESSEL_X6')],
      kids: [
        { id: 'g-start', t: 'gate', label: L('拿到发射密码，起飞', 'Get the launch codes and lift off'), place: L('木炉星 · 天文台的霍恩费斯', 'Timber Hearth · Hornfels at the observatory'), req: 'all',
          info: [L('一切的起点。去天文台找霍恩费斯拿发射密码，才能坐升降梯上发射台。', 'Where it all starts: Hornfels at the observatory gives you the launch codes for the launch tower lift.')],
          quote: [q('DLG:Here they are. Best get off the ground before Slate')],
          kids: [
            { id: 'c-loop', t: 'clue', label: L('你被困在 22 分钟的循环里', 'You are stuck in a 22-minute loop'), place: L('木炉星 · 天文台的挪麦雕像', 'Timber Hearth · the Nomai statue in the observatory'),
              info: [L('第一次死亡或看到超新星后，你会在营火边重新醒来。原因是天文台的挪麦雕像睁眼和你配对了，之后每一轮你都带着记忆回来。', 'After your first death or supernova you wake at the campfire again: the observatory’s Nomai statue opened its eyes and paired with you, so you keep your memories every loop.')],
              quote: [q('LOG:TH_VILLAGE_X2')] }
          ] },
        { id: 'coords', t: 'target', label: L('宇宙之眼坐标', 'The Eye’s coordinates'), place: L('深巨星核心 · 探测器跟踪模块', 'Giant’s Deep core · Probe Tracking Module'), req: 'all',
          info: [L('跟踪模块从轨道探测炮上脱落，沉进了深巨星核心。它的投影池里存着第 9,318,054 号探测器找到的宇宙之眼坐标。', 'The tracking module broke off the Orbital Probe Cannon and sank to the core of Giant’s Deep. Its projection pool holds the coordinates found by probe 9,318,054.')],
          quote: [q('LOG:OPC_SUNKEN_MODULE_X2')],
          kids: [
            { id: 'g-sunk', t: 'gate', label: L('模块沉在了海底', 'The module sank'), req: 'any',
              info: [L('先得知道坐标在海底，才会去想办法下潜。', 'You have to know the coordinates are underwater before you look for a way down.')],
              kids: [
                { id: 'c-dmg', t: 'clue', label: L('损伤报告：跟踪模块遗失', 'Damage report: tracking module missing'), place: L('轨道探测炮 · 控制模块', 'Orbital Probe Cannon · Control Module'), quote: [q('NOMAI:Probe Tracking Module: MISSING')] },
                { id: 'c-cassava', t: 'clue', label: L('有部件沉到了水流下面', 'A part sank below the current'), place: L('碎空星南部天文台 / 建造厂', 'Southern Observatory / Construction Yard'), at: 'r-observatory', quote: [q('LOG:GD_OCEAN_R2')] },
                { id: 'c-feld-core', t: 'clue', label: L('费尔德斯巴到过核心', 'Feldspar reached the core'), place: L('深巨星 · 荆棘岛上他的旧营地', 'Giant’s Deep · his old camp on Bramble Island'), quote: [q('LOG:GD_OCEAN_R3')] }
              ] },
            { id: 'g-current', t: 'gate', label: L('潜到水流下面', 'Below the current'), place: L('深巨星海面下的强水流', 'The strong current under the ocean'), req: 'any',
              info: [L('深巨星海面下有一层强水流，正常情况下任何东西都沉不下去。', 'A strong current under the surface of Giant’s Deep keeps everything from sinking.')],
              quote: [q('LOG:GD_OCEAN_R1')],
              kids: [
                { id: 'c-tornado', t: 'clue', label: L('逆时针气旋会往下压', 'Counterclockwise cyclones push down'), place: L('碎空星 · 南部天文台的气旋模型', 'Brittle Hollow · cyclone model in the Southern Observatory'), at: 'r-observatory', quote: [q('LOG:BH_TORNADO_SIMULATION_X2')] },
                { id: 'a-cur-accident', t: 'alt', alt: 'luck', label: L('碰巧被逆时针气旋卷下去', 'Get swept down by luck'), place: L('深巨星海面', 'Giant’s Deep'),
                  info: [L('费尔德斯巴自己就是这么发现的。', 'That is how Feldspar found it.')], quote: [q('DLG:I found that bit out by accident')] },
                { id: 'a-cur-dive', t: 'alt', alt: 'luck', label: L('高速直冲核心', 'Dive in at very high speed'), place: L('深巨星', 'Giant’s Deep'),
                  info: [L('速度够快（每秒约一万米）可以直接冲破水流，撞上岛就会死。有对应的成就。', 'Fast enough (around 10 km/s) and you punch straight through; hit an island and you die. There is an achievement for it.')], src: [wiki('Giant%27s_Deep', 'Giant’s Deep', '深巨星')] },
                { id: 'a-cur-island', t: 'alt', alt: 'luck', label: L('停在被抛起的岛下面', 'Wait under a thrown island'), place: L('深巨星', 'Giant’s Deep'),
                  info: [L('岛被气旋抛上天再砸回海面时，有时会把下面的飞船压到水流以下。', 'When a cyclone throws an island and it crashes back down, it can push a ship underneath below the current.')], src: [wiki('Giant%27s_Deep', 'Giant’s Deep', '深巨星')] },
                { id: 'a-cur-shuttle', t: 'alt', alt: 'luck', label: L('用重力炮把航天飞机打过去', 'Fire the Nomai shuttle at it'), place: L('碎空星重力炮 → 深巨星', 'Brittle Hollow gravity cannon → Giant’s Deep'),
                  info: [L('两颗星靠近时，用碎空星重力炮发射所莱内姆的航天飞机，能穿过水流，但穿不过核心外的电场。前提是已经把它从量子卫星召回来。', 'Launch Solanum’s shuttle from the Brittle Hollow gravity cannon when the planets are close. It gets below the current but not through the electric field. You need to have recalled it from the Quantum Moon first.')], src: [wiki('Giant%27s_Deep', 'Giant’s Deep', '深巨星')] }
              ] },
            { id: 'g-field', t: 'gate', label: L('穿过核心外的电场', 'Get through the electric field'), place: L('深巨星核心外围', 'Around Giant’s Deep’s core'), req: 'any',
              quote: [q('LOG:GD_OCEAN_X1')],
              kids: [
                { id: 'c-jelly', t: 'clue', label: L('水母内部是绝缘的', 'Jellyfish insides are insulated'), place: L('黑棘星南极外壳 · 空心藤尽头的冻水母', 'Dark Bramble’s south pole crust · frozen jellyfish at the end of the hollow vine'), req: 'all',
                  info: [L('问费尔德斯巴怎么去深巨星核心，他不直说，只让你去他飞船撞上的那根空心藤尽头看看。藤通到黑棘星外壳的一道裂缝，里面冻着一只水母和他的笔记。钻进深巨星的水母体内，就能随它穿过电场。', 'Ask Feldspar how to reach Giant’s Deep’s core and he only tells you to see where the hollow vine his ship hit ends. It leads to a crack in Dark Bramble’s outer crust with a frozen jellyfish and his notes. Get inside a Giant’s Deep jellyfish and ride it through the field.')],
                  quote: [q('LOG:DB_FROZEN_JELLYFISH_R1'), q('LOG:DB_FROZEN_JELLYFISH_X1'), q('LOG:DB_FROZEN_JELLYFISH_X3')],
                  kids: [
                    { id: 'g-findfeld', t: 'gate', label: L('费尔德斯巴的营地', 'Feldspar’s camp'), place: L('黑棘星某颗种子里', 'Inside one of Dark Bramble’s seeds'), req: 'any',
                      kids: [
                        { id: 'c-harmonica', t: 'clue', label: L('口琴信号', 'Harmonica signal'), place: L('信号镜 · 旅行者频道', 'Signalscope · Travelers frequency'), quote: [q('LOG:TH_IMPACT_CRATER_R1')] },
                        { id: 'c-thseed', t: 'clue', label: L('侦察兵射进木炉星的种子', 'Scout into Timber Hearth’s seed'), place: L('木炉星 · 撞击坑', 'Timber Hearth · impact crater'), quote: [q('LOG:DB_FELDSPAR_R2')] },
                        { id: 'c-bramisland', t: 'clue', label: L('荆棘岛上的旧营地', 'Old camp on Bramble Island'), place: L('深巨星 · 荆棘岛', 'Giant’s Deep · Bramble Island'), quote: [q('LOG:GD_BRAMBLE_ISLAND_X1')] },
                        { id: 'a-feld-wander', t: 'alt', alt: 'luck', label: L('在黑棘星里乱逛撞见', 'Stumble on him in Dark Bramble'), place: L('黑棘星', 'Dark Bramble') }
                      ] },
                    { id: 'g-angler', t: 'gate', label: L('活着躲过安康鱼', 'Get past the anglerfish'), place: L('黑棘星内部', 'Inside Dark Bramble'), req: 'any',
                      info: [L('飞船线和水母线都要穿过黑棘星：入口的中枢里就有一条，飞船所在的种子更是在有五条安康鱼的鱼巢里。', 'Both the Vessel line and the jellyfish line run through Dark Bramble: one waits in the hub you enter first, and the Vessel’s seed sits in the nest guarded by five.')],
                      kids: [
                        { id: 'c-fossil', t: 'clue', label: L('安康鱼是瞎的，靠听声', 'Anglerfish are blind and hunt by sound'), place: L('余烬双星 · 安康鱼化石', 'Ember Twin · anglerfish fossil'), at: 'r-fossil',
                          info: [L('关掉引擎靠惯性滑过去，安康鱼就发现不了你。', 'Cut the engines and drift; they won’t notice you.')], quote: [q('LOG:CT_ANGLERFISH_FOSSIL_X2')] },
                        { id: 'a-ang-drift', t: 'alt', alt: 'luck', label: L('出种子后什么都不按', 'Do nothing after entering a seed'), place: L('黑棘星', 'Dark Bramble'),
                          info: [L('从种子出来时速度和方向是固定的，什么都不按就能稳定漂过去；转动机身不会惊动它们。', 'You always come out of a seed at a fixed speed and heading, so doing nothing drifts you past reliably. Rotating the ship doesn’t alert them.')], src: [wiki('Anglerfish', 'Anglerfish', '安康鱼')] },
                        { id: 'a-ang-dodge', t: 'alt', alt: 'luck', label: L('全速甩开，或让它卡在藤蔓间', 'Outrun them or snag them on vines'), place: L('黑棘星', 'Dark Bramble'), src: [wiki('Anglerfish', 'Anglerfish', '安康鱼')] }
                      ] }
                  ] },
                { id: 'a-jelly-crust', t: 'alt', alt: 'luck', label: L('从外面撞见冻水母', 'Find the frozen jellyfish from outside'), place: L('黑棘星南极的外壳碎片', 'Dark Bramble’s south pole crust'),
                  info: [L('那道裂缝也能从黑棘星外面找到，不必先见费尔德斯巴。', 'The crack can also be found from outside Dark Bramble, without meeting Feldspar first.')], src: [wiki('Dark_Bramble', 'Dark Bramble', '黑棘星')] }
              ] }
          ] },

        { id: 'vessel', t: 'target', label: L('进入挪麦飞船', 'Reach the Nomai Vessel'), place: L('黑棘星深处', 'Deep in Dark Bramble'), req: 'all',
          info: [L('飞船当年被黑棘星缠住，跃迁核心摔坏了，但还能接收消息，也存着宇宙之眼的原始信号。', 'Dark Bramble caught the Vessel and broke its warp core, but it can still receive messages and holds the Eye’s original signal.')],
          quote: [q('LOG:DB_VESSEL_R3')],
          kids: [
            { id: 'g-knowvessel', t: 'gate', label: L('有一艘飞船', 'There is a Vessel'), req: 'any',
              kids: [
                { id: 'c-murals', t: 'clue', label: L('三块壁画', 'The three murals'), place: L('碎空星 · 旧定居点', 'Brittle Hollow · Old Settlement'), at: 'r-oldsettle', quote: [q('LOG:BH_MURAL_2_X1')] },
                { id: 'c-podlogs', t: 'clue', label: L('逃生舱飞行日志', 'Escape pod flight logs'), place: L('碎空星 / 余烬双星的逃生舱', 'Escape pods on Brittle Hollow / Ember Twin'), quote: [q('LOG:BH_ESCAPE_POD_X2')] }
              ] },
            { id: 'g-whichseed', t: 'gate', label: L('飞船在哪颗种子里', 'Which seed hides the Vessel'), place: L('黑棘星', 'Dark Bramble'), req: 'any',
              kids: [
                { id: 'c-nest', t: 'clue', label: L('另一个入口在安康鱼巢里', 'The other way in is in the anglerfish nest'), place: L('黑棘星 · 鱼巢里那颗不发光的种子', 'Dark Bramble · the unlit seed in the nest'), req: 'all',
                  info: [L('坟墓那颗种子太小，只有侦察兵进得去。侦察兵进去后，追踪器显示它同时在两个地方：另一处是安康鱼巢里一颗不发光的大种子，飞船只能从那里进。这就是两个信标的真相。', 'The grave seed only fits your scout. Once inside, the tracker shows the scout in two places at once; the other is an unlit, ship-sized seed in the anglerfish nest. That is the second beacon.')],
                  src: [wiki('The_Vessel', 'The Vessel', '飞船')],
                  kids: [
                    { id: 'c-grave', t: 'clue', label: L('侦察兵射进坟墓的小种子', 'Fire the scout into the grave’s small seed'), place: L('黑棘星 · 挪麦坟墓', 'Dark Bramble · Nomai Grave'), req: 'all',
                      quote: [q('LOG:DB_NOMAI_GRAVE_X4')],
                      kids: [
                        { id: 'c-pod3', t: 'clue', label: L('3号逃生舱：两个信标', 'Escape Pod 3: two beacons'), place: L('顺着信号镜的求救信号找到', 'Found by its distress signal on the signalscope'),
                          info: [L('找到碎空星或余烬双星的逃生舱后，信号镜会多出"求救信号"频道，黑棘星里有一颗种子正发着这个信号。舱里的人测到两个一模一样的飞船信标，跟着近的那个走，沿途留下一串灯，最后死在小种子前。顺着灯就能找到坟墓。', 'After you find the escape pod on Brittle Hollow or Ember Twin, your signalscope picks up the distress frequency, and one seed in Dark Bramble is sending it. The survivors heard two identical Vessel beacons, followed the nearer one leaving a trail of lights, and died at a small seed. Follow the lights to the grave.')],
                          quote: [q('LOG:DB_ESCAPE_POD_X3')], src: [wiki('Escape_Pods', 'Escape Pods', '逃生舱')] }
                      ] },
                    { id: 'c-feld-two', t: 'clue', label: L('费尔德斯巴：这里的空间不正常', 'Feldspar: space works differently here'), place: L('黑棘星 · 费尔德斯巴的营地', 'Dark Bramble · Feldspar’s camp'),
                      quote: [q('LOG:DB_FELDSPAR_X2')] }
                  ] },
                { id: 'a-seed-explore', t: 'alt', alt: 'luck', label: L('在黑棘星里一颗颗试', 'Search the seeds one by one'), place: L('黑棘星', 'Dark Bramble'),
                  info: [L('飞船所在的种子就在安康鱼巢里，是唯一不发光的那颗；巢里另外三颗通向一个死循环的空间。', 'The Vessel’s seed is in the anglerfish nest — the only one that doesn’t glow; the other three lead to a space that loops back on itself.')], src: [wiki('Dark_Bramble', 'Dark Bramble', '黑棘星')] }
              ] },
            { ref: 'g-angler' }
          ] },

        { id: 'core', t: 'target', label: L('取得高级跃迁核心', 'Take the advanced warp core'), place: L('灰烬双星 · 中央舱室', 'Ash Twin · central chamber'), req: 'all',
          info: [L('灰烬双星计划的核心。飞船原来的核心坏了，只有这一颗能带它跃迁。', 'The core that powers the Ash Twin Project. The Vessel’s own core is broken; this is the only one that can make it warp.')],
          quote: [q('LOG:TT_TIME_LOOP_DEVICE_X5')],
          kids: [
            { id: 'g-whereatp', t: 'gate', label: L('计划在灰烬双星中心', 'The project is inside Ash Twin'), req: 'any',
              kids: [
                { id: 'c-atp4', t: 'clue', label: L('四处原文都指向它', 'Four places point to it'), place: L('高能实验室 / 矿井 / 雕塑车间 / 黑洞熔炉', 'High Energy Lab / mines / Statue Workshop / Black Hole Forge'), at: 'r-workshop',
                  info: [L('高能实验室提议选址灰烬双星；木炉星矿井在造它的保护壳；雕塑车间的面具装在里面；黑洞熔炉为它铸核心。', 'The High Energy Lab proposed Ash Twin; Timber Hearth’s mines supplied its shell; the Statue Workshop’s masks are inside; the Black Hole Forge cast its core.')],
                  quote: [q('LOG:CT_HIGH_ENERGY_LAB_X3')] }
              ] },
            { id: 'g-sealed', t: 'gate', label: L('只能跃迁进去', 'You can only warp in'), req: 'any',
              kids: [
                { id: 'c-mine', t: 'clue', label: L('保护壳没有任何入口', 'The shell has no physical entrance'), place: L('木炉星 · 挪麦矿井', 'Timber Hearth · Nomai Mines'), at: 'r-mine', quote: [q('LOG:TH_NOMAI_MINE_X2')] },
                { id: 'a-sealed-try', t: 'alt', alt: 'luck', label: L('飞过去发现进不去', 'Fly there and find no way in'), place: L('灰烬双星', 'Ash Twin') }
              ] },
            { id: 'g-warp', t: 'gate', label: L('跃迁平台怎么用', 'How warp pads work'), req: 'any',
              kids: [
                { id: 'c-whs', t: 'clue', label: L('站上平台，等目标过头顶', 'Stand on the pad until the target is overhead'), place: L('白洞站', 'White Hole Station'), req: 'all',
                  quote: [q('LOG:WHS_X1')],
                  kids: [
                    { id: 'c-bhfall', t: 'clue', label: L('掉进碎空星的黑洞', 'Fall into Brittle Hollow’s black hole'), place: L('碎空星中心', 'Brittle Hollow’s core'),
                      info: [L('碎空星的地壳一直在碎，掉进中心黑洞的东西会从白洞出来，白洞站就在旁边。', 'Brittle Hollow’s crust keeps breaking up; whatever falls into the central black hole comes out of the white hole, next to the station.')], quote: [q('LOG:WHS_R1')] }
                  ] },
                { id: 'c-window', t: 'clue', label: L('对齐有约五度的窗口', 'Alignment has a ~5° window'), place: L('碎空星 · 黑洞熔炉', 'Brittle Hollow · Black Hole Forge'), at: 'r-forge', quote: [q('LOG:BH_WARP_ALIGNMENT_MAP_X4')] },
                { id: 'a-warp-accident', t: 'alt', alt: 'luck', label: L('碰巧站上平台被传走', 'Get warped by accident'), place: L('任意跃迁平台', 'Any warp pad') }
              ] },
            { id: 'g-receiver', t: 'gate', label: L('通往计划的那座塔', 'The tower that leads into the project'), place: L('灰烬双星赤道 · 一对用桥相连的塔', 'Ash Twin’s equator · a pair of towers joined by a bridge'), req: 'any',
              kids: [
                { id: 'c-deduce', t: 'clue', label: L('推理：余烬双星到头顶时它就启动', 'Deduce: it fires when Ember Twin is overhead'), req: 'all',
                  info: [L('赤道那圈塔各通一处，样子对应目的地。有一座塔看起来永远对不上，因为它的接收点就在灰烬双星中心。按熔炉的规则，沙漏双星共用两星之间的对准点：站在这座塔里的平台上，等余烬双星经过头顶，就会被传进计划。', 'Each tower on the equator leads somewhere and looks like its destination. One seems like it could never align, because its receiver is inside Ash Twin itself. By the Forge’s rule the twins share an alignment point between them: stand on the pad inside that tower and wait for Ember Twin to pass overhead.')],
                  kids: [
                    { id: 'c-towermap', t: 'clue', label: L('高塔设计图', 'The tower designs'), place: L('余烬双星 · 高能实验室', 'Ember Twin · High Energy Lab'), at: 'r-hel', quote: [q('LOG:CT_WARP_TOWER_MAP_X3'), q('NOMAI:The tower designs in the High Energy Lab')] },
                    { id: 'c-forge', t: 'clue', label: L('双星共用一个对准点', 'The twins share an alignment point'), place: L('碎空星 · 黑洞熔炉', 'Brittle Hollow · Black Hole Forge'), at: 'r-forge', quote: [q('NOMAI:Yarrow believes he spotted a flaw'), q('LOG:BH_BLACK_HOLE_FORGE_X6')] }
                  ] },
                { id: 'a-recv-body', t: 'alt', alt: 'official', label: L('正确的塔外有挪麦遗体', 'A Nomai body lies outside the right tower'), place: L('灰烬双星 · 计划塔', 'Ash Twin · project tower'),
                  info: [L('通往计划的那座塔门口躺着一具挪麦遗体，可以当作认塔的标记。', 'A Nomai body lies at the door of the tower that leads into the project — a marker for the right one.')], src: [wiki('Ash_Twin_Project', 'Ash Twin Project', '灰烬双星计划')] },
                { id: 'a-recv-try', t: 'alt', alt: 'luck', label: L('把每座塔的平台挨个试', 'Try every tower’s pad'), place: L('灰烬双星赤道', 'Ash Twin’s equator') }
              ] },
            { id: 'g-sand', t: 'gate', tag: TIMING, label: L('等沙子让出塔门', 'Wait for the sand to clear the tower'), place: L('灰烬双星赤道', 'Ash Twin’s equator'), req: 'any',
              kids: [
                { id: 'c-hourglass', t: 'clue', label: L('沙子从灰烬流向余烬', 'Sand flows from Ash Twin to Ember Twin'), place: L('沙漏双星', 'Hourglass Twins'),
                  info: [L('这座塔一开始埋在沙里，大约第 7 分 50 秒才露出足够的空间站上塔里的平台。塔顶有破口，小心被落沙冲走。', 'The tower starts buried; from about 7:50 enough of it is clear to stand on the pad inside. Mind the sand pouring through its broken roof.')], src: [wiki('Ash_Twin_Project', 'Ash Twin Project', '灰烬双星计划')] },
                { id: 'a-sand-sleep', t: 'alt', alt: 'official', label: L('在营火边打盹快进', 'Doze at a campfire to skip ahead'), place: L('任意营火', 'Any campfire'),
                  info: [L('拿到发射密码后，就可以在营火边打盹跳过一段时间。', 'Once you have the launch codes you can doze at a campfire to skip time.')] }
              ] }
          ] },

        { id: 'g-insight', t: 'gate', label: L('把计划的核心装进飞船', 'Put the project’s core into the Vessel'), req: 'all',
          info: [L('最后的顿悟：飞船缺一颗核心，计划里正好有一颗。取下它，循环就停了，所以要在同一轮里把核心带进黑棘星。', 'The last realization: the Vessel is missing a core and the project has one. Taking it stops the loop, so you have to carry it into Dark Bramble in that same loop.')],
          kids: [
            { id: 'c-v-core', t: 'clue', label: L('飞船的跃迁核心早已失灵', 'The Vessel’s warp core is long dead'), place: L('挪麦飞船 · 舰桥', 'Nomai Vessel · bridge'), quote: [q('LOG:DB_VESSEL_X2')] },
            { id: 'c-v-input', t: 'clue', label: L('舰桥的三面柱能输入坐标', 'The three-sided pillar takes coordinates'), place: L('挪麦飞船 · 舰桥', 'Nomai Vessel · bridge'), quote: [q('LOG:DB_VESSEL_X3')] },
            { id: 'c-atp-core', t: 'clue', label: L('计划中心的核心可以取下', 'The project’s core can be removed'), place: L('灰烬双星计划 · 中央', 'Ash Twin Project · center'), quote: [q('NOMAI:Removing the core will disable')] }
          ] }
      ]
    }]
  },

  {
    key: 'reach',
    title: L('怎么到那儿', 'Getting there'),
    band: L('', ''),
    roots: [
      { id: 'r-hel', t: 'loc', label: L('高能实验室', 'The High Energy Lab'), place: L('余烬双星赤道峡谷', 'Ember Twin’s equatorial canyon'), req: 'all',
        kids: [
          { id: 'r-hel-door', t: 'clue', label: L('正门从里面锁着', 'The front door is locked from inside'), quote: [q('LOG:CT_HIGH_ENERGY_LAB_R3')] },
          { id: 'r-sunless', t: 'loc', label: L('背阴城', 'The Sunless City'), place: L('余烬双星地下', 'Beneath Ember Twin'), req: 'all',
            kids: [
              { id: 'r-sun-know', t: 'gate', label: L('城在地下', 'It is underground'), req: 'any',
                kids: [
                  { id: 'r-sun-chert', t: 'clue', label: L('切特：地表几乎没有废墟', 'Chert: hardly any ruins on the surface'), place: L('余烬双星 · 切特的营地', 'Ember Twin · Chert’s camp'), quote: [q('LOG:CT_SUNLESS_CITY_R4')] },
                  { id: 'r-sun-shelter', t: 'clue', label: L('幸存者躲进了逃生舱下的洞', 'Survivors sheltered beneath their pod'), place: L('余烬双星 · 2号逃生舱', 'Ember Twin · Escape Pod 2'), quote: [q('LOG:CT_SUNLESS_CITY_R1')] }
                ] },
              { id: 'r-sun-way', t: 'gate', label: L('进城的路', 'A way into the city'), req: 'any',
                kids: [
                  { id: 'r-sun-pod', t: 'clue', label: L('从2号逃生舱下的洞穴跟着路标走', 'Follow the markers from under Escape Pod 2'), place: L('余烬双星南半球', 'Ember Twin’s southern hemisphere'), req: 'all',
                    info: [L('洞里漆黑，像迷宫，挪麦人在墙上留了路标。', 'The caves are dark and maze-like; the Nomai marked the walls.')], quote: [q('NOMAI:We can mark our findings on the walls')],
                    kids: [
                      { id: 'r-pod2', t: 'clue', label: L('2号逃生舱', 'Escape Pod 2'), place: L('余烬双星南半球', 'Ember Twin’s southern hemisphere'), quote: [q('LOG:CT_ESCAPE_POD_R2')] }
                    ] },
                  { id: 'r-sun-hole', t: 'clue', label: L('重力炮上方的隐藏洞口', 'A hidden hole above the gravity cannon'), place: L('余烬双星赤道 · 重力炮', 'Ember Twin’s equator · gravity cannon'),
                    info: [L('通到城顶的宇宙之眼祭坛区，沿途有幽灵物质和仙人掌。重力炮旁边那扇城门被仙人掌堵着。', 'Leads to the Eye Shrine District at the top of the city, past ghost matter and cacti. The door next to the cannon is blocked by cacti.')], quote: [q('LOG:CT_SUNLESS_CITY_R2')], src: [wiki('Hourglass_Twins', 'Hourglass Twins', '沙漏双星')] }
                ] },
              { id: 'r-sun-time', t: 'gate', tag: TIMING, label: L('越早去越好', 'Go early'), place: L('沙子从下往上灌满城市', 'Sand fills the city from the bottom up'),
                info: [L('沙子会从下往上灌满整座城，晚了下层就进不去，回头路也常被沙瀑截断。', 'Sand floods the city from the bottom up; later in the loop the lower districts close off and sandfalls cut off the way back.')], src: [wiki('Hourglass_Twins', 'Hourglass Twins', '沙漏双星')] }
            ] },
          { id: 'r-hel-trail', t: 'clue', label: L('沿能量电缆走城底的小路', 'Follow the power cable from the bottom of the city'), place: L('背阴城最底层', 'The Sunless City’s lowest district'),
            info: [L('小路从背阴城最底层出发，沿一路延伸的能量电缆走，最后坐重力升降机、穿过峡谷桥内部进入实验室。', 'The trail starts in the lowest district and follows the long power cable to a gravity lift, then through the inside of the canyon bridge into the lab.')], src: [wiki('Hourglass_Twins', 'Hourglass Twins', '沙漏双星')] },
          { id: 'r-hel-time', t: 'gate', tag: TIMING, label: L('时机要卡在中间', 'Time it for the middle of the loop'), place: L('前段被淹，后段要等沙', 'Early half floods; later half needs sand'),
            info: [L('小路前半段很快会被沙子淹没；后半段一开始有沙瀑把人冲进仙人掌丛，喷气背包过不去，要等沙子把仙人掌盖住才能走。', 'The first half floods early. The second half starts with a sandfall pushing you into cacti — the jetpack won’t get you past — so wait for the sand to bury the cacti.')], src: [wiki('Hourglass_Twins', 'Hourglass Twins', '沙漏双星')] }
        ] },

      { id: 'r-fossil', t: 'loc', label: L('安康鱼化石洞', 'Fossil Fish Cave'), place: L('余烬双星地下', 'Beneath Ember Twin'), req: 'all',
        info: [L('从别的开口只能看到化石，进不去。', 'Other openings only let you look in.')], quote: [q('LOG:CT_ANGLERFISH_FOSSIL_R1')],
        kids: [
          { ref: 'r-sunless' },
          { id: 'r-fos-crack', t: 'gate', label: L('垫脚石洞顶的裂缝', 'The crack in Stepping Stone Cave’s ceiling'), place: L('背阴城 · 垫脚石洞', 'Sunless City · Stepping Stone Cave'), req: 'any', quote: [q('LOG:CT_ANGLERFISH_FOSSIL_R3')],
            kids: [
              { id: 'r-fos-light', t: 'clue', label: L('先给化石嘴里打个光', 'Light up the fossil’s mouth first'),
                info: [L('往化石嘴里射侦察兵当灯，入口就显出来了。', 'Shoot your scout into the fossil’s mouth as a lamp and the entrance shows.')], quote: [q('LOG:CT_ANGLERFISH_FOSSIL_R4')] },
              { id: 'r-fos-search', t: 'alt', alt: 'luck', label: L('沿着天花板仔细找', 'Search the ceiling carefully'), place: L('垫脚石洞', 'Stepping Stone Cave') }
            ] }
        ] },

      { id: 'r-lakebed', t: 'loc', label: L('湖床洞穴', 'Lakebed Cave'), place: L('余烬双星北极的干湖底', 'Dry lakebed at Ember Twin’s north pole'), req: 'all',
        quote: [q('LOG:CT_LAKEBED_CAVERN_R1')],
        kids: [
          { id: 'r-lake-time', t: 'gate', tag: TIMING, label: L('循环开头几分钟内去', 'Go in the first few minutes'),
            info: [L('洞穴在循环开始后几分钟内就会被沙子填满，要第一时间赶过去。', 'The cave fills with sand within the first few minutes, so go there first.')], src: [wiki('Hourglass_Twins', 'Hourglass Twins', '沙漏双星')] }
        ] },

      { id: 'r-sunstation', t: 'loc', label: L('太阳站', 'The Sun Station'), place: L('贴着太阳的低轨道', 'Low orbit around the Sun'), req: 'any',
        kids: [
          { id: 'r-ss-tower', t: 'gate', label: L('走灰烬双星上的太阳站塔', 'Use the Sun Station tower on Ash Twin'), req: 'all',
            kids: [
              { id: 'r-ss-hint', t: 'clue', label: L('有一条更安全的路', 'There is a safer way'), place: L('余烬双星 · 背阴城', 'Ember Twin · the Sunless City'), quote: [q('NOMAI:we’ve constructed a different, safer way to travel there')] },
              { id: 'r-ss-time', t: 'gate', tag: TIMING, label: L('约第 5 分钟塔门露出', 'The tower door clears around minute 5'),
                info: [L('沙子大约第 5 分钟流过太阳站塔，带阳台那一侧的门露出来，窗口很短。进去后站在平台上，等太阳到头顶。', 'Around minute 5 the sand passes the Sun Station tower and the balcony-side door opens up, briefly. Stand on the pad inside and wait for the Sun to be overhead.')], src: [wiki('Sun_Station', 'Sun Station', '太阳站')] }
            ] },
          { id: 'r-ss-land', t: 'alt', alt: 'luck', label: L('直接开飞船降落', 'Land the ship on it'), place: L('太阳站', 'Sun Station'),
            info: [L('太阳引力极强、太阳站又绕得飞快，非常难，成功了有成就。', 'Brutal with the Sun’s gravity and the station’s fast orbit. There is an achievement for it.')], src: [wiki('Sun_Station', 'Sun Station', '太阳站')] }
        ] },

      { id: 'r-forge', t: 'loc', label: L('黑洞熔炉', 'The Black Hole Forge'), place: L('悬空城最上层', 'Top of the Hanging City'), req: 'all',
        kids: [
          { id: 'r-forge-raise', t: 'clue', label: L('在融水区把熔炉升上来', 'Raise the forge from the Meltwater District'), req: 'all',
            info: [L('熔炉平时降在星球中心的黑洞旁边，只有升到悬空城最上层才进得去。', 'The forge normally hangs down by the black hole; you can only enter it once it is raised to the top of the city.')], quote: [q('LOG:BH_BLACK_HOLE_FORGE_R1')],
            kids: [
              { id: 'r-bhcity', t: 'loc', label: L('悬空城', 'The Hanging City'), place: L('碎空星北部冰川下', 'Under Brittle Hollow’s northern glacier'), req: 'all',
                kids: [
                  { id: 'r-bh-know', t: 'gate', label: L('城的位置', 'Where the city is'), req: 'any',
                    kids: [
                      { id: 'r-bh-north', t: 'clue', label: L('瑞拜克营地北边有座大城', 'A huge city north of Riebeck’s camp'), place: L('碎空星赤道 · 瑞拜克', 'Brittle Hollow’s equator · Riebeck'), quote: [q('LOG:BH_HANGING_CITY_R2')] },
                      { id: 'r-bh-migrate', t: 'clue', label: L('旧定居点的人搬去了冰川', 'The settlers moved to the glacier'), place: L('碎空星 · 旧定居点', 'Brittle Hollow · Old Settlement'), quote: [q('LOG:BH_HANGING_CITY_R1')] }
                    ] },
                  { id: 'r-bh-way', t: 'gate', label: L('进城的路', 'A way in'), req: 'any',
                    kids: [
                      { id: 'r-bh-river', t: 'clue', label: L('冰川河流尽头的隐藏洞', 'A hidden hole where the glacier river ends'), place: L('碎空星北极', 'Brittle Hollow’s north pole'),
                        info: [L('河水灌进洞口成了瀑布，顺着下去就是融水区。北极那座大建筑里的升降梯是坏的。', 'The river pours into it as a waterfall down to the Meltwater District. The lift in the big building up there is broken.')], src: [wiki('Brittle_Hollow', 'Brittle Hollow', '碎空星')] },
                      { id: 'r-bh-bridge', t: 'clue', tag: TIMING, label: L('从十字路口过桥', 'Cross the bridges from the Crossroads'), place: L('碎空星地壳下', 'Under Brittle Hollow’s crust'), req: 'all',
                        info: [L('两座桥会被空心灯的火山弹陆续砸断，越晚越难走。', 'Hollow’s Lantern’s volcanic bombs knock sections out over the loop.')], src: [wiki('Brittle_Hollow', 'Brittle Hollow', '碎空星')],
                        kids: [
                          { id: 'r-crossroads', t: 'clue', label: L('十字路口', 'The Crossroads'), place: L('入口在赤道上长树的废墟里', 'Entrance: the ruin with trees on the equator'),
                            info: [L('赤道上瑞拜克营地对面有座长满树的废墟，里面的挪麦小路一直通到地壳下的十字路口。', 'Across from Riebeck’s camp on the equator, a Nomai path inside a tree-grown ruin leads down to the Crossroads.')],
                            quote: [q('LOG:BH_RIEBECK_R3')] }
                        ] },
                      { id: 'r-oldsettle', t: 'loc', label: L('旧定居点', 'The Old Settlement'), place: L('碎空星赤道的地壳下', 'Under the crust at Brittle Hollow’s equator'), req: 'all',
                        info: [L('从旧定居点有一条重力水晶小路沿地壳背面通到悬空城最底层的学校区。', 'A gravity crystal path runs along the underside of the crust from here to the Hanging City’s School District.')],
                        kids: [
                          { id: 'r-pod1', t: 'clue', tag: 'risk', label: L('打开1号逃生舱舱门，沿栈桥下去', 'Open Escape Pod 1’s hatch and climb down'), place: L('碎空星赤道', 'Brittle Hollow’s equator'),
                            info: [L('木栈桥和台阶很脆，一踩就塌，掉下去就进黑洞。', 'The wooden bridges and stairs are fragile; fall and you are in the black hole.')], quote: [q('LOG:BH_OLD_SETTLEMENT_R1')] }
                        ] }
                    ] }
                ] }
            ] },
          { id: 'r-forge-district', t: 'gate', label: L('熔炉区', 'The Forge District'), req: 'any',
            info: [L('通往最上层的竖井断了，正常走不上去。', 'The shaft up to the top district is broken.')],
            kids: [
              { id: 'r-forge-warp', t: 'clue', label: L('从灰烬双星的碎空星塔跃迁过来', 'Warp in from the Brittle Hollow tower on Ash Twin'), place: L('灰烬双星赤道', 'Ash Twin’s equator'),
                info: [L('熔炉区里就有这座塔对应的接收点。', 'That tower’s receiver is in the Forge District.')], src: [wiki('Brittle_Hollow', 'Brittle Hollow', '碎空星')] }
            ] }
        ] },

      { id: 'r-observatory', t: 'loc', label: L('南部天文台', 'The Southern Observatory'), place: L('碎空星南极', 'Brittle Hollow’s south pole'), req: 'all',
        kids: [
          { id: 'r-obs-door', t: 'clue', label: L('地面上的大门坏了', 'The surface door is broken'), place: L('碎空星南极 · 瑞拜克的飞船', 'South pole · Riebeck’s ship'), quote: [q('LOG:BH_OBSERVATORY_R3')] },
          { id: 'r-obs-under', t: 'gate', label: L('走地壳下的路', 'Take a path under the crust'), req: 'any', quote: [q('LOG:BH_OBSERVATORY_R2')],
            kids: [
              { id: 'r-obs-cannon', t: 'clue', label: L('从重力炮出发', 'Start at the gravity cannon'), req: 'all',
                info: [L('一串错位的重力电梯和碎地壳，要用喷气背包在电梯之间跳。', 'A run of misaligned gravity lifts and broken crust; jetpack between the lifts.')], src: [wiki('Brittle_Hollow', 'Brittle Hollow', '碎空星')],
                kids: [
                  { id: 'r-cannon', t: 'gate', label: L('重力炮', 'The gravity cannon'), place: L('碎空星赤道', 'Brittle Hollow’s equator'), req: 'any',
                    info: [L('从地面能直接走到，也可以从十字路口往东跳过一串地壳碎块。', 'You can walk there on the surface, or head east from the Crossroads across floating crust.')],
                    kids: [{ ref: 'r-crossroads' }] },
                  { id: 'r-cannon-time', t: 'gate', tag: TIMING, label: L('趁重力炮还没掉进黑洞', 'Before the cannon falls in'),
                    info: [L('重力炮在循环后期很可能随地壳掉进黑洞。', 'Late in the loop the cannon is likely to fall into the black hole.')], src: [wiki('Brittle_Hollow', 'Brittle Hollow', '碎空星')] }
                ] },
              { id: 'r-obs-tower', t: 'clue', label: L('从量子知识之塔底层出发', 'Start at the base of the Tower of Quantum Knowledge'), place: L('碎空星赤道', 'Brittle Hollow’s equator') }
            ] }
        ] },

      { id: 'r-qtower', t: 'loc', label: L('量子知识之塔上层', 'Top of the Tower of Quantum Knowledge'), place: L('碎空星赤道', 'Brittle Hollow’s equator'), req: 'all',
        kids: [
          { id: 'r-qt-find', t: 'clue', label: L('航天飞机旁的记录指路', 'Directions near the recalled shuttle'), place: L('碎空星 · 重力炮', 'Brittle Hollow · gravity cannon'), quote: [q('NOMAI:If you follow the path west to the Crossroads')] },
          { id: 'r-qt-fall', t: 'gate', tag: TIMING, label: L('等塔掉进黑洞，在白洞那边进', 'Let it fall through, enter at the white hole'), place: L('白洞站附近', 'Near the White Hole Station'),
            info: [L('塔的上层入口断了。地壳崩塌时整座塔会掉进黑洞，从白洞出来后在零重力里就能进去。', 'The way up is broken. When the crust collapses the whole tower falls into the black hole; once it comes out of the white hole you can float in.')], src: [wiki('Brittle_Hollow', 'Brittle Hollow', '碎空星')] }
        ] },

      { id: 'r-tqt', t: 'loc', label: L('量子试验之塔', 'Tower of Quantum Trials'), place: L('深巨星北极', 'Giant’s Deep’s north pole'), req: 'all',
        kids: [
          { id: 'r-tqt-signal', t: 'clue', label: L('深巨星有量子信号', 'A quantum signal on Giant’s Deep'), place: L('信号镜 · 量子频道', 'Signalscope · Quantum Fluctuations'), quote: [q('LOG:GD_QUANTUM_TOWER_R1')] },
          { id: 'r-tqt-way', t: 'gate', label: L('绕过北极的巨型气旋', 'Get past the giant polar cyclone'), req: 'any',
            info: [L('北极有一个不会移动的巨型气旋，风墙过不去。', 'A permanent cyclone sits on the north pole and its wall can’t be flown through.')],
            kids: [
              { id: 'r-tqt-above', t: 'clue', label: L('从云层上方降进去', 'Drop in from above the clouds'), src: [wiki('Tower_of_Quantum_Trials', 'Tower of Quantum Trials', '量子试验之塔')] },
              { id: 'r-tqt-below', t: 'clue', label: L('从水流下面浮上去', 'Come up from below the current'), src: [wiki('Tower_of_Quantum_Trials', 'Tower of Quantum Trials', '量子试验之塔')] }
            ] }
        ] },

      { id: 'r-workshop', t: 'loc', label: L('雕塑车间', 'The Statue Workshop'), place: L('深巨星 · 雕像岛', 'Giant’s Deep · Statue Island'), req: 'all',
        kids: [
          { id: 'r-ws-way', t: 'gate', label: L('绕过坏掉的大门', 'Get around the broken door'), req: 'any', quote: [q('LOG:GD_STATUE_WORKSHOP_R1')],
            kids: [
              { id: 'r-ws-under', t: 'clue', label: L('从岛底下的开口游进去', 'Swim in from under the island'), req: 'all',
                info: [L('雕像岛是个圆顶，车间绕着内侧一圈，正中间通着大海。', 'The island is a dome; the workshop rings its inside, open to the sea in the middle.')], quote: [q('LOG:GD_STATUE_WORKSHOP_R3')], src: [wiki('Statue_Island', 'Statue Island', '雕像岛')],
                kids: [
                  { id: 'r-ws-kids', t: 'clue', label: L('挪麦孩子说的危险小路', 'The risky route the Nomai children mentioned'), quote: [q('LOG:GD_STATUE_WORKSHOP_R2')] }
                ] }
            ] },
          { id: 'r-ws-high', t: 'gate', tag: TIMING, label: L('高处平台要等岛被抛起', 'The high ledge needs the island in the air'),
            info: [L('深巨星重力大，喷气背包够不着；气旋把岛抛上天时才上得去。', 'Giant’s Deep’s gravity is too strong to jetpack up; you can reach it while a cyclone has the island in the air.')], src: [wiki('Statue_Island', 'Statue Island', '雕像岛')] }
        ] },

      { id: 'r-mine', t: 'loc', label: L('挪麦矿井', 'The Nomai Mines'), place: L('木炉星', 'Timber Hearth'), req: 'any', quote: [q('LOG:TH_NOMAI_MINE_R1')],
        kids: [
          { id: 'r-mine-geyser', t: 'clue', label: L('最大的间歇泉山里有入口', 'An entrance inside the biggest geyser mountain'), place: L('木炉星 · 挪麦遗迹', 'Timber Hearth · Nomai ruins'), src: [wiki('Timber_Hearth', 'Timber Hearth', '木炉星')] },
          { id: 'r-mine-warp', t: 'clue', label: L('从灰烬双星的木炉星塔跃迁过来', 'Warp in from the Timber Hearth tower on Ash Twin'), place: L('灰烬双星赤道', 'Ash Twin’s equator'), src: [wiki('Timber_Hearth', 'Timber Hearth', '木炉星')] }
        ] }
    ]
  },

  {
    key: 'qm',
    title: L('量子卫星支线', 'Quantum Moon'),
    band: L('可选', 'Optional'),
    roots: [{
      id: 'q-goal', t: 'goal', label: L('在第六个位置见到所莱内姆', 'Meet Solanum at the sixth location'), place: L('量子卫星 · 宇宙之眼的轨道', 'Quantum Moon · orbiting the Eye'), req: 'all',
      quote: [q('LOG:QM_SIXTH_LOCATION_X3'), q('LOG:QM_SIXTH_LOCATION_X2')],
      kids: [
        { id: 'q-land', t: 'gate', label: L('登上量子卫星', 'Land on the Quantum Moon'), place: L('总是在南极着陆', 'You always land at the south pole'), req: 'any', quote: [q('LOG:QM_SHUTTLE_X2')],
          kids: [
            { id: 'q-locator', t: 'clue', label: L('它会在五个位置之间跳', 'It jumps between five locations'), place: L('余烬双星 · 量子卫星定位器', 'Ember Twin · Quantum Moon locator'),
              info: [L('知道它会在几颗行星之间跳，就能守着某处等它，飞近时一直盯着它。', 'Knowing it hops between planets, you can wait for it somewhere and keep watching it as you approach.')], quote: [q('LOG:CT_QUANTUM_MOON_LOCATOR_X3')] },
            { id: 'aq-photo', t: 'alt', alt: 'official', label: L('拍张照，再盯着它降落', 'Photograph it, then watch it as you land'), place: L('量子卫星', 'Quantum Moon'),
              info: [L('先给量子卫星拍张照，降落途中一直看着它，它就不会跳走。这本身就是成像法则的用法。', 'Take a photo of the moon and keep looking at it as you descend so it can’t jump away — the rule of imaging at work.')], src: [wiki('Quantum_Moon', 'Quantum Moon', '量子卫星')] }
          ] },
        { id: 'q-imaging', t: 'gate', label: L('成像法则', 'Rule of quantum imaging'), place: L('观察图像 = 观察本体', 'Observing an image = observing the object'), req: 'any',
          kids: [
            { id: 'q-trials', t: 'clue', label: L('量子试验之塔', 'Tower of Quantum Trials'), place: L('深巨星北极', 'Giant’s Deep’s north pole'), at: 'r-tqt',
              info: [L('塔里的谜题本身就要用拍照来"定住"量子物体，过了关就学会了。', 'The tower’s puzzles make you pin quantum objects with photos; finishing them teaches the rule.')], quote: [q('LOG:GD_QUANTUM_TOWER_X2')] },
            { id: 'aq-img-try', t: 'alt', alt: 'luck', verify: true, label: L('自己试出拍照能定住它', 'Work it out by experimenting'), place: L('任意量子物体', 'Any quantum object'),
              info: [L('社区里有玩家完全靠试错摸出这条规则，属于个人说法。', 'Some players say they worked it out by trial and error alone.')], src: [{ label: L('Steam 讨论', 'Steam discussion'), url: 'https://steamcommunity.com/app/753640/discussions/0/2568690592367993639' }] }
          ] },
        { id: 'q-entangle', t: 'gate', label: L('纠缠法则', 'Rule of quantum entanglement'), place: L('站在量子物体上，完全黑暗', 'Stand on it in complete darkness'), req: 'any',
          kids: [
            { id: 'q-lakebed', t: 'clue', label: L('科利耶斯消失之谜', 'How Coleus vanished'), place: L('余烬双星 · 湖床洞穴', 'Ember Twin · Lakebed Cave'), at: 'r-lakebed', quote: [q('LOG:CT_LAKEBED_CAVERN_X2')] },
            { id: 'aq-shard', t: 'alt', alt: 'official', verify: true, label: L('碎空星高塔碎片旁的文字', 'Text by Brittle Hollow’s tower shard'), place: L('碎空星', 'Brittle Hollow'),
              info: [L('Wiki 说碎空星"高塔碎片"旁的挪麦文字也暗示了黑暗规则，我没逐条核对原文。', 'The wiki says Nomai text by Brittle Hollow’s tower shard also hints at the darkness rule; I did not check it line by line.')], src: [wiki('Quantum_Moon', 'Quantum Moon', '量子卫星')] },
            { id: 'aq-ent-try', t: 'alt', alt: 'luck', label: L('站在量子碎片上关灯试试', 'Turn your light off on a shard'), place: L('任意量子碎片', 'Any quantum shard') }
          ] },
        { id: 'q-sixth', t: 'gate', label: L('第六位置法则', 'Rule of the sixth location'), place: L('祭坛必须在卫星北极', 'The shrine must be at the north pole'), req: 'any',
          info: [L('实际操作要把三条法则合起来用：祭坛本身也是量子物体，没人看着时会换位置。在祭坛里关门关灯，就会随它移动，卫星跳到别的行星。有些行星版本的地形挡住了北极，要先换到能走到北极的版本，站在北极背对着等祭坛出现，再进祭坛关灯一次，就到第六个位置。', 'In practice you combine all three rules. The shrine is quantum too and moves when unobserved. Close the door and turn off the light inside and you travel with it as the moon jumps planets. Some versions block the north pole, so switch to one where you can walk there, stand at the pole facing away until the shrine appears, then use it once more.'),
                 L('祭坛不在北极时，它的门会被碎石挡住。（步骤整理自 Wiki 和社区讨论）', 'Anywhere but the pole, rock blocks the shrine’s door. (Steps from the wiki and community.)')],
          kids: [
            { id: 'q-knowledge', t: 'clue', label: L('量子知识之塔', 'Tower of Quantum Knowledge'), place: L('碎空星赤道', 'Brittle Hollow’s equator'), at: 'r-qtower', quote: [q('NOMAI:To explore the sixth location, the shrine must be on the moon')] }
          ] }
      ]
    }]
  },

  {
    key: 'comet',
    title: L('闯入者支线', 'The Interloper'),
    band: L('可选', 'Optional'),
    roots: [{
      id: 'i-goal', t: 'goal', label: L('挪麦人灭绝的真相', 'What killed the Nomai'), place: L('闯入者 · 破裂的核心', 'The Interloper · ruptured core'), req: 'all',
      quote: [q('LOG:COMET_INTERIOR_X3')],
      kids: [
        { id: 'i-know', t: 'gate', label: L('挪麦人去过彗星', 'The Nomai went to the comet'), req: 'any',
          kids: [
            { id: 'i-shuttle', t: 'clue', label: L('召回冻住的航天飞机', 'Recall the frozen shuttle'), place: L('余烬双星 · 重力炮', 'Ember Twin · gravity cannon'), quote: [q('LOG:CT_GRAVITY_CANNON_R1')] },
            { id: 'i-sunstation', t: 'clue', label: L('太阳站失败后去看彗星', 'After the Sun Station failed'), place: L('太阳站', 'Sun Station'), at: 'r-sunstation', quote: [q('LOG:S_SUNSTATION_X3')] }
          ] },
        { id: 'i-enter', t: 'gate', label: L('进到彗星冰层下面', 'Get under the comet’s ice'), place: L('闯入者向阳面的冰缝', 'A fissure on the sunward side'), req: 'any', quote: [q('LOG:COMET_INTERIOR_R2')],
          kids: [
            { id: 'i-frozen', t: 'clue', label: L('冰封航天飞机的记录', 'The frozen shuttle’s log'), place: L('闯入者表面', 'The Interloper’s surface'), quote: [q('LOG:COMET_SHUTTLE_X3')] },
            { id: 'ai-melt', t: 'alt', alt: 'luck', tag: TIMING, label: L('等彗星靠近太阳、冰面融开', 'Wait for the ice to melt near the Sun'), place: L('闯入者向阳面', 'Sunward side'),
              info: [L('向阳面的冰会随着接近太阳融开，自己观察也能找到入口。', 'The sunward ice melts open as the comet nears the Sun; you can spot the entrance yourself.')], src: [wiki('Interloper', 'Interloper', '闯入者')] }
          ] },
        { id: 'i-ghost', t: 'gate', label: L('避开幽灵物质', 'Avoid the ghost matter'), place: L('肉眼看不见的致命物质', 'Lethal and invisible to the eye'), req: 'any',
          kids: [
            { id: 'i-photo', t: 'clue', label: L('照片里能看见幽灵物质', 'Cameras can see ghost matter'), place: L('木炉星 · 村子', 'Timber Hearth · village'), quote: [q('DLG:DANGER! Inside this fence is a pocket of ghost matter')] },
            { id: 'ai-scout', t: 'alt', alt: 'official', label: L('发射侦察兵也能看到', 'Your scout shows it too'), place: L('任意幽灵物质', 'Any ghost matter'), src: [wiki('Ghost_Matter', 'Ghost Matter', '幽灵物质')] },
            { id: 'ai-try', t: 'alt', alt: 'luck', label: L('死过几次就知道了', 'Learn it by dying'), place: L('闯入者', 'The Interloper') }
          ] }
      ]
    }]
  }
];

export const FAQ = [
  [L('《星际拓荒》要打出结局，需要凑齐哪几样东西？', 'What do you need to reach the ending of Outer Wilds?'),
   L('三样：宇宙之眼的坐标（在深巨星核心的探测器跟踪模块里）、挪麦人的飞船（困在黑棘星深处）、高级跃迁核心（在灰烬双星计划的中央舱室里）。把核心装进飞船，在舰桥输入坐标，就能跃迁到宇宙之眼。取出核心会让时间循环停止，所以这一步要放在最后。',
     'Three things: the Eye of the Universe’s coordinates (in the Probe Tracking Module at the core of Giant’s Deep), the Nomai Vessel (stuck deep in Dark Bramble), and the advanced warp core (in the central chamber of the Ash Twin Project). Put the core in the Vessel, enter the coordinates on the bridge, and warp to the Eye. Taking the core stops the time loop, so do it last.')],
  [L('飞船在黑棘星哪里，怎么进去？', 'Where is the Vessel in Dark Bramble and how do you get in?'),
   L('先用信号镜的求救信号频道找到3号逃生舱，顺着幸存者留下的灯走到挪麦坟墓。坟墓前那颗种子太小，只能射侦察兵进去；进去后追踪器显示侦察兵同时在两个地方，另一处就是安康鱼巢里一颗不发光的大种子。穿过鱼巢的安康鱼，从那颗种子进去就是飞船。',
     'Use the signalscope’s distress frequency to find Escape Pod 3 and follow the survivors’ lights to the Nomai Grave. The seed there only fits your scout; once inside, the tracker shows the scout in two places, and the other one is an unlit, ship-sized seed in the anglerfish nest. Slip past the anglerfish in the nest and take that seed to the Vessel.')],
  [L('黑棘星的安康鱼怎么躲？', 'How do you get past the anglerfish in Dark Bramble?'),
   L('安康鱼是瞎的，靠声音找猎物，关掉引擎靠惯性滑过去就不会被发现。线索在余烬双星的安康鱼化石：挪麦小孩玩"安康鱼和小鱼"时，扮安康鱼的要戴眼罩。从种子出来时速度方向固定，什么都不按直接漂也很稳。',
     'Anglerfish are blind and hunt by sound, so cut your engines and drift. The clue is the anglerfish fossil on Ember Twin, where Nomai children played a game in which the “anglerfish” wore a blindfold. You leave each seed at a fixed speed and heading, so simply drifting works well.')],
  [L('怎么潜到深巨星的水流下面、穿过核心外的电场？', 'How do you get below Giant’s Deep’s current and through the electric field?'),
   L('设计好的办法是坐逆时针旋转的气旋下去，线索在碎空星南部天文台的气旋模型。也能高速直冲，或停在被抛起的岛下面等它砸下来。核心外的电场只能钻进水母穿过，线索是黑棘星里费尔德斯巴吃水母的笔记：外皮像橡胶，能绝缘。',
     'The intended way is to ride a counterclockwise cyclone down; the clue is the cyclone model in Brittle Hollow’s Southern Observatory. A very fast dive or a falling island also works. The electric field around the core can only be crossed inside a jellyfish; Feldspar’s notes in Dark Bramble say their rubbery skin insulates them.')],
  [L('灰烬双星计划怎么进去？', 'How do you get into the Ash Twin Project?'),
   L('保护外壳没有任何物理入口，只能跃迁。白洞站教你跃迁平台的用法；高能实验室的高塔设计图对应每座塔的去向；黑洞熔炉说明沙漏双星共用两星之间的对准点。合起来就知道：灰烬双星赤道上有一座塔的接收点在星球中心，站在那座塔里的平台上，等余烬双星经过头顶就会被传进去。那座塔一开始埋在沙里，大约第 7 分 50 秒才进得去。',
     'Its shell has no physical entrance, so you have to warp. The White Hole Station teaches how warp pads work; the tower designs in the High Energy Lab show where each tower goes; the Black Hole Forge says the Hourglass Twins share one alignment point between them. Put together: one tower on Ash Twin’s equator has its receiver at the planet’s center — stand on the pad inside it and wait for Ember Twin to pass overhead. The tower is buried in sand until about 7:50 into the loop.')],
  [L('背阴城和高能实验室怎么进？', 'How do you get into the Sunless City and the High Energy Lab?'),
   L('背阴城在余烬双星地下：从2号逃生舱下的洞穴跟着墙上的路标走，或从重力炮上方的隐藏洞口下去，要趁沙子还没灌满。高能实验室正门从里面锁着，只能从背阴城最底层沿能量电缆的小路过去，前半段怕沙子淹，后半段要等沙子盖住仙人掌。',
     'The Sunless City is beneath Ember Twin: follow the wall markers from the caves under Escape Pod 2, or drop through a hidden hole above the gravity cannon, before the sand fills it. The High Energy Lab’s front door is locked from inside; take the trail along the power cable from the city’s lowest district, early enough that the first half isn’t flooded and late enough that sand has buried the cacti on the second half.')],
  [L('黑洞熔炉和南部天文台怎么去？', 'How do you reach the Black Hole Forge and the Southern Observatory?'),
   L('黑洞熔炉挂在悬空城下面，先在融水区的控制室把它升到最上层，再从灰烬双星上的碎空星塔跃迁到熔炉区（竖井断了）。南部天文台的地面大门是坏的，要从地壳下走：从重力炮出发跳一串重力电梯，或从量子知识之塔底层出发。',
     'The Forge hangs below the Hanging City: raise it from the control room in the Meltwater District, then warp to the Forge District from the Brittle Hollow tower on Ash Twin (the shaft is broken). The Southern Observatory’s surface door is broken; go under the crust, either from the gravity cannon across a chain of gravity lifts or from the base of the Tower of Quantum Knowledge.')],
  [L('量子卫星的第六个位置怎么去？', 'How do you reach the Quantum Moon’s sixth location?'),
   L('要用齐三条量子法则：成像法则（深巨星量子试验之塔）、纠缠法则（余烬双星湖床洞穴）、第六位置法则（碎空星量子知识之塔：祭坛必须在卫星北极）。在祭坛里关门关灯就会随它移动，让祭坛出现在北极后再用一次，就能见到所莱内姆。',
     'You need all three quantum rules: imaging (Tower of Quantum Trials on Giant’s Deep), entanglement (Lakebed Cave on Ember Twin), and the sixth location (Tower of Quantum Knowledge on Brittle Hollow: the shrine must be at the moon’s north pole). Shut yourself in the shrine in the dark to travel with it; get it to the north pole and use it once more to meet Solanum.')],
  [L('挪麦人是怎么灭绝的？', 'What happened to the Nomai?'),
   L('太阳站没能引爆太阳后，挪麦人去调查刚到的彗星"闯入者"。彗星核心里是高压的幽灵物质，外壳破裂后几乎一瞬间覆盖了整个星系。幽灵物质肉眼看不见，用相机能看到。',
     'After the Sun Station failed, the Nomai went to study a newly arrived comet, the Interloper. Its core held ghost matter under extreme pressure; when it ruptured, the ghost matter covered the solar system almost instantly. It is invisible to the eye but shows up on camera.')]
];

// One 22-minute loop. t / from–to in minutes. row: which line inside the lane; side: 'left' puts the label left of the dot.
// node: canvas node to jump to. Times from the Outer Wilds Wiki (Sun, Sun Station, Interloper, Ash Twin Project, Hourglass Twins pages).
export const TIMELINE = {
  title: L('一个循环里会发生什么', 'What happens in one loop'),
  note: L('时间为约数', 'Times are approximate'),
  lanes: [
    { name: L('木炉星', 'Timber Hearth'), items: [
      { t: 0, row: 0, label: L('在营火边醒来', 'Wake up by the campfire') } ] },
    { name: L('深巨星', 'Giant’s Deep'), items: [
      { t: 0.3, row: 0, label: L('轨道探测炮发射，天上一闪', 'The Orbital Probe Cannon fires — a flash in the sky'), node: 'coords' } ] },
    { name: L('沙漏双星', 'Hourglass Twins'), items: [
      { from: 0, to: 3, row: 0, label: L('湖床洞穴只在开头几分钟能进', 'Lakebed Cave: open only for the first few minutes'), node: 'r-lakebed' },
      { t: 2, row: 1, label: L('沙子开始流动', 'Sand starts to flow'), node: 'c-hourglass' },
      { t: 5, row: 2, label: L('太阳站塔门露出', 'Sun Station tower door clears'), node: 'r-sunstation' },
      { t: 7.83, row: 1, label: L('约 7:50 通往计划的塔露出', '~7:50 the project tower is uncovered'), node: 'g-sand' },
      { from: 2, to: 22, row: 3, label: L('背阴城从下往上被沙灌满', 'The Sunless City fills with sand from the bottom up'), node: 'r-sunless' } ] },
    { name: L('碎空星', 'Brittle Hollow'), items: [
      { from: 0, to: 22, row: 0, label: L('地壳被火山弹陆续砸塌：量子知识之塔、重力炮先后掉进黑洞', 'The crust keeps collapsing: the Tower of Quantum Knowledge and the gravity cannon fall into the black hole'), node: 'r-qtower' } ] },
    { name: L('闯入者', 'The Interloper'), items: [
      { from: 0, to: 20, row: 0, label: L('绕太阳飞，越近太阳，向阳面的冰缝开得越大', 'Swings around the Sun; the closer it gets, the wider the sunward fissure opens'), node: 'i-enter' },
      { t: 20, row: 1, side: 'left', label: L('约第 20 分钟撞进太阳', '~20:00 crashes into the Sun') } ] },
    { name: L('太阳', 'The Sun'), sun: true, items: [
      { from: 0, to: 10.5, row: 0, label: L('橙色恒星，太阳站还在', 'Orange star; the Sun Station still stands') },
      { from: 10.5, to: 22, row: 0, label: L('膨胀成红巨星', 'Swells into a red giant') },
      { t: 10.5, row: 1, label: L('约 10.5–12 分钟太阳站被吞没', '~10.5–12 min: the Sun Station is swallowed'), node: 'r-sunstation' },
      { t: 20.5, row: 2, side: 'left', label: L('最后一两分钟响起《End Times》', 'Final minute or two: “End Times” plays') },
      { t: 22, row: 3, side: 'left', goal: true, label: L('超新星，循环重来', 'Supernova — the loop starts over') } ] }
  ]
};

// Who sends you where: ship log rumors whose source is a traveler. Text and place names come from the game.
export const TRAVELERS = [
  { src: ['TH_VILLAGE'], name: L('木炉星村子', 'Timber Hearth village'), where: L('哈尔、霍恩费斯等人', 'Hal, Hornfels and the others') },
  { src: ['TM_ESKER', 'TM_NORTH_POLE'], name: L('埃斯科', 'Esker'), where: L('废岩星', 'the Attlerock') },
  { src: ['CT_CHERT'], name: L('切特', 'Chert'), where: L('余烬双星', 'Ember Twin') },
  { src: ['BH_RIEBECK'], name: L('瑞拜克', 'Riebeck'), where: L('碎空星', 'Brittle Hollow') },
  { src: ['GD_GABBRO_ISLAND'], name: L('加布罗', 'Gabbro'), where: L('深巨星', 'Giant’s Deep') },
  { src: ['DB_FELDSPAR'], name: L('费尔德斯巴', 'Feldspar'), where: L('黑棘星', 'Dark Bramble') }
];
// Ship log entry → canvas node, so a lead can jump to the map.
export const ENTRY_NODE = {
  TH_IMPACT_CRATER: 'c-harmonica', CT_ESCAPE_POD: 'r-pod2', CT_SUNLESS_CITY: 'r-sunless', BH_OBSERVATORY: 'r-observatory',
  ORBITAL_PROBE_CANNON: 'c-dmg', GD_OCEAN: 'g-current', GD_STATUE_ISLAND: 'r-workshop', DB_FROZEN_JELLYFISH: 'c-jelly'
};

// What the player does at each step: realize = figure something out, explore = get somewhere or get through something.
// Goals, must-haves, alternatives and timing gates are left untagged.
export const ACTION = {
  realize: ['c-loop', 'g-insight', 'c-v-core', 'c-v-input', 'c-atp-core', 'c-nest', 'c-feld-two', 'g-sunk', 'c-dmg', 'c-cassava', 'c-feld-core', 'c-tornado', 'c-jelly', 'c-fossil', 'g-knowvessel', 'c-murals', 'c-podlogs', 'g-whichseed', 'c-pod3',
    'g-whereatp', 'c-atp4', 'g-sealed', 'c-mine', 'g-warp', 'c-whs', 'c-window', 'c-deduce', 'c-towermap', 'c-forge', 'c-hourglass',
    'r-sun-know', 'r-sun-chert', 'r-sun-shelter', 'r-hel-door', 'r-fos-light', 'r-ss-hint', 'r-bh-know', 'r-bh-north', 'r-bh-migrate', 'r-obs-door', 'r-qt-find', 'r-tqt-signal', 'r-ws-kids',
    'q-locator', 'q-imaging', 'q-entangle', 'q-lakebed', 'q-sixth', 'i-know', 'i-sunstation', 'i-frozen', 'i-photo'],
  explore: ['g-start', 'g-current', 'g-field', 'g-findfeld', 'c-harmonica', 'c-thseed', 'c-bramisland', 'g-angler', 'c-grave', 'c-bhfall', 'g-receiver',
    'r-sunless', 'r-sun-way', 'r-sun-pod', 'r-pod2', 'r-sun-hole', 'r-hel', 'r-hel-trail', 'r-fossil', 'r-fos-crack', 'r-lakebed', 'r-sunstation', 'r-ss-tower',
    'r-forge', 'r-forge-raise', 'r-bhcity', 'r-bh-way', 'r-bh-river', 'r-bh-bridge', 'r-crossroads', 'r-oldsettle', 'r-pod1', 'r-forge-district', 'r-forge-warp',
    'r-observatory', 'r-obs-under', 'r-obs-cannon', 'r-cannon', 'r-obs-tower', 'r-qtower', 'r-tqt', 'r-tqt-way', 'r-tqt-above', 'r-tqt-below',
    'r-workshop', 'r-ws-way', 'r-ws-under', 'r-mine', 'r-mine-geyser', 'r-mine-warp', 'q-land', 'q-trials', 'q-knowledge', 'i-shuttle', 'i-enter', 'i-ghost']
};

// Endings in the base game. steps: [text, node?]. quote: the line the game shows (UI:<id> or DLG:).
export const ENDINGS = {
  title: L('结局图鉴', 'Endings'),
  items: [
    { name: L('宇宙之眼', 'The Eye of the Universe'), kind: L('正常结局', 'Main ending'), node: 'goal',
      steps: [[L('把计划的核心装进飞船，输入坐标，跃迁', 'Put the project’s core in the Vessel, enter the coordinates, warp'), 'g-insight'],
              [L('从北极走到南极，跳进量子风暴中心的坑，回到一座量子版的天文台', 'Walk from the north pole to the south, drop into the crater in the quantum storm, arrive at a quantum observatory')],
              [L('在林地里生起营火，用信号镜把旅行者们的乐器一个个找回来，一起演奏', 'Light a campfire in the glade, find each traveler’s instrument with the signalscope, and play together')],
              [L('见过所莱内姆的话，她也会加入；片尾的新宇宙里会多出一圈围着营火的外星人', 'If you met Solanum she joins too, and the post-credits shot gains a new campfire with alien campers'), 'q-goal']],
      quote: 'DLG:But I think the rules are about to change.' },
    { name: L('留在第六个位置', 'Stay at the sixth location'), kind: L('隐藏结局', 'Hidden ending'), node: 'q-goal',
      steps: [[L('取下计划的核心，循环停止', 'Take the project’s core; the loop stops'), 'c-atp-core'], [L('登上量子卫星，去它的第六个位置，等超新星', 'Land on the Quantum Moon, go to its sixth location, wait for the supernova'), 'q-sixth']],
      quote: 'UI:813',
      note: L('发售时这句结束语只显示成"813"，正好是它在游戏文本里的编号，玩家因此叫它"813 结局"，1.0.2 才修好。', 'At launch this ending showed only “813” — the line’s ID in the game text — so players called it the 813 ending until patch 1.0.2.') },
    { name: L('飘向深空', 'Adrift'), kind: L('隐藏结局', 'Hidden ending'), node: 'core',
      steps: [[L('取下计划的核心', 'Take the project’s core'), 'c-atp-core'], [L('开飞船飞得足够远，躲过超新星', 'Fly far enough from the Sun to outrun the supernova')]],
      quote: 'UI:812' },
    { name: L('打破时空', 'Breaking spacetime'), kind: L('隐藏结局', 'Hidden ending'), node: 'r-hel',
      steps: [[L('在高能实验室装上黑洞核心和白洞核心，把侦察兵射进黑洞', 'In the High Energy Lab, fit a black hole core and a white hole core and fire your scout into the black hole'), 'r-hel'],
              [L('侦察兵从白洞出来之后、进黑洞之前，拔掉一个核心：两个侦察兵同时存在', 'After it comes out of the white hole but before it goes in, pull a core: now two scouts exist')]],
      quote: 'UI:811', note: L('片尾字幕会用卡祖笛版主题曲飞快滚完。', 'The credits then race by to a kazoo cover of the theme.') },
    { name: L('遇见自己', 'Meeting yourself'), kind: L('隐藏结局', 'Hidden ending'), node: 'core',
      steps: [[L('超新星爆发时，跳进灰烬双星计划中心张开的黑洞', 'As the supernova hits, jump into the black hole that opens at the center of the Ash Twin Project'), 'core'],
              [L('下一轮计划里会多出一个你；这一轮不再跳一次，就会打破时空', 'Next loop another you is waiting in the project; skip the jump this time and spacetime breaks')]],
      quote: 'DLG:Are you me from the last loop?', note: L('1.0.4 版本加入。', 'Added in patch 1.0.4.') },
    { name: L('游戏结束', 'Game over'), kind: L('死亡', 'Death'), node: 'c-loop',
      steps: [[L('雕像和你配对之前就死了，游戏从头开始', 'Die before the statue pairs with you, and the game starts over'), 'c-loop'],
              [L('取下计划的核心之后死掉，不会再醒来', 'Die after taking the project’s core, and you don’t wake up'), 'c-atp-core']],
      quote: 'UI:810' }
  ]
};

// Tools and abilities, and the steps on the map where each one matters. uses: [text, node?]
export const TOOLS = {
  title: L('工具与能力', 'Tools and abilities'),
  items: [
    { name: L('发射密码', 'Launch codes'), from: L('天文台的霍恩费斯', 'Hornfels at the observatory'),
      uses: [[L('坐升降梯上发射台', 'Ride the lift up the launch tower'), 'g-start'], [L('拿到之后，营火边才能打盹', 'Unlocks dozing at campfires'), 'a-sand-sleep']] },
    { name: L('侦察兵', 'Little Scout'), from: L('宇航服上的发射器', 'Launcher on your suit'),
      uses: [[L('拍下的照片能定住量子物体', 'A photo pins a quantum object in place'), 'q-imaging'], [L('射进小种子看里面', 'Peek through small seeds'), 'c-grave'],
             [L('追踪器显示它同时在两个地方', 'Its tracker shows it in two places at once'), 'c-nest'], [L('相机能看到幽灵物质', 'Its camera sees ghost matter'), 'i-photo'],
             [L('当灯照亮化石的嘴', 'Light up the fossil’s mouth'), 'r-fos-light']] },
    { name: L('信号镜', 'Signalscope'), from: L('自带旅行者频道，其他频道靠近信号源时学会', 'Starts with the Travelers frequency; learns others near their sources'),
      uses: [[L('旅行者频道：循着口琴声找到费尔德斯巴', 'Travelers: follow the harmonica to Feldspar'), 'c-harmonica'],
             [L('求救信号：找到第一个逃生舱后出现，带你找到3号逃生舱', 'Distress Beacon: appears after your first escape pod, leads to Escape Pod 3'), 'c-pod3'],
             [L('量子波动：量子碎片和量子卫星', 'Quantum Fluctuations: shards and the Quantum Moon'), 'r-tqt-signal'],
             [L('在宇宙之眼找回旅行者们的乐器', 'Find the travelers’ instruments at the Eye'), 'goal']] },
    { name: L('翻译器', 'Translator'), from: L('随身装备', 'Standard gear'),
      uses: [[L('读懂挪麦人的螺旋文字和记录：几乎每条线索都靠它', 'Read Nomai spiral text and recordings — nearly every clue depends on it'), 'c-deduce']] },
    { name: L('手电筒', 'Flashlight'), from: L('宇航服', 'Your suit'),
      uses: [[L('关掉它，完全黑暗：和量子物体纠缠在一起', 'Turn it off for total darkness and you become entangled'), 'q-entangle'], [L('在祭坛里关灯，随卫星换位置', 'Lights out in the shrine to move with the moon'), 'q-sixth']] },
    { name: L('宇航服与喷气背包', 'Suit and jetpack'), from: L('发射台旁', 'By the launch tower'),
      uses: [[L('在错位的重力电梯之间跳', 'Jump between misaligned gravity lifts'), 'r-obs-cannon'], [L('深巨星重力太大，高处够不着', 'Too weak for Giant’s Deep’s gravity on high ledges'), 'r-ws-high']] },
    { name: L('飞船与飞船日志', 'Ship and ship log'), from: L('木炉星发射台', 'Timber Hearth launch tower'),
      uses: [[L('关掉引擎，靠惯性滑过安康鱼', 'Cut the engines and drift past anglerfish'), 'g-angler'], [L('飞船日志记下每条线索和传闻，传闻模式里的问号就是还没去的地方', 'The log records every clue and rumor; the question marks in rumor mode are places you haven’t been')]] },
    { name: L('营火', 'Campfire'), from: L('每颗星球上都有', 'On every planet'),
      uses: [[L('打盹快进时间，等沙子流走', 'Doze to skip time, e.g. until the sand drains'), 'a-sand-sleep'],
             [L('冥想直接结束这一轮：第三轮起问加布罗"你怎么能这么冷静"就能学会', 'Meditate to end the loop early: from the third loop, ask Gabbro how they stay so calm'), null],
             [L('烤棉花糖回血', 'Roast marshmallows to heal')]] },
    { name: L('挪麦设施', 'Nomai devices'), from: L('散落在各颗星球', 'All over the system'),
      uses: [[L('跃迁平台：等对应天体过头顶', 'Warp pads: wait for the target overhead'), 'g-warp'], [L('重力炮：召回航天飞机', 'Gravity cannons: recall a shuttle'), 'i-shuttle'],
             [L('投影池：看到远处的场景，比如沉在海底的跟踪模块', 'Projection pools: see far-off places, like the sunken tracking module'), 'c-dmg']] }
  ]
};

// One short line shown on the card itself (no pop-up details): the fact you need beyond the label.
export const NOTE = {
  'goal': L('装好核心、输入坐标、跃迁', 'Fit the core, enter the coordinates, warp'),
  'c-loop': L('雕像和你配对，每轮都带着记忆醒来', 'The statue paired with you; you keep your memories'),
  'coords': L('第 9,318,054 号探测器找到，存在投影池里', 'Found by probe 9,318,054, kept in its projection pool'),
  'g-current': L('强水流让任何东西都沉不下去', 'A strong current keeps everything afloat'),
  'a-cur-accident': L('费尔德斯巴就是这么发现的', 'That is how Feldspar found it'),
  'a-cur-dive': L('约每秒一万米，撞上岛就会死', 'About 10 km/s; hit an island and you die'),
  'a-cur-island': L('岛砸回海面时把飞船压下去', 'The island slams back down and pushes you under'),
  'a-cur-shuttle': L('能过水流，过不了电场', 'Gets past the current, not the field'),
  'c-jelly': L('钻进水母体内，随它穿过电场', 'Ride inside a jellyfish through the field'),
  'a-jelly-crust': L('不见费尔德斯巴也能找到那道裂缝', 'Reach the crack without meeting Feldspar'),
  'c-thseed': L('侦察兵出现在满是雾和藤的大空间', 'The scout ends up in a vast space of fog and vines'),
  'c-bramisland': L('他去黑棘星前在这里扎过营', 'He camped here before heading to Dark Bramble'),
  'g-angler': L('入口中枢 1 条，鱼巢 5 条', 'One in the hub, five in the nest'),
  'c-fossil': L('关掉引擎，靠惯性滑过去', 'Cut the engines and drift'),
  'a-ang-drift': L('出种子时速度方向固定，直接漂', 'Seeds launch you at a fixed speed — just drift'),
  'vessel': L('核心摔坏了，但存着宇宙之眼的原始信号', 'Its core is broken, but it holds the Eye’s original signal'),
  'c-murals': L('遇到信号 → 被黑棘星缠住 → 放出逃生舱', 'Signal → caught by Dark Bramble → pods launched'),
  'c-podlogs': L('三个逃生舱都来自一艘叫"飞船"的大船', 'All three pods came from the Vessel'),
  'c-nest': L('不发光的大种子，飞船从那里进', 'An unlit, ship-sized seed — the way in'),
  'c-grave': L('种子太小，只有侦察兵进得去', 'Too small for anything but your scout'),
  'c-pod3': L('两个一样的信标；顺着灯走到坟墓', 'Two identical beacons; follow the lights to the grave'),
  'c-feld-two': L('侦察兵同时在两个地方，并没有错', 'The scout really can be in two places'),
  'a-seed-explore': L('鱼巢里唯一不发光的那颗', 'The only unlit seed in the nest'),
  'core': L('计划的动力源，取下循环就停', 'Powers the project; taking it stops the loop'),
  'c-atp4': L('实验室选址、矿井造壳、熔炉铸核心', 'Lab chose the site, mines built the shell, forge cast the core'),
  'c-mine': L('保护壳完工后检查过：没有入口', 'Checked after sealing: no way in'),
  'c-bhfall': L('掉进去的东西从白洞出来', 'What falls in comes out of the white hole'),
  'c-window': L('偏差五度以内都算对准', 'Within five degrees counts as aligned'),
  'g-receiver': L('站进塔里的平台', 'Stand on the pad inside'),
  'c-deduce': L('这座塔的接收点在星球中心', 'Its receiver is at the planet’s center'),
  'c-towermap': L('每座塔的样子对应它的目的地', 'Each tower looks like where it goes'),
  'c-forge': L('亚罗以为有座塔永远对不上', 'Yarrow thought one tower could never align'),
  'a-recv-body': L('塔门口的标记', 'A marker at the door'),
  'c-hourglass': L('约第 7 分 50 秒起能站进塔里', 'From about 7:50 you can stand inside'),
  'a-sand-sleep': L('拿到发射密码后可用', 'Available after the launch codes'),
  'g-insight': L('取下核心循环就停，要同一轮带到飞船', 'It stops the loop — deliver it in the same loop'),
  'r-sun-pod': L('洞里漆黑，墙上有挪麦路标', 'Dark maze; the Nomai marked the walls'),
  'r-pod2': L('切特看见南半球有光束射向天空', 'Chert saw a beam of light in the south'),
  'r-sun-hole': L('通到城顶；旁边的城门被仙人掌堵着', 'Leads to the top; the nearby door is blocked by cacti'),
  'r-hel-trail': L('最后坐重力升降机穿过峡谷桥', 'Ends with a gravity lift through the canyon bridge'),
  'r-fossil': L('别的开口只能看，进不去', 'Other openings only let you look'),
  'r-fos-light': L('往化石嘴里射侦察兵当灯', 'Shoot your scout into its mouth as a lamp'),
  'r-lake-time': L('开局几分钟就被沙填满', 'Fills with sand within minutes'),
  'r-ss-hint': L('背阴城的挪麦人说造了更安全的路', 'Nomai in the city mention a safer way'),
  'r-ss-time': L('有阳台的那侧，窗口很短；等太阳到头顶', 'Balcony side, brief window; wait for the Sun overhead'),
  'r-ss-land': L('极难，成功有成就', 'Very hard; there is an achievement'),
  'r-forge-raise': L('平时降在黑洞旁，升上来才进得去', 'Normally hangs down by the black hole'),
  'r-bh-river': L('顺着瀑布下到融水区', 'Ride the waterfall down to the Meltwater District'),
  'r-bh-bridge': L('桥会被火山弹砸断', 'Volcanic bombs break the bridges'),
  'r-oldsettle': L('重力水晶小路通到悬空城底层', 'A crystal path leads to the city’s bottom'),
  'r-pod1': L('栈桥一踩就塌，掉下去就进黑洞', 'The bridges crumble into the black hole'),
  'r-forge-district': L('通往最上层的竖井断了', 'The shaft up is broken'),
  'r-forge-warp': L('熔炉区里就有接收点', 'Its receiver is in the Forge District'),
  'r-obs-cannon': L('在错位的重力电梯之间跳', 'Jetpack between misaligned lifts'),
  'r-cannon': L('地面能走到，或从十字路口往东跳', 'Walk there, or hop east from the Crossroads'),
  'r-qt-find': L('往西走到十字路口再过去', 'West to the Crossroads, then on'),
  'r-qt-fall': L('上层入口断了，在零重力里飘进去', 'Upper entrance broken; float in'),
  'r-tqt-way': L('风墙飞不过去', 'You can’t fly through the wind wall'),
  'r-ws-under': L('圆顶岛，车间绕着内侧一圈', 'A dome; the workshop rings its inside'),
  'r-ws-high': L('重力太大，喷气背包够不着', 'Gravity too strong to jetpack up'),
  'q-goal': L('量子卫星是宇宙之眼的卫星', 'The Quantum Moon orbits the Eye'),
  'q-locator': L('守在某处等它，飞近时一直盯着', 'Wait for it and keep watching as you approach'),
  'q-trials': L('塔里的谜题要靠拍照定住物体', 'Its puzzles need photos to pin objects'),
  'q-lakebed': L('灯灭时站在石头上，人和石头一起消失', 'Lights out on the rock, and both vanish'),
  'q-sixth': L('在祭坛里关门关灯，随它移动', 'Shut the door, lights off, travel with it'),
  'i-goal': L('核心破裂，幽灵物质一眨眼覆盖星系', 'The core burst; ghost matter covered the system'),
  'i-frozen': L('一人留守保温，两人下去探索', 'One stayed to keep warm, two went in')
};
