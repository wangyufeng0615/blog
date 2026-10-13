const TREES = {
main: {
  title: '通关主线',
  band: '坐标、飞船、高级跃迁核心三样凑齐，才能跃迁到宇宙之眼',
  aria: '通关主线依赖图：坐标、飞船、高级跃迁核心三者都拿到，才能跃迁到宇宙之眼',
  intro: '终点只有一个：把高级跃迁核心装进挪麦飞船，输入宇宙之眼坐标，跃迁过去。坐标、飞船、核心三样缺一不可，其余所有线索都挂在这三条线上。',
  notes: '<div><b>为什么二周目能很快通关：</b>整个游戏没有道具和等级，进度全在玩家脑子里。紫色虚线就是"已经知道答案"能直接跳过的部分。</div><div><b>最后一轮的约束：</b>取出核心后循环停止，这一轮死亡即终局，所以坐标和飞船位置必须在之前的循环里弄清楚。</div><div><b>一个循环通关：</b>知道全部答案时，必做的只剩：拿发射密码 → 触发天文台雕像（跳过它沙子不会落、太阳也不会爆）→ 跃迁进灰烬双星计划取核心 → 穿过安康鱼巢到飞船 → 装核心、输坐标。这对应"新手的运气"成就。</div><div><b>依据：</b>实线来自游戏原文（飞船日志、挪麦文字）和日志自带的"传闻来源"数据；虚线的出处写在各卡片详情里。</div>',
  root: {
    id: 'goal', t: 'goal', label: '跃迁到宇宙之眼', place: '黑棘星深处 · 挪麦飞船舰桥', planet: 'ship', req: 'all',
    info: ['把高级跃迁核心装进飞船，在舰桥的三面柱上输入坐标，飞船跃迁到宇宙之眼。', '取出核心的同时时间循环停止，所以这一步只能放在最后一轮。'],
    quote: [['飞船的跃迁核心早已失灵。我启动了飞船舰桥上的一根三面柱。它看上去像是某种输入装置。', '飞船日志 · 飞船'], ['警告：移除核心将会关闭灰烬双星计划。', '挪麦文字 · 灰烬双星计划核心']],
    kids: [
      /* ① 坐标 */
      { id: 'coords', t: 'target', label: '宇宙之眼坐标', place: '深巨星核心 · 探测器跟踪模块', planet: 'gd', req: 'all',
        info: ['跟踪模块从轨道探测炮上脱落，沉进深巨星核心。它的投影池里存着第 9,318,054 号探测器找到的宇宙之眼坐标。'],
        quote: [['探测器9,318,054发现了与宇宙之眼所有已知指标相符的深空异常现象。', '飞船日志 · 探测器跟踪模块']],
        kids: [
          { id: 'g-sunk', t: 'gate', label: '知道模块沉在海底', planet: 'gd', req: 'any',
            info: ['先得知道坐标在海底，才会去想办法下潜。这是动机门槛，信息来源很多。'],
            kids: [
              { id: 'c-dmg', t: 'clue', label: '损伤报告：跟踪模块失踪', place: '轨道探测炮 · 控制模块', planet: 'opc',
                quote: [['探测器跟踪模块：遗失。', '挪麦文字 · 轨道探测炮损伤报告']] },
              { id: 'c-cassava', t: 'clue', label: '有部件沉到水流下', place: '碎空星南部天文台 / 建造厂', planet: 'bh',
                quote: [['建造厂的挪麦人看见有东西沉到了水流的下面。在此之前，他们觉得这种事情是不可能的。', '飞船日志 · 海洋深处（传闻）']] },
              { id: 'c-feld-core', t: 'clue', label: '费尔德斯巴到过核心', place: '黑棘星 · 费尔德斯巴', planet: 'db',
                quote: [['费尔德斯巴找到了抵达深巨星核心的方法。', '飞船日志 · 海洋深处（传闻）']] }
            ] },
          { id: 'g-current', t: 'gate', label: '潜到水流下面', place: '深巨星海面下的强水流', planet: 'gd', req: 'any',
            info: ['深巨星海面下有一层强水流，正常情况下任何东西都沉不下去。'],
            quote: [['加布罗说水面下有一股很强劲的水流，使得水里的东西无法沉下去。', '飞船日志 · 海洋深处（传闻）']],
            kids: [
              { id: 'c-tornado', t: 'clue', label: '逆时针气旋往下压', place: '碎空星 · 南部天文台龙卷风模型', planet: 'bh',
                info: ['到南部天文台要走碎空星地壳下的路：一条从重力炮出发，一条从量子知识之塔出发。从地面进不去。'],
                quote: [['还有一种较为罕见的气旋，会反方向旋转，把对象往水面和水流下方推。', '飞船日志 · 龙卷风模拟'], ['碎空星地下有两条通往天文台的路。一条起始于重力炮，另一条起始于量子知识之塔。', '飞船日志 · 南部天文台（传闻）']] }
            ] },
          { id: 'g-field', t: 'gate', label: '穿过核心外的电场', place: '深巨星核心外围', planet: 'gd', req: 'any',
            quote: [['水流下面的海洋出奇地宁静。某种电场环绕着行星的核心。', '飞船日志 · 海洋深处']],
            kids: [
              { id: 'c-jelly', t: 'clue', label: '水母内部绝缘', place: '黑棘星 · 费尔德斯巴营地的冻水母', planet: 'db', req: 'all',
                info: ['钻进深巨星的水母体内，就能随它穿过电场。'],
                quote: [['外皮就像橡胶，根本咬不动。可能是为了起到绝缘的作用，保护水母内部，以免触电。', '飞船日志 · 冻住的水母'], ['品尝过水母的内部之后，费尔德斯巴得出了结论，这些水母只有在隔绝电流时才有用。', '飞船日志 · 冻住的水母']],
                kids: [
                  { id: 'g-findfeld', t: 'gate', label: '找到费尔德斯巴', place: '黑棘星某颗种子里', planet: 'db', req: 'any',
                    kids: [
                      { id: 'c-harmonica', t: 'clue', label: '口琴信号', place: '信号镜 · 旅行者频道', planet: 'th',
                        quote: [['埃斯科的信号镜日志报告说，木炉星的某处传来了口琴声。', '飞船日志 · 黑棘星种子（传闻）']] },
                      { id: 'c-thseed', t: 'clue', label: '侦察兵射进木炉星种子', place: '木炉星 · 撞击坑', planet: 'th',
                        quote: [['当我把侦查兵发射到坠落在木炉星的种子里面去的时候，它最后却出现在了一个充满雾气和尖刺藤蔓的更大的空间。', '飞船日志 · 费尔德斯巴（传闻）']] },
                      { id: 'c-bramisland', t: 'clue', label: '荆棘岛上的旧营地', place: '深巨星 · 荆棘岛', planet: 'gd',
                        quote: [['看起来费尔德斯巴在前往黑棘星之前曾经在这里扎营。', '飞船日志 · 荆棘岛']] }
                    ] },
                  { id: 'g-angler', t: 'gate', shared: true, label: '活着躲过安康鱼', place: '黑棘星内部', planet: 'db', req: 'any',
                    info: ['飞船线和水母线都要穿过黑棘星，所以它是整张图里唯一被两条线共用的门槛，卡片右上角标着"两线共用"。'],
                    kids: [
                      { id: 'c-fossil', t: 'clue', label: '安康鱼是瞎的，靠听声', place: '余烬双星 · 安康鱼化石', planet: 'ct',
                        info: ['关掉引擎、靠惯性滑过去，安康鱼就发现不了你。化石在背阴城附近的洞穴里。'],
                        quote: [['之所以加入眼罩这个规则，是因为真正的安康鱼就是看不见的。', '飞船日志 · 安康鱼化石']] }
                    ] }
                ] }
            ] }
        ] },

      /* ② 飞船 */
      { id: 'vessel', t: 'target', label: '进入挪麦飞船', place: '黑棘星深处', planet: 'db', req: 'all',
        info: ['飞船当年被黑棘星缠住，跃迁核心摔坏了，但还能接收消息，也存着宇宙之眼的原始信号。'],
        quote: [['飞船坠毁在黑棘星上时，它的跃迁核心摔坏了。', '飞船日志 · 飞船（传闻）']],
        kids: [
          { id: 'g-knowvessel', t: 'gate', label: '知道有一艘飞船', planet: 'bh', req: 'any',
            kids: [
              { id: 'c-murals', t: 'clue', label: '三块壁画', place: '碎空星 · 旧定居点', planet: 'bh',
                quote: [['一幅黑棘星缠住挪麦飞船的壁画。', '飞船日志 · 壁画（第2块）']] },
              { id: 'c-podlogs', t: 'clue', label: '逃生舱飞行日志', place: '碎空星 / 余烬双星逃生舱', planet: 'ct',
                quote: [['所有三个逃生舱都是从某个损坏严重、名叫飞船的东西发射出来的。', '飞船日志 · 逃生舱']] }
            ] },
          { id: 'g-whichseed', t: 'gate', label: '知道飞船在哪颗种子里', place: '黑棘星', planet: 'db', req: 'any',
            kids: [
              { id: 'c-grave', t: 'clue', label: '侦察兵射进小种子拍到飞船', place: '黑棘星 · 挪麦坟墓', planet: 'db', req: 'all',
                quote: [['如果我把侦查兵发射到种子里面去，我就可以拍下那艘被挪麦人废弃的巨大飞船的照片。', '飞船日志 · 挪麦坟墓']],
                kids: [
                  { id: 'c-pod3', t: 'clue', label: '3号逃生舱：两个信标', place: '黑棘星 · 3号逃生舱', planet: 'db',
                    info: ['3号逃生舱的人测到两个一模一样的飞船信标，跟着近的那个走，留下一路灯光，最后死在小种子前。顺着灯光就能找到坟墓。'],
                    quote: [['3号逃生舱的幸存者检测到了从飞船发出的两个不同信标，好像飞船同时出现在了两个地方一样。', '飞船日志 · 3号逃生舱']] }
                ] }
            ] },
          { ref: 'g-angler' }
        ] },

      /* ③ 核心 */
      { id: 'core', t: 'target', label: '取得高级跃迁核心', place: '灰烬双星 · 中央舱室', planet: 'tt', req: 'all',
        info: ['灰烬双星计划的核心。飞船原来的核心坏了，只有这一颗能带飞船跃迁。'],
        quote: [['行星中央的保护外壳内部有一颗高级跃迁核心。移除核心将会关闭灰烬双星计划。', '飞船日志 · 灰烬双星计划']],
        kids: [
          { id: 'g-whereatp', t: 'gate', label: '知道计划在灰烬双星中心', planet: 'tt', req: 'any',
            kids: [
              { id: 'c-atp4', t: 'clue', label: '四处原文都指向它', place: '高能实验室 / 矿井 / 雕像车间 / 黑洞熔炉', planet: 'ct',
                info: ['高能实验室提议选址灰烬双星；木炉星矿井在造它的保护壳；雕像车间的面具装在里面；黑洞熔炉为它铸核心。日志数据里这四处都直接指向"灰烬双星计划"条目。'],
                quote: [['他们提议将灰烬双星作为该计划的选址。', '飞船日志 · 高能实验室']] }
            ] },
          { id: 'g-sealed', t: 'gate', label: '知道只能跃迁进去', planet: 'tt', req: 'any',
            kids: [
              { id: 'c-mine', t: 'clue', label: '保护壳没有任何物理入口', place: '木炉星 · 挪麦矿井', planet: 'th',
                quote: [['保护外壳一经完成，挪麦人便对其进行检查，确认其上没有裂缝，也没有任何与内部物理接触的方式。', '飞船日志 · 挪麦矿井']] }
            ] },
          { id: 'g-warp', t: 'gate', label: '会用跃迁平台', planet: 'whs', req: 'any',
            kids: [
              { id: 'c-whs', t: 'clue', label: '站上平台，等目标过头顶', place: '白洞站', planet: 'whs', req: 'all',
                quote: [['要使用跃迁塔，你必须站在跃迁平台上，等待跃迁塔与其对应的天体匹配（对应天体经过头顶正上方时，匹配就会完成）。', '飞船日志 · 白洞站']],
                kids: [
                  { id: 'c-bhfall', t: 'clue', label: '掉进碎空星的黑洞', place: '碎空星中心', planet: 'bh',
                    info: ['碎空星地表会碎裂，掉进中心黑洞的东西会从白洞那边出来，白洞站就在那里。'] }
                ] },
              { id: 'c-window', t: 'clue', label: '对齐有约五度的窗口', place: '碎空星 · 黑洞熔炉', planet: 'bh',
                quote: [['在有效时间内踏上跃迁平台的任何人都会立即跃迁。', '飞船日志 · 对齐角度简图']] }
            ] },
          { id: 'g-receiver', t: 'gate', label: '找到计划塔的接收点', place: '灰烬双星表面', planet: 'tt', req: 'any',
            kids: [
              { id: 'c-deduce', t: 'clue', label: '推理：接收点在灰烬双星上', planet: 'tt', req: 'all',
                info: ['赤道那圈高塔各通一处，只有计划塔看不出通向哪里。按黑洞熔炉的规则，沙漏双星共用两星之间的对准点，所以它的接收点就在灰烬双星自己身上。'],
                kids: [
                  { id: 'c-towermap', t: 'clue', label: '高塔设计图', place: '余烬双星 · 高能实验室', planet: 'ct',
                    quote: [['每座高塔的外观都设计成了对应跃迁目的地的风格。', '飞船日志 · 灰烬双星高塔设计图'], ['珀克：余烬双星上的高能实验室中的高塔设计图可以显示每个接收点的位置。', '挪麦文字 · 黑洞熔炉']] },
                  { id: 'c-forge', t: 'clue', label: '双星共用对准点', place: '碎空星 · 黑洞熔炉', planet: 'bh', req: 'all',
                    quote: [['沙漏双星离得特别近，就像一个天体一样，它们共用的对准点就在双星之间。', '飞船日志 · 黑洞熔炉']],
                    kids: [
                      { id: 'c-forgeswitch', t: 'clue', label: '融水区开关升降熔炉', place: '碎空星 · 悬空城', planet: 'bh',
                        quote: [['我在融水区找到了一个可以升降黑洞熔炉的开关。', '飞船日志 · 悬空城']] }
                    ] }
                ] }
            ] },
          { id: 'g-sand', t: 'gate', label: '等沙子露出接收点', place: '灰烬双星表面', planet: 'tt', req: 'any',
            kids: [
              { id: 'c-hourglass', t: 'clue', label: '沙子从灰烬流向余烬', place: '沙漏双星', planet: 'tt',
                info: ['循环开始时接收点埋在沙下。灰烬双星的沙子会慢慢流到余烬双星，循环后半段接收点才露出来。'] }
            ] }
        ] }
    ]
  }
},

qm: {
  title: '量子卫星支线',
  band: '可选。走完后，结局营火边会多出所莱内姆',
  aria: '量子卫星支线：三条量子法则和登月方法，最终在第六个位置见到所莱内姆',
  intro: '这条线不卡通关。走完它，你会在第六个位置见到所莱内姆，结局营火边她也会出现。三条量子法则缺一不可，分别藏在三颗星球上。',
  notes: '<div><b>这条线解释了宇宙之眼是什么：</b>量子卫星是宇宙之眼的卫星，本星系所有宏观量子现象很可能都源于宇宙之眼。</div>',
  root: {
    id: 'q-goal', t: 'goal', label: '第六位置见到所莱内姆', place: '量子卫星 · 宇宙之眼轨道', planet: 'qm', req: 'all',
    quote: [['量子卫星是宇宙之眼的卫星。', '飞船日志 · 第六个位置'], ['所莱内姆想知道，如果一个有意识的观察者进入宇宙之眼，那又会发生什么事情。', '飞船日志 · 第六个位置']],
    kids: [
      { id: 'q-land', t: 'gate', label: '登上量子卫星', place: '量子卫星 · 总在南极着陆', planet: 'qm', req: 'any',
        quote: [['前往量子卫星的人总是会来到南极（挪麦人也不知道这是为什么）。', '飞船日志 · 所莱内姆的航天飞机']],
        kids: [
          { id: 'q-locator', t: 'clue', label: '它有五个位置', place: '余烬双星 · 量子卫星定位器', planet: 'ct',
            info: ['知道它会在几颗行星之间跳，就能守在某个位置等它，飞近时一直盯着它。'],
            quote: [['量子卫星一共会出现在五个位置。', '飞船日志 · 量子卫星定位器']] }
        ] },
      { id: 'q-imaging', t: 'gate', label: '成像法则', place: '观察图像 = 观察本体', planet: 'qm', req: 'any',
        kids: [
          { id: 'q-trials', t: 'clue', label: '量子试验之塔', place: '深巨星', planet: 'gd',
            info: ['塔里的谜题本身就要用拍照来"固定"量子物体，过了关就学会了。'],
            quote: [['"观察一个量子对象；观察一个量子对象的图形。它们是一样的事情。"', '飞船日志 · 量子试验之塔']] }
        ] },
      { id: 'q-entangle', t: 'gate', label: '纠缠法则', place: '站在量子物体上，完全黑暗', planet: 'qm', req: 'any',
        kids: [
          { id: 'q-lakebed', t: 'clue', label: '科利耶斯消失之谜', place: '余烬双星 · 量子洞穴 / 湖床洞穴', planet: 'ct',
            quote: [['我必须站在量子对象上，停止观察我的周围（也就是说我必须完全处于黑暗之中），才能和该对象一起移动。', '飞船日志 · 湖床洞穴']] }
        ] },
      { id: 'q-sixth', t: 'gate', label: '第六位置法则', place: '祭坛必须在卫星北极', planet: 'qm', req: 'any',
        info: ['实际操作要把三条法则合起来用：祭坛本身也是量子物体，没人看它时会换位置。在祭坛里关门关灯，就会和它一起移动，卫星跳到别的行星。有些行星版本的地形挡住了北极，要先换到能走到北极的版本，站在北极背对着等祭坛出现，再进祭坛关灯一次，就到第六个位置。', '祭坛不在北极时，它的门会被碎石挡住。（步骤整理自 Wiki 和社区讨论）'],
        kids: [
          { id: 'q-knowledge', t: 'clue', label: '量子知识之塔', place: '碎空星', planet: 'bh', req: 'all',
            quote: [['但是，一定要记好这条最终的守则：要想探索第六个位置，祭坛必须位于卫星的北极。', '挪麦文字 · 量子知识之塔（贝尔斯）']],
            kids: [
              { id: 'q-cannon', t: 'clue', label: '召回航天飞机看到指路', place: '碎空星 · 重力炮', planet: 'bh',
                quote: [['贝尔斯：量子知识之塔在碎空星的另一头。如果你沿着西边的路走到十字路口，就能从那儿前往量子知识之塔。', '挪麦文字 · 重力炮旁的航天飞机记录']] }
            ] }
        ] }
    ]
  }
},

comet: {
  title: '闯入者支线',
  band: '可选。只解释挪麦人为什么灭绝，不影响通关',
  aria: '闯入者支线：召回航天飞机、到达彗星冰下、看清幽灵物质，最终找到挪麦人灭绝原因',
  intro: '这条线也不卡通关，回答的是"挪麦人去哪了"：彗星核心里的幽灵物质破裂外泄，几乎一瞬间覆盖了整个星系。',
  notes: '<div><b>和主线的关系：</b>太阳站失败后，挪麦人才转去调查刚到的彗星（原文"稍事休息，对刚抵达的彗星展开了调查"）。</div>',
  root: {
    id: 'i-goal', t: 'goal', label: '挪麦人灭绝的真相', place: '闯入者 · 破裂的核心', planet: 'comet', req: 'all',
    quote: [['如果岩石裂开来，那么里面的异常物质便会迅速扩散，几乎一眨眼就可以覆盖这个太阳系。', '飞船日志 · 破裂的核心']],
    kids: [
      { id: 'i-know', t: 'gate', label: '知道挪麦人去过彗星', planet: 'comet', req: 'any',
        kids: [
          { id: 'i-shuttle', t: 'clue', label: '召回冻住的航天飞机', place: '余烬双星 · 重力炮', planet: 'ct',
            quote: [['冻结在闯入者上的挪麦航天飞机可以被召回到余烬双星的重力炮那里去。', '飞船日志 · 重力炮（传闻）']] },
          { id: 'i-sunstation', t: 'clue', label: '太阳站失败后去看彗星', place: '太阳站 / 灰烬双星计划', planet: 'ss',
            quote: [['太阳站失败后，挪麦人稍事休息，对刚抵达的彗星展开了调查。', '飞船日志 · 太阳站']] }
        ] },
      { id: 'i-enter', t: 'gate', label: '进到彗星冰层下面', place: '闯入者向阳面的冰缝', planet: 'comet', req: 'any',
        quote: [['两个挪麦人在闯入者向阳面的冰块里发现了一道沟壑。他们爬了进去，想要进行调查。', '飞船日志 · 破裂的核心（传闻）']],
        kids: [
          { id: 'i-frozen', t: 'clue', label: '冰封航天飞机的记录', place: '闯入者表面', planet: 'comet',
            quote: [['航天飞机上载着三个挪麦人。其中一个留了下来，保障航天飞机的温度。其他两个人则去探索闯入者。', '飞船日志 · 冻住的挪麦航天飞机']] }
        ] },
      { id: 'i-ghost', t: 'gate', label: '避开幽灵物质', place: '肉眼看不见的致命物质', planet: 'comet', req: 'any',
        kids: [
          { id: 'i-photo', t: 'clue', label: '照片里能看见幽灵物质', place: '木炉星 · 新手区', planet: 'th',
            quote: [['危险！这道栅栏后面有一团幽灵物质。它拥有奇怪的特性，并且冰冷异常，无法被肉眼观察到。好消息是，你可以通过摄像机来侦测到幽灵物质。', '说明牌 · 木炉星村子']] }
        ] }
    ]
  }
}
};

