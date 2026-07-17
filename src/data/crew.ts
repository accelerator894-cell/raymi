export interface CrewMember {
  id: string;
  name: string;
  nameEn: string;
  initial: string;
  role: string;
  color: string;
  status: "存活" | "已故" | "失踪";
  specialty: string[];
  quote: string;
  description: string;
}

export const crewMembers: CrewMember[] = [
  {
    id: "david",
    name: "大卫·马丁内斯",
    nameEn: "DAVID MARTINEZ",
    initial: "卫",
    role: "边缘行者 / 主角",
    color: "#fcee0a",
    status: "已故",
    specialty: ["军用级桑德维斯坦", "猩猩臂", "原型机甲"],
    quote: "我的梦想，就是让你实现梦想。",
    description:
      "圣多明哥出身的穷小子，靠母亲倒卖义体供上荒坂学院。母亲死于街头火并后，他植入军用级桑德维斯坦踏入地下世界。天赋异禀的身体让他能承受常人无法负荷的改造，却也一步步滑向赛博精神病的深渊。最终为救露西独闯荒坂塔，死于亚当·重锤之手——死后，来生酒吧多了一杯以他命名的酒。",
  },
  {
    id: "lucy",
    name: "露西",
    nameEn: "LUCY / LUCYNA KUSHINADA",
    initial: "露",
    role: "网络行者",
    color: "#00f0ff",
    status: "存活",
    specialty: ["深潜", "入侵协议", "旧网络探索"],
    quote: "我想去月球。",
    description:
      "从小被荒坂培养成深潜兵器，在旧网络废墟里目睹同伴一个个死去后逃出公司。冷静、寡言、烟不离手，把「去月球」当作逃离一切的终极出口。遇见大卫后第一次有了想守护的人——为了抹去荒坂对大卫的追查，她独自潜入深网删除痕迹。故事的结尾，她真的站上了月球，身边却没有了那个人。",
  },
  {
    id: "rebecca",
    name: "丽贝卡",
    nameEn: "REBECCA",
    initial: "丽",
    role: "枪手",
    color: "#39ff14",
    status: "已故",
    specialty: ["重型霰弹枪", "四臂义体", "火力压制"],
    quote: "大卫，别死啊。",
    description:
      "绿色双马尾配四只义体手臂，人小鬼大的移动军火库。性格火爆直率，笑就大声笑，打就往死里打。一直暗恋大卫，陪他喝酒、替他挡枪，却从没把喜欢说出口。哥哥皮拉尔死后她把悲伤压进枪膛，最终决战选择留下断后。全剧最吵的枪，也是最让人意难平的一颗真心。",
  },
  {
    id: "maine",
    name: "曼恩",
    nameEn: "MAINE",
    initial: "曼",
    role: "队长",
    color: "#ff6b35",
    status: "已故",
    specialty: ["重型义体改造", "正面强攻", "团队指挥"],
    quote: "在夜之城，要么成为传奇，要么死无葬身之地。",
    description:
      "边缘行者团队的老大，把大卫从菜鸟带成独当一面的佣兵。信奉「身体就是资本」，不断加装义体的代价是赛博精神病逐渐侵蚀理智。最终在一次任务中彻底失控，于爆炸中与多莉欧一同谢幕。他死后，大卫继承了他的手臂、他的位置，也继承了他的诅咒。",
  },
  {
    id: "dorio",
    name: "多莉欧",
    nameEn: "DORIO",
    initial: "多",
    role: "副队长",
    color: "#b537f2",
    status: "已故",
    specialty: ["近身格斗", "护卫", "战场判断"],
    quote: "别硬撑，活着才有下一次。",
    description:
      "曼恩的恋人与副手，团队里最稳的定海神针。实力强悍却从不逞强，总在曼恩和大卫快要失控时把他们拉回来。曼恩陷入赛博精神病时，所有人都撤了，只有她留到最后——不是不知道危险，是不会丢下他。夜之城少见的、把「义气」二字贯彻到底的人。",
  },
  {
    id: "kiwi",
    name: "琦薇",
    nameEn: "KIWI",
    initial: "琦",
    role: "网络行者",
    color: "#ff2a6d",
    status: "已故",
    specialty: ["深潜", "电子战", "情报渗透"],
    quote: "在夜之城，信任是最贵的奢侈品。",
    description:
      "戴着标志性面具的神秘网络行者，露西的前辈与引路人。冷静、现实、永远给自己留后路。她用行动诠释了夜之城的生存法则：没有永远的朋友，只有永远的利益。最终的选择让团队付出惨痛代价，而她自己也没能全身而退——背叛者在这座城里，同样没有好下场。",
  },
  {
    id: "pilar",
    name: "皮拉尔",
    nameEn: "PILAR",
    initial: "皮",
    role: "技术支援 / 枪手",
    color: "#ff9f1c",
    status: "已故",
    specialty: ["机械改造", "装备维护", "贫嘴"],
    quote: "我这双手可是艺术品！",
    description:
      "丽贝卡的哥哥，团队里的活宝兼技术宅，一双改得花里胡哨的机械臂是他的骄傲。话多、爱吹牛、爱妹妹，是典型的夜之城街头小子。他的死来得毫无预兆——一次再普通不过的任务，一颗不知道从哪飞来的子弹。夜之城就是这样，死亡从不提前预约。",
  },
  {
    id: "falco",
    name: "法尔科",
    nameEn: "FALCO",
    initial: "法",
    role: "司机",
    color: "#4d9de0",
    status: "存活",
    specialty: ["极限驾驶", "撤离路线规划", "改装车"],
    quote: "上车，剩下的交给我。",
    description:
      "团队里最不起眼的成员，却在最关键的时刻永远踩得准油门。枪林弹雨中负责断后撤离，话不多，活儿好。最终决战后，是他带着重伤的露西离开夜之城，并把大卫的骨灰与那杯「大卫·马丁内斯」的故事带回来生酒吧——传奇落幕之后，总得有人负责记住。",
  },
];