/* 替代路径：按挂载的门槛 id 归组。alt: official 官方其他解法 / luck 运气、试错或硬闯 / skip 已知答案跳过 / glitch 速通 bug */
const SRC = {
  wiki: (p) => ['官方 Wiki · ' + p.replace(/_/g, ' '), 'https://outerwilds.fandom.com/wiki/' + p],
  sr: ['speedrun.com 速通指南', 'https://www.speedrun.com/outer_wilds/guides/6oj7z'],
  gc: ['速通社区 bug 清单', 'https://docs.google.com/spreadsheets/d/1XKoZi-efCbfA6D8miICIEYFJIaqEdkApqRS63xFGn8g'],
  qmsteam: ['Steam 讨论：祭坛与北极', 'https://steamcommunity.com/app/753640/discussions/0/2568690592367993639']
};
const ALTS = {
  coords: [
    { id: 'a-coords-known', alt: 'skip', label: '已经记住坐标', place: '二周目 / 看过攻略',
      info: ['宇宙之眼坐标对所有玩家、所有存档都一样。飞船不检查你这一局有没有见过跟踪模块，直接输入就能用。', '所以整条"坐标"线对知道答案的人可以全部跳过，速通和"新手的运气"成就（一个循环内通关）都不去深巨星。'],
      src: [SRC.wiki('Eye_of_the_Universe'), SRC.sr] }
  ],
  'g-current': [
    { id: 'a-cur-accident', alt: 'luck', label: '碰巧被逆时针气旋卷下去', place: '深巨星海面',
      info: ['费尔德斯巴自己就是这么发现的。'],
      quote: [['我是无意间才发现的，不过这事咱们就别告诉其他人了，行吗？', '对话 · 费尔德斯巴（你告诉他气旋诀窍之后）']] },
    { id: 'a-cur-dive', alt: 'luck', label: '高速直冲核心', place: '深巨星',
      info: ['速度够快可以直接冲破水流（各处说法在每秒 7000 到 10000 米之间，未统一），撞上岛就会死。对应"深度冲击"成就。'],
      src: [SRC.wiki('Achievements'), SRC.wiki('Giant%27s_Deep')] },
    { id: 'a-cur-island', alt: 'luck', label: '停在被抛起的岛下面', place: '深巨星',
      info: ['岛被顺时针气旋抛上天再落回时，有时会把下面的飞船砸到水流以下。'],
      src: [SRC.wiki('Giant%27s_Deep')] },
    { id: 'a-cur-shuttle', alt: 'luck', label: '用重力炮把航天飞机打过去', place: '碎空星重力炮 → 深巨星',
      info: ['两颗星靠近时，用碎空星重力炮发射所莱内姆的航天飞机，能穿过水流，但穿不过核心外的电场。前提是已经把它从量子卫星召回来。'],
      src: [SRC.wiki('Giant%27s_Deep')] }
  ],
  'g-field': [
    { id: 'a-field-watch', alt: 'luck', label: '看到水母穿行电场，自己试', place: '深巨星水流下',
      info: ['水母会在电场里上下游动，观察后自己钻进去试，也能发现绝缘这件事。'] },
    { id: 'a-field-shipjelly', alt: 'glitch', label: '开着飞船钻进水母', place: '已在 1.0.2 修复',
      info: ['早期版本可以连人带船钻进水母穿过电场，1.0.2 之后不行了。现行版本里水母是唯一已知的方法。'],
      src: [SRC.wiki('Jellyfish')] }
  ],
  'g-findfeld': [
    { id: 'a-feld-wander', alt: 'luck', label: '在黑棘星里乱逛撞见', place: '黑棘星' }
  ],
  'g-angler': [
    { id: 'a-ang-drift', alt: 'luck', label: '出种子后不加速，直接漂', place: '黑棘星',
      info: ['从种子出来的速度和方向是固定的，什么都不按就能稳定漂过去；转动机身不会惊动它们。'],
      src: [SRC.wiki('Anglerfish')] },
    { id: 'a-ang-dodge', alt: 'luck', label: '全速甩开或绕藤蔓卡住它', place: '黑棘星',
      info: ['硬闯也行，让安康鱼卡在藤蔓之间。速通里有专门的躲鱼路线。'],
      src: [SRC.wiki('Anglerfish'), SRC.sr] },
    { id: 'a-ang-clip', alt: 'glitch', label: '弹出驾驶舱穿模', place: '仅 PC',
      info: ['在黑棘星外弹出驾驶舱可以直接进入内部的几个区域，包括安康鱼巢和挪麦坟墓。'],
      src: [SRC.gc] }
  ],
  'g-knowvessel': [
    { id: 'a-vessel-known', alt: 'skip', label: '已经知道剧情', place: '二周目' }
  ],
  'g-whichseed': [
    { id: 'a-seed-explore', alt: 'luck', label: '盲目探索黑棘星', place: '黑棘星' },
    { id: 'a-seed-known', alt: 'skip', label: '已知路线', place: '红色种子 → 安康鱼巢 → 不发光的种子',
      info: ['飞船所在的种子就在安康鱼巢里，是唯一不发光的那颗。知道路线可以完全不经过3号逃生舱和坟墓。'],
      src: [SRC.wiki('Dark_Bramble'), SRC.wiki('Achievements')] }
  ],
  'g-whereatp': [
    { id: 'a-atp-known', alt: 'skip', label: '已经知道', place: '二周目' }
  ],
  'g-sealed': [
    { id: 'a-sealed-try', alt: 'luck', label: '飞到灰烬双星发现进不去', place: '灰烬双星' }
  ],
  'g-warp': [
    { id: 'a-warp-accident', alt: 'luck', label: '碰巧站上平台被传走', place: '任意跃迁平台',
      info: ['跃迁平台在对准窗口内会把站上去的人立刻传走，很多玩家是无意中先被传了一次才弄懂的。'] }
  ],
  'g-receiver': [
    { id: 'a-recv-body', alt: 'official', label: '正确的塔外有挪麦遗体', place: '灰烬双星 · 计划塔', verify: true,
      info: ['Wiki 说计划塔外躺着一具挪麦遗体，可以当作提示。我没有在原文里核到这一点。'],
      src: [SRC.wiki('Ash_Twin_Project')] },
    { id: 'a-recv-try', alt: 'luck', label: '把每座塔的平台挨个试', place: '灰烬双星赤道' },
    { id: 'a-recv-known', alt: 'skip', label: '已知接收点位置', place: '二周目' }
  ],
  'g-sand': [
    { id: 'a-sand-sleep', alt: 'official', label: '营火边打盹快进', place: '任意营火',
      info: ['拿到发射密码后就能在营火边打盹跳过时间（1.1.8 起）。速通会睡到约 6:30 到 7:05。'],
      src: [SRC.sr] },
    { id: 'a-sand-early', alt: 'luck', label: '平台刚露出就进', place: '约第 7 分 50 秒',
      info: ['不用等沙子流完，平台一露出来就能用；还可以先把侦察兵扔到平台上触发跃迁再跟进。'],
      src: [SRC.wiki('Ash_Twin_Project')] }
  ],
  'q-land': [
    { id: 'aq-photo', alt: 'official', label: '拍照后盯着它降落', place: '量子卫星',
      info: ['先拍一张量子卫星的照片，降落途中一直看着它，它就不会跳走。这本身就是成像法则的用法。'],
      src: [SRC.wiki('Quantum_Moon')] }
  ],
  'q-imaging': [
    { id: 'aq-img-try', alt: 'luck', label: '自己试出拍照能定住它', place: '任意量子物体', verify: true,
      info: ['社区里有玩家完全靠试错摸出这条规则，属于个人说法。'], src: [SRC.qmsteam] }
  ],
  'q-entangle': [
    { id: 'aq-shard', alt: 'official', label: '碎空星高塔碎片旁的文字', place: '碎空星', verify: true,
      info: ['Wiki 说碎空星"高塔碎片"旁的挪麦文字也暗示了黑暗规则，我没逐条核对原文。'], src: [SRC.wiki('Quantum_Moon')] },
    { id: 'aq-ent-try', alt: 'luck', label: '在量子物体上关灯试出来', place: '任意量子碎片' }
  ],
  'q-sixth': [
    { id: 'aq-whs', alt: 'official', label: '塔坠入黑洞后到白洞站读', place: '白洞站附近',
      info: ['量子知识之塔会随碎空星崩塌掉进黑洞，从白洞那边出来后也能读到同一条法则。'],
      src: [SRC.wiki('Quantum_Moon')] },
    { id: 'aq-blink', alt: 'glitch', label: '开关地图也算"没在看"', place: '量子卫星',
      info: ['打开地图等于不观察，能让量子物体（包括祭坛）快速换位置，被速通社区当作技巧使用。'],
      src: [SRC.gc] },
    { id: 'aq-oob', alt: 'glitch', label: '穿模出界直达', place: '量子卫星',
      info: ['利用卫星模型的缝隙出界，或在祭坛门口卡位（"Door Bonk"等），更快到达所莱内姆。'],
      src: [SRC.gc] }
  ],
  'i-enter': [
    { id: 'ai-melt', alt: 'luck', label: '等彗星靠近太阳冰面融开', place: '闯入者向阳面',
      info: ['彗星向阳面的冰会随着接近太阳融开，自己观察也能找到入口。'], src: [SRC.wiki('Interloper')] },
    { id: 'ai-bonk', alt: 'glitch', label: '无宇航服移动的 bug', place: '闯入者', src: [SRC.gc] }
  ],
  'i-ghost': [
    { id: 'ai-scout', alt: 'official', label: '发射侦察兵也能看到', place: '任意幽灵物质', src: [SRC.wiki('Ghost_Matter')] },
    { id: 'ai-try', alt: 'luck', label: '死过几次就知道了', place: '闯入者' }
  ]
};
(function attach() {
  for (const k in TREES) (function walk(n) {
    if (n.ref) return;
    if (ALTS[n.id]) n.kids = (n.kids || []).concat(ALTS[n.id].map(a => Object.assign({ t: 'alt' }, a)));
    (n.kids || []).forEach(walk);
  })(TREES[k].root);
})();
