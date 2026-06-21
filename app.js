// ===== 収益化設定（各サービス登録後にIDを入れる） =====
const REVENUE_CONFIG = {
  // Stripe Payment Link — https://dashboard.stripe.com/payment-links で作成
  // 作成時 "決済後のリダイレクト先" に ?premium=activated を付けたURLを設定
  stripePaymentLink: "", // 例: "https://buy.stripe.com/xxxxx"

  // 楽天アフィリエイトID — https://affiliate.rakuten.co.jp/ で取得
  rakutenAffiliateId: "", // 例: "1234abcd.5678efgh.9012ijkl"

  // Amazonアソシエイト タグ — https://affiliate.amazon.co.jp/ で取得
  amazonTag: "", // 例: "michinoeki-22"
};

// ===== 定数 =====
const PREF_ORDER = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県",
  "三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
  "鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県",
  "福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"
];

const REGIONS = {
  "北海道":["北海道"],"東北":["青森県","岩手県","宮城県","秋田県","山形県","福島県"],
  "関東":["茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県"],
  "中部":["新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県"],
  "近畿":["三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県"],
  "中国":["鳥取県","島根県","岡山県","広島県","山口県"],
  "四国":["徳島県","香川県","愛媛県","高知県"],
  "九州沖縄":["福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"]
};

const PREF_EMOJI = {
  "北海道":"🦌","青森県":"🍎","岩手県":"⛩️","宮城県":"🐄","秋田県":"🌾","山形県":"🍒","福島県":"🍑",
  "茨城県":"🌹","栃木県":"🍓","群馬県":"♨️","埼玉県":"🏯","千葉県":"🥜","東京都":"🗼","神奈川県":"⛵",
  "新潟県":"🍚","富山県":"🏔️","石川県":"🎣","福井県":"🦀","山梨県":"🍇","長野県":"🍎","岐阜県":"🏯","静岡県":"🗻","愛知県":"🏭",
  "三重県":"🦐","滋賀県":"🛶","京都府":"⛩️","大阪府":"🏙️","兵庫県":"🐮","奈良県":"🦌","和歌山県":"🍊",
  "鳥取県":"🏜️","島根県":"⛩️","岡山県":"🍑","広島県":"🍁","山口県":"🐡",
  "徳島県":"🌀","香川県":"🍜","愛媛県":"🍊","高知県":"🐋",
  "福岡県":"🍜","佐賀県":"🏺","長崎県":"⛪","熊本県":"🐻","大分県":"♨️","宮崎県":"🌴","鹿児島県":"🌋","沖縄県":"🌺"
};

const LEVELS = [
  { min: 0,    title: "未踏の旅人",   emoji: "🗾" },
  { min: 1,    title: "はじめの一歩",  emoji: "🎯" },
  { min: 10,   title: "駆け出し旅人",  emoji: "⭐" },
  { min: 50,   title: "探検家",       emoji: "🌟" },
  { min: 100,  title: "道の駅マスター", emoji: "💫" },
  { min: 200,  title: "ベテラン旅人",  emoji: "🔥" },
  { min: 500,  title: "道の駅の達人",  emoji: "👑" },
  { min: 1000, title: "全国制覇レジェンド", emoji: "🏆" }
];

const BADGES = [
  { id:"first",  emoji:"🎯", title:"はじめの一歩",    desc:"最初の道の駅を訪問",     check:v=>v>=1,   max:1 },
  { id:"b10",    emoji:"⭐", title:"10駅達成",        desc:"10駅を訪問",            check:v=>v>=10,  max:10 },
  { id:"b50",    emoji:"🌟", title:"50駅達成",        desc:"50駅を訪問",            check:v=>v>=50,  max:50 },
  { id:"b100",   emoji:"💫", title:"100駅マスター",   desc:"100駅を訪問",           check:v=>v>=100, max:100 },
  { id:"b200",   emoji:"🔥", title:"200駅制覇",       desc:"200駅を訪問",           check:v=>v>=200, max:200 },
  { id:"b500",   emoji:"👑", title:"500駅の達人",     desc:"500駅を訪問",           check:v=>v>=500, max:500 },
  { id:"b1000",  emoji:"🏆", title:"1000駅レジェンド", desc:"1000駅を訪問",          check:v=>v>=1000,max:1000 },
  { id:"complete",emoji:"🎊",title:"全駅制覇",        desc:"全ての道の駅を訪問",     check:(v,t)=>v>=t, max:null },
  { id:"pref1",  emoji:"🗾", title:"県制覇デビュー",   desc:"1つの都道府県を全駅訪問",check:(_,__,pc)=>pc>=1, max:1, type:"pref" },
  { id:"pref5",  emoji:"🏅", title:"5県制覇",         desc:"5つの都道府県を全駅訪問", check:(_,__,pc)=>pc>=5, max:5, type:"pref" },
  { id:"pref10", emoji:"🎖️", title:"10県マスター",    desc:"10都道府県を全駅訪問",   check:(_,__,pc)=>pc>=10,max:10,type:"pref" },
  { id:"photo",  emoji:"📸", title:"カメラマン",       desc:"スタンプ写真を5枚記録",  check:(_,__,___,ph)=>ph>=5, max:5, type:"photo" }
];

const PREF_SPECIALTIES = {
  "北海道":[{emoji:"🦀",name:"カニ"},{emoji:"🍦",name:"ソフトクリーム"},{emoji:"🐟",name:"鮭"},{emoji:"🧈",name:"バター"},{emoji:"🥔",name:"じゃがいも"},{emoji:"🌽",name:"とうもろこし"},{emoji:"🍈",name:"メロン"},{emoji:"🐑",name:"ジンギスカン"},{emoji:"🦑",name:"イカ"},{emoji:"🧀",name:"チーズ"}],
  "青森県":[{emoji:"🍎",name:"りんご"},{emoji:"🐟",name:"大間マグロ"},{emoji:"🧄",name:"にんにく"},{emoji:"🍶",name:"田酒"},{emoji:"🌸",name:"桜餅"}],
  "岩手県":[{emoji:"🥩",name:"前沢牛"},{emoji:"🍜",name:"わんこそば"},{emoji:"🫘",name:"南部せんべい"},{emoji:"🐚",name:"ホヤ"},{emoji:"🍶",name:"南部美人"}],
  "宮城県":[{emoji:"👅",name:"牛タン"},{emoji:"🍚",name:"ずんだ餅"},{emoji:"🦪",name:"松島牡蠣"},{emoji:"🍣",name:"笹かまぼこ"},{emoji:"🐟",name:"ホヤ"}],
  "秋田県":[{emoji:"🌾",name:"きりたんぽ"},{emoji:"🍚",name:"あきたこまち"},{emoji:"🥒",name:"いぶりがっこ"},{emoji:"🍶",name:"日本酒"},{emoji:"🐶",name:"秋田犬もなか"}],
  "山形県":[{emoji:"🍒",name:"さくらんぼ"},{emoji:"🍜",name:"米沢ラーメン"},{emoji:"🥩",name:"米沢牛"},{emoji:"🍇",name:"ぶどう"},{emoji:"🍐",name:"ラ・フランス"}],
  "福島県":[{emoji:"🍑",name:"桃"},{emoji:"🐴",name:"馬刺し"},{emoji:"🍜",name:"喜多方ラーメン"},{emoji:"🥟",name:"円盤餃子"},{emoji:"🍶",name:"日本酒"}],
  "茨城県":[{emoji:"🍠",name:"干し芋"},{emoji:"🫘",name:"納豆"},{emoji:"🍈",name:"メロン"},{emoji:"🐟",name:"あんこう"},{emoji:"🌰",name:"栗"}],
  "栃木県":[{emoji:"🍓",name:"とちおとめ"},{emoji:"🥟",name:"宇都宮餃子"},{emoji:"🧀",name:"日光ゆば"},{emoji:"🍜",name:"佐野ラーメン"},{emoji:"🍶",name:"益子焼酒器"}],
  "群馬県":[{emoji:"🥬",name:"こんにゃく"},{emoji:"♨️",name:"温泉まんじゅう"},{emoji:"🍜",name:"水沢うどん"},{emoji:"🥬",name:"下仁田ネギ"},{emoji:"🍖",name:"焼きまんじゅう"}],
  "埼玉県":[{emoji:"🍵",name:"狭山茶"},{emoji:"🍜",name:"武蔵野うどん"},{emoji:"🍠",name:"川越芋"},{emoji:"🥜",name:"五家宝"},{emoji:"🧅",name:"深谷ネギ"}],
  "千葉県":[{emoji:"🥜",name:"落花生"},{emoji:"🐟",name:"なめろう"},{emoji:"🍓",name:"いちご"},{emoji:"🦪",name:"はまぐり"},{emoji:"🌸",name:"びわ"}],
  "東京都":[{emoji:"🥘",name:"もんじゃ焼き"},{emoji:"🍣",name:"江戸前寿司"},{emoji:"🍘",name:"雷おこし"},{emoji:"🍡",name:"人形焼"},{emoji:"🥚",name:"玉子焼き"}],
  "神奈川県":[{emoji:"🥟",name:"シウマイ"},{emoji:"🍜",name:"家系ラーメン"},{emoji:"🧁",name:"鎌倉カスター"},{emoji:"🐟",name:"しらす"},{emoji:"🍖",name:"厚木シロコロ"}],
  "新潟県":[{emoji:"🍚",name:"コシヒカリ"},{emoji:"🍘",name:"笹団子"},{emoji:"🍶",name:"日本酒"},{emoji:"🦀",name:"紅ズワイガニ"},{emoji:"🍜",name:"へぎそば"}],
  "富山県":[{emoji:"🍣",name:"ます寿司"},{emoji:"🦐",name:"白エビ"},{emoji:"🐟",name:"ホタルイカ"},{emoji:"🍚",name:"富山ブラック"},{emoji:"🧊",name:"氷見うどん"}],
  "石川県":[{emoji:"🦀",name:"加能ガニ"},{emoji:"🍣",name:"回転寿司"},{emoji:"🍵",name:"加賀棒茶"},{emoji:"🐟",name:"のどぐろ"},{emoji:"🍡",name:"きんつば"}],
  "福井県":[{emoji:"🦀",name:"越前ガニ"},{emoji:"🍜",name:"越前おろしそば"},{emoji:"🥜",name:"羽二重餅"},{emoji:"🐟",name:"へしこ"},{emoji:"🍖",name:"ソースカツ丼"}],
  "山梨県":[{emoji:"🍇",name:"ぶどう"},{emoji:"🍑",name:"もも"},{emoji:"🍜",name:"ほうとう"},{emoji:"🍷",name:"ワイン"},{emoji:"🥩",name:"甲州地鶏"}],
  "長野県":[{emoji:"🍎",name:"りんご"},{emoji:"🍜",name:"信州そば"},{emoji:"🐛",name:"蜂の子"},{emoji:"🥬",name:"野沢菜"},{emoji:"🧀",name:"おやき"}],
  "岐阜県":[{emoji:"🥩",name:"飛騨牛"},{emoji:"🍡",name:"五平餅"},{emoji:"🐟",name:"鮎"},{emoji:"🥬",name:"漬物ステーキ"},{emoji:"🍶",name:"地酒"}],
  "静岡県":[{emoji:"🍵",name:"お茶"},{emoji:"🐟",name:"桜エビ"},{emoji:"🦐",name:"しらす"},{emoji:"🍊",name:"みかん"},{emoji:"🍢",name:"静岡おでん"}],
  "愛知県":[{emoji:"🐔",name:"手羽先"},{emoji:"🍜",name:"味噌煮込み"},{emoji:"🦐",name:"えびせんべい"},{emoji:"🍡",name:"ういろう"},{emoji:"🐙",name:"たこ焼き"}],
  "三重県":[{emoji:"🦐",name:"伊勢エビ"},{emoji:"🐮",name:"松阪牛"},{emoji:"🦪",name:"的矢牡蠣"},{emoji:"🍡",name:"赤福"},{emoji:"🐟",name:"あわび"}],
  "滋賀県":[{emoji:"🐟",name:"鮒寿司"},{emoji:"🥩",name:"近江牛"},{emoji:"🍵",name:"朝宮茶"},{emoji:"🧅",name:"赤こんにゃく"},{emoji:"🍘",name:"丁稚羊羹"}],
  "京都府":[{emoji:"🍵",name:"宇治抹茶"},{emoji:"🥒",name:"京漬物"},{emoji:"🍡",name:"八つ橋"},{emoji:"🧈",name:"湯葉"},{emoji:"🐟",name:"鯖寿司"}],
  "大阪府":[{emoji:"🐙",name:"たこ焼き"},{emoji:"🍖",name:"串カツ"},{emoji:"🍜",name:"お好み焼き"},{emoji:"🍘",name:"おこし"},{emoji:"🦑",name:"イカ焼き"}],
  "兵庫県":[{emoji:"🐮",name:"神戸牛"},{emoji:"🐙",name:"明石焼き"},{emoji:"🧅",name:"淡路島玉ねぎ"},{emoji:"🍶",name:"灘の酒"},{emoji:"🦐",name:"香住ガニ"}],
  "奈良県":[{emoji:"🦌",name:"柿の葉寿司"},{emoji:"🍡",name:"よもぎ餅"},{emoji:"🍜",name:"三輪そうめん"},{emoji:"🥒",name:"奈良漬"},{emoji:"🍵",name:"大和茶"}],
  "和歌山県":[{emoji:"🍊",name:"みかん"},{emoji:"🍑",name:"桃"},{emoji:"🐟",name:"しらす"},{emoji:"🍶",name:"梅酒"},{emoji:"🥜",name:"南高梅"}],
  "鳥取県":[{emoji:"🍐",name:"二十世紀梨"},{emoji:"🦀",name:"松葉ガニ"},{emoji:"🐟",name:"白いか"},{emoji:"🍈",name:"スイカ"},{emoji:"🥜",name:"らっきょう"}],
  "島根県":[{emoji:"🍜",name:"出雲そば"},{emoji:"🐚",name:"しじみ"},{emoji:"🍶",name:"地酒"},{emoji:"🥩",name:"しまね和牛"},{emoji:"🍡",name:"ぜんざい"}],
  "岡山県":[{emoji:"🍑",name:"白桃"},{emoji:"🍇",name:"マスカット"},{emoji:"🍜",name:"ままかり寿司"},{emoji:"🐟",name:"サワラ"},{emoji:"🍘",name:"きびだんご"}],
  "広島県":[{emoji:"🦪",name:"牡蠣"},{emoji:"🍜",name:"お好み焼き"},{emoji:"🍋",name:"レモン"},{emoji:"🍡",name:"もみじ饅頭"},{emoji:"🐟",name:"あなご"}],
  "山口県":[{emoji:"🐡",name:"ふぐ"},{emoji:"🦐",name:"車エビ"},{emoji:"🍊",name:"夏みかん"},{emoji:"🍘",name:"外郎"},{emoji:"🐟",name:"甘鯛"}],
  "徳島県":[{emoji:"🌊",name:"鳴門わかめ"},{emoji:"🍠",name:"鳴門金時"},{emoji:"🍜",name:"徳島ラーメン"},{emoji:"🐟",name:"鯛"},{emoji:"🍊",name:"すだち"}],
  "香川県":[{emoji:"🍜",name:"讃岐うどん"},{emoji:"🫒",name:"オリーブ"},{emoji:"🐟",name:"いりこ"},{emoji:"🥬",name:"金時にんじん"},{emoji:"🍡",name:"おいり"}],
  "愛媛県":[{emoji:"🍊",name:"みかん"},{emoji:"🐟",name:"鯛めし"},{emoji:"🍋",name:"レモン"},{emoji:"🥩",name:"じゃこ天"},{emoji:"🧁",name:"タルト"}],
  "高知県":[{emoji:"🐟",name:"カツオ"},{emoji:"🍊",name:"ゆず"},{emoji:"🐋",name:"くじら"},{emoji:"🍶",name:"地酒"},{emoji:"🍅",name:"フルーツトマト"}],
  "福岡県":[{emoji:"🍜",name:"博多ラーメン"},{emoji:"🍢",name:"もつ鍋"},{emoji:"🍓",name:"あまおう"},{emoji:"🐙",name:"明太子"},{emoji:"🍡",name:"梅ヶ枝餅"}],
  "佐賀県":[{emoji:"🥩",name:"佐賀牛"},{emoji:"🦑",name:"イカ"},{emoji:"🍊",name:"みかん"},{emoji:"🐟",name:"ムツゴロウ"},{emoji:"🧁",name:"小城羊羹"}],
  "長崎県":[{emoji:"🍰",name:"カステラ"},{emoji:"🍜",name:"ちゃんぽん"},{emoji:"🥩",name:"角煮まん"},{emoji:"🐟",name:"アジ"},{emoji:"🥚",name:"皿うどん"}],
  "熊本県":[{emoji:"🐴",name:"馬刺し"},{emoji:"🍜",name:"太平燕"},{emoji:"🍊",name:"デコポン"},{emoji:"🥩",name:"あか牛"},{emoji:"🍘",name:"いきなり団子"}],
  "大分県":[{emoji:"🐔",name:"とり天"},{emoji:"🐟",name:"関あじ"},{emoji:"♨️",name:"地獄蒸し"},{emoji:"🦐",name:"城下かれい"},{emoji:"🍜",name:"だんご汁"}],
  "宮崎県":[{emoji:"🥭",name:"マンゴー"},{emoji:"🐔",name:"チキン南蛮"},{emoji:"🥩",name:"宮崎牛"},{emoji:"🍖",name:"地鶏炭火焼"},{emoji:"🧀",name:"チーズ饅頭"}],
  "鹿児島県":[{emoji:"🍠",name:"さつまいも"},{emoji:"🐷",name:"黒豚"},{emoji:"🍶",name:"芋焼酎"},{emoji:"🥩",name:"鹿児島黒牛"},{emoji:"🍊",name:"たんかん"}],
  "沖縄県":[{emoji:"🍍",name:"パイナップル"},{emoji:"🐷",name:"ラフテー"},{emoji:"🌺",name:"ちんすこう"},{emoji:"🍹",name:"泡盛"},{emoji:"🥭",name:"マンゴー"}]
};

function getStationSpecialty(stationId, pref) {
  const pool = PREF_SPECIALTIES[pref];
  if (!pool || pool.length === 0) return { emoji: "🎁", name: "お土産" };
  return pool[stationId % pool.length];
}

// ===== ジブリ風スタンプ絵 =====
const STAMP_SCENES = {
  "北海道":"🌲🦌","青森県":"🍎🏔️","岩手県":"⛰️🌾","宮城県":"🌊🐄","秋田県":"🌾🏔️",
  "山形県":"🍒⛰️","福島県":"🍑🌸","茨城県":"🌹🌊","栃木県":"🍓⛰️","群馬県":"♨️🏔️",
  "埼玉県":"🌸🏯","千葉県":"🌊🥜","東京都":"🗼🌳","神奈川県":"⛵🌊","新潟県":"🌾🏔️",
  "富山県":"🏔️🌷","石川県":"🌊🎣","福井県":"🦀🌊","山梨県":"🍇🗻","長野県":"🏔️🌲",
  "岐阜県":"🏯🌲","静岡県":"🗻🍵","愛知県":"🌸🏯","三重県":"🦐🌊","滋賀県":"🛶🌿",
  "京都府":"⛩️🍁","大阪府":"🏙️🌉","兵庫県":"🐮🌸","奈良県":"🦌🌸","和歌山県":"🍊🌊",
  "鳥取県":"🏜️🌊","島根県":"⛩️🌿","岡山県":"🍑🌸","広島県":"🍁⛩️","山口県":"🐡🌊",
  "徳島県":"🌀🌊","香川県":"🍜🫒","愛媛県":"🍊🌸","高知県":"🐋🌊","福岡県":"🍜🌸",
  "佐賀県":"🏺🌾","長崎県":"⛪🌊","熊本県":"🌋🐻","大分県":"♨️🌲","宮崎県":"🌴🌺",
  "鹿児島県":"🌋🌺","沖縄県":"🌺🏖️"
};

const STAMP_KEYWORDS = [
  {words:["温泉","湯","spa"],art:"♨️🌫️"},
  {words:["山","峠","高原","岳"],art:"⛰️🌲"},
  {words:["海","浜","港","潮","岬","灯台"],art:"🌊🐚"},
  {words:["川","渓","滝","清流","水"],art:"💧🌿"},
  {words:["湖","池","沼"],art:"🛶🌅"},
  {words:["花","桜","梅","菜の花","ひまわり","ラベンダー"],art:"🌸🌿"},
  {words:["森","林","杉","木"],art:"🌲🍃"},
  {words:["田","里","棚田","農"],art:"🌾🏡"},
  {words:["雪","氷","スキー"],art:"❄️🏔️"},
  {words:["島","諸島"],art:"🏝️🌺"},
  {words:["城","館"],art:"🏯🍁"},
  {words:["風","空","星","月"],art:"🌙✨"},
];

function getStampArt(station){
  for(const kw of STAMP_KEYWORDS){
    if(kw.words.some(w=>station.name.includes(w)||station.location.includes(w))){
      return kw.art;
    }
  }
  return STAMP_SCENES[station.pref]||"🌿🛤️";
}

const REGION_COLORS = {
  "北海道":{key:"hokkaido"},"東北":{key:"tohoku"},"関東":{key:"kanto"},"中部":{key:"chubu"},
  "近畿":{key:"kinki"},"中国":{key:"chugoku"},"四国":{key:"shikoku"},"九州沖縄":{key:"kyushu"}
};
function getRegionKey(pref){ for(const [rn,prefs] of Object.entries(REGIONS)){ if(prefs.includes(pref)) return REGION_COLORS[rn]?.key||null; } return null; }

const CONFETTI_COLORS = ["#E8A735","#C46B8A","#5B8C5A","#4A90B8","#D4734A","#9B5A5A"];
const MILESTONES = [1,10,25,50,75,100,150,200,300,500,750,1000];

const MANUAL_KEY = "michinoeki_manual_progress";
const DISMISS_KEY = "michinoeki_dismissed_new";
const SETTINGS_KEY = "michinoeki_settings";
const RING_CIRCUMFERENCE = 326.7;

// ===== データ =====
function loadManual() { try { return JSON.parse(localStorage.getItem(MANUAL_KEY)||"{}"); } catch { return {}; } }
function saveManual(d) { localStorage.setItem(MANUAL_KEY, JSON.stringify(d)); }
function loadDismissed() { try { return JSON.parse(localStorage.getItem(DISMISS_KEY)||"[]"); } catch { return []; } }
function saveDismissed(a) { localStorage.setItem(DISMISS_KEY, JSON.stringify(a)); }
function loadSettings() { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)||"{}"); } catch { return {}; } }
function saveSettings(s) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }

function getVisitInfo(id) { const m=loadManual(); return m[id] || PROGRESS_DATA[id] || null; }
function setVisited(id, visited, photo) {
  const m=loadManual();
  if(visited){ const d=new Date().toISOString().slice(0,10); const e={visited:true,date:d,note:""}; if(photo)e.photo=photo; else if(m[id]&&m[id].photo)e.photo=m[id].photo; m[id]=e; }
  else { m[id]={visited:false}; }
  saveManual(m);
}

function getLevel(visited) { let lv=LEVELS[0]; for(const l of LEVELS){ if(visited>=l.min) lv=l; } return lv; }

// ===== アフィリエイトリンク =====
function buildAffiliateSection(station){
  const prefShort=station.pref.replace(/[都道府県]$/,"");
  const rakutenId=REVENUE_CONFIG.rakutenAffiliateId;
  const amazonTag=REVENUE_CONFIG.amazonTag;

  const travelQuery=encodeURIComponent(prefShort+" "+station.location);
  const productQuery=encodeURIComponent("道の駅 "+prefShort+" 名産");

  let travelUrl=`https://travel.rakuten.co.jp/search/?f_keyword=${travelQuery}`;
  if(rakutenId) travelUrl+=`&af_id=${rakutenId}`;

  let shopUrl=`https://search.rakuten.co.jp/search/mall/${encodeURIComponent("道の駅 "+prefShort)}/?scid=af_pc_etc&sc2id=af_101_0_0`;
  if(rakutenId) shopUrl+=`&af_id=${rakutenId}`;

  let amazonUrl=`https://www.amazon.co.jp/s?k=${productQuery}`;
  if(amazonTag) amazonUrl+=`&tag=${amazonTag}`;

  return `<div class="sd-section sd-affiliate">`+
    `<div class="sd-section-title">🚗 旅のおともに</div>`+
    `<div class="sd-affiliate-links">`+
      `<a href="${travelUrl}" target="_blank" rel="noopener" class="sd-aff-link sd-aff-hotel">`+
        `<span class="sd-aff-icon">🏨</span>`+
        `<span class="sd-aff-text">`+
          `<span class="sd-aff-title">${prefShort}の宿を探す</span>`+
          `<span class="sd-aff-sub">楽天トラベル</span>`+
        `</span>`+
        `<span class="sd-aff-arrow">›</span>`+
      `</a>`+
      `<a href="${shopUrl}" target="_blank" rel="noopener" class="sd-aff-link sd-aff-shop">`+
        `<span class="sd-aff-icon">🛒</span>`+
        `<span class="sd-aff-text">`+
          `<span class="sd-aff-title">${prefShort}の名産品</span>`+
          `<span class="sd-aff-sub">お取り寄せ</span>`+
        `</span>`+
        `<span class="sd-aff-arrow">›</span>`+
      `</a>`+
    `</div>`+
  `</div>`;
}

function compressAndSavePhoto(stationId, file, callback){
  const reader=new FileReader(), img=new Image();
  reader.onload=ev=>{
    img.onload=()=>{
      const mx=800, sc=Math.min(1, mx/Math.max(img.width,img.height));
      const cv=document.createElement("canvas");
      cv.width=img.width*sc; cv.height=img.height*sc;
      cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);
      const dataUrl=cv.toDataURL("image/jpeg",0.75);
      addPhotoToStation(stationId, dataUrl);
      if(callback) callback();
    };
    img.src=ev.target.result;
  };
  reader.readAsDataURL(file);
}

function calcStats() {
  const total=MICHINOEKI_DATA.length; let visited=0, photoCount=0;
  const prefStats={}; const visitDates=[];
  MICHINOEKI_DATA.forEach(s=>{
    if(!prefStats[s.pref]) prefStats[s.pref]={total:0,visited:0};
    prefStats[s.pref].total++;
    const i=getVisitInfo(s.id);
    if(i&&i.visited){ visited++; prefStats[s.pref].visited++; if(i.date)visitDates.push({date:i.date,name:s.name,pref:s.pref,id:s.id}); if(i.photo)photoCount++; }
  });
  let prefComplete=0;
  Object.values(prefStats).forEach(p=>{ if(p.visited>=p.total&&p.total>0) prefComplete++; });
  visitDates.sort((a,b)=>b.date.localeCompare(a.date));
  return {total,visited,prefStats,prefComplete,photoCount,recentVisits:visitDates.slice(0,10)};
}

// ===== エフェクト =====
function triggerStampAnimation(row) {
  row.classList.add('stamp-flash');
  setTimeout(()=>row.classList.remove('stamp-flash'),800);
}

function triggerConfetti(count) {
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const c=document.createElement('div'); c.className='confetti-container'; document.body.appendChild(c);
  for(let i=0;i<(count||25);i++){
    const p=document.createElement('div'); p.className='confetti-piece';
    p.style.left=Math.random()*100+'%';
    p.style.backgroundColor=CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)];
    p.style.animationDuration=(2+Math.random()*2)+'s';
    p.style.animationDelay=(Math.random()*0.8)+'s';
    const sc=0.6+Math.random()*0.8;
    p.style.width=(10*sc)+'px'; p.style.height=(14*sc)+'px';
    c.appendChild(p);
  }
  setTimeout(()=>{ if(c.parentNode) c.remove(); },5000);
}

function animateCountUp(el,from,to) {
  if(from===to){ el.textContent=to; return; }
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){ el.textContent=to; return; }
  const start=performance.now(), dur=500, diff=to-from;
  function tick(now){
    const p=Math.min((now-start)/dur,1), eased=1-Math.pow(1-p,3);
    el.textContent=Math.round(from+diff*eased);
    if(p<1) requestAnimationFrame(tick);
    else { el.textContent=to; el.classList.add('count-up-active'); el.addEventListener('animationend',()=>el.classList.remove('count-up-active'),{once:true}); }
  }
  requestAnimationFrame(tick);
}

function triggerSpecialtyPopup(row, stationId, stationName, pref){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const sp=getStationSpecialty(stationId, pref);
  const rk=getRegionKey(pref);
  if(!row.querySelector('.specialty-emoji')){
    const em=document.createElement('span'); em.className='specialty-emoji'; em.textContent=sp.emoji;
    const btn=row.querySelector('.stamp-btn');
    if(btn&&btn.nextSibling) row.insertBefore(em,btn.nextSibling); else row.appendChild(em);
    requestAnimationFrame(()=>em.classList.add('pop-in'));
    em.addEventListener('animationend',()=>{em.classList.remove('pop-in');em.classList.add('shown');},{once:true});
  }
  if(rk){row.classList.add('region-flash-'+rk);setTimeout(()=>row.classList.remove('region-flash-'+rk),900);}
  const old=document.querySelector('.specialty-toast'); if(old)old.remove();
  const t=document.createElement('div'); t.className='specialty-toast';
  if(rk)t.setAttribute('data-region',rk);
  t.innerHTML=`<span class="toast-emoji">${sp.emoji}</span>${stationName}の名物: ${sp.name}！`;
  t.style.cursor="pointer";
  t.addEventListener("click",()=>{ if(t.parentNode)t.remove(); openStationDetail(stationId); });
  document.body.appendChild(t);
  setTimeout(()=>{if(t.parentNode)t.remove();},4000);
}

let _earnedBadges=new Set(), _badgeQueue=[], _badgeShowing=false;
function initBadges(){ const s=calcStats(); BADGES.forEach(b=>{ if(b.check(s.visited,s.total,s.prefComplete,s.photoCount)) _earnedBadges.add(b.id); }); }
function checkNewBadges(){
  const s=calcStats();
  BADGES.forEach(b=>{
    if(b.check(s.visited,s.total,s.prefComplete,s.photoCount)&&!_earnedBadges.has(b.id)){
      _earnedBadges.add(b.id); _badgeQueue.push(b);
    }
  });
  if(!_badgeShowing&&_badgeQueue.length>0) showBadgePopup();
}
function showBadgePopup(){
  if(_badgeQueue.length===0){ _badgeShowing=false; return; }
  _badgeShowing=true; const b=_badgeQueue.shift();
  const o=document.createElement('div'); o.className='badge-popup-overlay';
  o.innerHTML=`<div class="badge-popup"><div class="badge-popup-emoji">${b.emoji}</div><div class="badge-popup-title">🎉 実績解除！</div><div class="badge-popup-desc"><strong>${b.title}</strong><br>${b.desc}</div><button class="badge-popup-close">やったね！</button></div>`;
  document.body.appendChild(o); triggerConfetti(30);
  const close=()=>{ o.style.opacity='0'; o.style.transition='opacity 0.3s'; setTimeout(()=>{ if(o.parentNode)o.remove(); showBadgePopup(); },300); };
  o.querySelector('.badge-popup-close').addEventListener('click',close,{once:true});
  o.addEventListener('click',e=>{ if(e.target===o) close(); });
}

let _completedPrefs=new Set();
function initCompletedPrefs(){ const s=calcStats(); Object.entries(s.prefStats).forEach(([p,d])=>{ if(d.visited>=d.total&&d.total>0) _completedPrefs.add(p); }); }

// ===== 描画 =====
const openPrefs=new Set();
let _prevCount=0;
let currentFilter="all";

function render(){
  const s=calcStats();
  renderHero(s); renderLevelCard(s); renderPremiumNudge(s); renderStampStreak(s); renderHomeRecent(s); renderAlmostComplete(s);
  renderList(s); renderMap(s); renderStats(s); renderStatsMapTeaser(s); renderBadges(s);
  renderAlmostMapHint();
}

function renderStampStreak(stats){
  const el=document.getElementById("stamp-streak-section");
  if(!el) return;

  const dates=stats.recentVisits.map(v=>v.date).filter(Boolean);
  const uniqueDates=[...new Set(dates)].sort().reverse();

  let streak=0;
  if(uniqueDates.length>0){
    const today=new Date().toISOString().slice(0,10);
    const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);
    if(uniqueDates[0]===today||uniqueDates[0]===yesterday){
      streak=1;
      for(let i=1;i<uniqueDates.length;i++){
        const d1=new Date(uniqueDates[i-1]), d2=new Date(uniqueDates[i]);
        if((d1-d2)/(86400000)<=1) streak++; else break;
      }
    }
  }

  const nextMilestone=MILESTONES.find(m=>m>stats.visited)||stats.total;
  const remaining=nextMilestone-stats.visited;

  let html="";

  if(streak>0){
    html+=`<div class="streak-card">`;
    html+=`<div class="streak-flame">🔥</div>`;
    html+=`<div class="streak-info">`;
    html+=`<div class="streak-count">${streak}日連続スタンプ中！</div>`;
    html+=`<div class="streak-msg">${streak>=7?"すごい！1週間連続！":streak>=3?"調子いいですね！":"この調子で続けよう！"}</div>`;
    html+=`</div></div>`;
  }

  if(remaining<=10&&remaining>0){
    html+=`<div class="milestone-nudge">`;
    html+=`<span class="milestone-nudge-icon">🎯</span>`;
    html+=`<span class="milestone-nudge-text">${nextMilestone}駅まで あと<strong>${remaining}スタンプ</strong></span>`;
    html+=`</div>`;
  }

  el.innerHTML=html;
}

function renderHero(s){
  const pct=s.total?Math.round((s.visited/s.total)*1000)/10:0;
  document.getElementById("hero-pct").textContent=pct+"%";
  const offset=RING_CIRCUMFERENCE*(1-pct/100);
  document.getElementById("hero-ring-fill").style.strokeDashoffset=offset;

  const elVisited=document.getElementById("hero-visited");
  const elRemaining=document.getElementById("hero-remaining");
  if(_prevCount!==s.visited) animateCountUp(elVisited,_prevCount,s.visited);
  else elVisited.textContent=s.visited;
  elRemaining.textContent=s.total-s.visited;
  document.getElementById("hero-pref-complete").textContent=s.prefComplete;
  _prevCount=s.visited;
}

function renderLevelCard(s){
  const lv=getLevel(s.visited);
  const next=LEVELS.find(l=>l.min>s.visited);
  const el=document.getElementById("level-card");
  let html=`<div class="level-current">${lv.emoji} ${lv.title}</div>`;
  if(next){
    const prog=Math.round(((s.visited-lv.min)/(next.min-lv.min))*100);
    html+=`<div class="level-next">次のレベルまで あと${next.min-s.visited}駅</div>`;
    html+=`<div class="level-bar"><div class="level-bar-fill" style="width:${prog}%"></div></div>`;
  } else {
    html+=`<div class="level-next">最高レベル到達！</div>`;
  }
  el.innerHTML=html;
}

function renderHomeRecent(s){
  const el=document.getElementById("home-recent");
  if(s.recentVisits.length===0){
    el.innerHTML='<div class="empty-state">まだスタンプがありません。<br>一覧から最初のスタンプを押してみましょう！</div>';
    return;
  }
  el.innerHTML=s.recentVisits.slice(0,5).map(v=>
    `<div class="recent-chip">${PREF_EMOJI[v.pref]||"📍"} ${v.name} <span class="recent-chip-date">${v.date}</span></div>`
  ).join("");
}

function renderAlmostComplete(s){
  const el=document.getElementById("almost-section");
  const almostPrefs=[];
  Object.entries(s.prefStats).forEach(([p,d])=>{ const r=d.total-d.visited; if(r>0&&r<=3) almostPrefs.push({pref:p,remaining:r}); });
  if(almostPrefs.length===0){ el.innerHTML=""; return; }
  el.innerHTML=`<div class="section-header">もうすぐ制覇！</div>` +
    almostPrefs.map(a=>`<div class="almost-chip">🔥 ${PREF_EMOJI[a.pref]||""} ${a.pref} あと${a.remaining}駅</div>`).join("");
}

function renderList(s){
  const q=document.getElementById("search").value.trim();
  const c=document.getElementById("pref-list"); c.innerHTML="";
  const grouped={}; MICHINOEKI_DATA.forEach(st=>{ if(!grouped[st.pref])grouped[st.pref]=[]; grouped[st.pref].push(st); });

  PREF_ORDER.filter(p=>grouped[p]).forEach(pref=>{
    const stations=grouped[pref];
    const filtered=stations.filter(st=>{
      const i=getVisitInfo(st.id), v=!!(i&&i.visited);
      if(currentFilter==="visited"&&!v)return false;
      if(currentFilter==="unvisited"&&v)return false;
      if(q&&!`${st.name} ${st.location} ${st.pref}`.includes(q))return false;
      return true;
    });
    if(filtered.length===0)return;

    const vc=stations.filter(st=>{const i=getVisitInfo(st.id);return i&&i.visited}).length;
    const pct=Math.round((vc/stations.length)*100);
    const isComplete=pct===100;
    const remaining=stations.length-vc;

    const card=document.createElement("div");
    card.className="pref-card"+(isComplete?" pref-complete":"");
    const regionKey=getRegionKey(pref); if(regionKey) card.setAttribute("data-region",regionKey);

    const header=document.createElement("div"); header.className="pref-header";
    const emoji=PREF_EMOJI[pref]||"";
    const completeBadge=isComplete?' <span class="pref-complete-badge">制覇！</span>':"";
    const almostText=(!isComplete&&remaining<=3)?` <span class="pref-almost">あと${remaining}駅！</span>`:"";
    header.innerHTML=`<div class="pref-name"><span class="pref-emoji">${emoji}</span>${pref}${completeBadge}${almostText} <span class="pref-progress-text">${vc}/${stations.length}（${pct}%）</span></div><span class="chevron">▶</span>`;

    const bar=document.createElement("div"); bar.className="pref-bar";
    bar.innerHTML=`<div class="pref-bar-fill" style="width:${pct}%"></div>`;

    const list=document.createElement("div"); list.className="station-list";
    filtered.forEach(st=>{
      const info=getVisitInfo(st.id), isV=!!(info&&info.visited);
      const row=document.createElement("div"); row.className="station-row"+(isV?" visited":"");

      const stampArt=getStampArt(st);
      const stampBtn=document.createElement("button");
      stampBtn.className="stamp-btn"+(isV?" stamped":"");
      stampBtn.setAttribute("aria-label", isV?"スタンプ済み":"スタンプを押す");
      if(isV) stampBtn.setAttribute("data-art", stampArt);

      stampBtn.addEventListener("click",()=>{
        if(isV){
          if(confirm(`「${st.name}」のスタンプを取り消しますか？`)){
            _completedPrefs.delete(st.pref); setVisited(st.id,false); render();
          }
          return;
        }
        const prev=calcStats().visited;
        setVisited(st.id,true);
        stampBtn.classList.add("stamped");
        triggerSpecialtyPopup(row, st.id, st.name, st.pref);
        const ns=calcStats();
        for(const m of MILESTONES){ if(prev<m&&ns.visited>=m){ triggerConfetti(m>=100?40:m>=50?30:20); break; } }
        if(ns.prefStats[st.pref].visited>=ns.prefStats[st.pref].total&&!_completedPrefs.has(st.pref)){
          _completedPrefs.add(st.pref); triggerConfetti(35);
        }
        setTimeout(()=>{ render(); checkNewBadges(); showPremiumToast(st.name,st.pref); },600);
      });

      const infoDiv=document.createElement("div"); infoDiv.className="station-info";
      const nb=st.isNew?'<span class="badge-new">NEW</span>':"";
      const photoCount=isV?((info.photo?1:0)+(info.photos?info.photos.length:0)):0;
      const hasNote=isV&&info.note&&info.note.length>0;
      const notePreview=hasNote?`<div class="visited-note">📝 ${info.note.slice(0,30)}${info.note.length>30?"…":""}</div>`:"";
      const photoPreview=isV&&info.photo?`<img class="station-photo" src="${info.photo}" alt="写真">${photoCount>1?`<span class="photo-count">+${photoCount-1}</span>`:""}`:"";
      infoDiv.innerHTML=`<div class="station-name">${st.name}${nb}</div><div class="station-meta">${st.location}（${st.round} / ${st.date}登録）</div>${isV&&info.date?`<div class="visited-date">📅 ${info.date}</div>`:""}${notePreview}${photoPreview}`;

      const actionsDiv=document.createElement("div");
      actionsDiv.className="station-actions";
      if(isV){
        actionsDiv.innerHTML=
          `<label class="sa-btn sa-camera" title="写真を撮る">`+
            `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`+
            `${photoCount>0?`<span class="sa-badge">${photoCount}</span>`:""}`+
            `<input type="file" accept="image/*" capture="environment" hidden>`+
          `</label>`+
          `<button class="sa-btn sa-diary${hasNote?" has-note":""}" title="日記を書く">`+
            `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`+
          `</button>`;

        const cameraLabel=actionsDiv.querySelector(".sa-camera");
        const cameraInput=actionsDiv.querySelector('input[type="file"]');
        cameraLabel.addEventListener("click",ev=>{
          if(!isPremium()&&photoCount>=1){
            ev.preventDefault();
            showPaywall();
            return;
          }
        });
        cameraInput.addEventListener("change",ev=>{
          const f=ev.target.files[0]; if(!f) return;
          compressAndSavePhoto(st.id, f, ()=>{ render(); });
          cameraInput.value="";
        });

        const diaryBtn=actionsDiv.querySelector(".sa-diary");
        diaryBtn.addEventListener("click",()=>{
          if(!isPremium()){
            showPaywall();
            return;
          }
          openStationDetail(st.id);
        });

        infoDiv.addEventListener("click",e=>{
          if(e.target.closest(".station-actions")) return;
          openStationDetail(st.id);
        });
      }

      row.appendChild(stampBtn); row.appendChild(infoDiv); row.appendChild(actionsDiv); list.appendChild(row);
    });

    if(openPrefs.has(pref)){card.classList.add("open");list.classList.add("open");header.querySelector(".chevron").textContent="▼";}
    header.addEventListener("click",()=>{
      card.classList.toggle("open");list.classList.toggle("open");
      const o=list.classList.contains("open"); header.querySelector(".chevron").textContent=o?"▼":"▶";
      if(o)openPrefs.add(pref);else openPrefs.delete(pref);
    });
    card.appendChild(header);card.appendChild(bar);card.appendChild(list);c.appendChild(card);
  });
}

function renderStats(s){
  const re=document.getElementById("region-stats"); re.innerHTML="";
  Object.entries(REGIONS).forEach(([rn,prefs])=>{
    let rt=0,rv=0; prefs.forEach(p=>{if(s.prefStats[p]){rt+=s.prefStats[p].total;rv+=s.prefStats[p].visited;}});
    const pct=rt?Math.round((rv/rt)*100):0;
    const r=document.createElement("div"); r.className="region-row";
    const rk=REGION_COLORS[rn]?.key; if(rk) r.setAttribute("data-region",rk);
    r.innerHTML=`<div class="region-name">${rn}</div><div class="region-bar-wrap"><div class="region-bar-fill" style="width:${pct}%"></div></div><div class="region-pct">${pct}%</div><div class="region-count">${rv}/${rt}</div>`;
    re.appendChild(r);
  });

  const rv=document.getElementById("recent-visits"); rv.innerHTML="";
  if(s.recentVisits.length===0){ rv.innerHTML='<div class="no-data">まだ訪問記録がありません。最初の道の駅をチェックしてみましょう！</div>'; }
  else { s.recentVisits.forEach(v=>{ const it=document.createElement("div"); it.className="recent-item"; it.innerHTML=`<div class="recent-icon">${PREF_EMOJI[v.pref]||"📍"}</div><div class="recent-info"><div class="recent-name">${v.name}</div><div class="recent-detail">${v.pref}</div></div><div class="recent-date">${v.date}</div>`; rv.appendChild(it); }); }
}

function renderBadges(s){
  const c=document.getElementById("badge-list"); c.innerHTML="";
  BADGES.forEach(b=>{
    let cur,max;
    if(b.type==="pref"){cur=s.prefComplete;max=b.max;} else if(b.type==="photo"){cur=s.photoCount;max=b.max;} else{cur=s.visited;max=b.max||s.total;}
    const earned=b.check(s.visited,s.total,s.prefComplete,s.photoCount);
    const prog=Math.min(cur/max,1);
    const card=document.createElement("div"); card.className="badge-card "+(earned?"earned":"locked");
    card.innerHTML=`<div class="badge-emoji">${earned?b.emoji:"🔒"}</div><div class="badge-title">${b.title}</div><div class="badge-desc">${b.desc}</div><div class="badge-progress"><div class="badge-progress-fill" style="width:${prog*100}%"></div></div><div class="badge-progress-text">${Math.min(cur,max)} / ${max}</div>`;
    c.appendChild(card);
  });
}

// ===== プレミアム =====
function isPremium(){ return localStorage.getItem("michinoeki_premium")==="true"; }
function setPremium(v){ localStorage.setItem("michinoeki_premium", v?"true":"false"); }

// --- ホーム画面訴求: ツァイガルニク効果 + 保有効果 ---
function renderPremiumNudge(stats){
  const el=document.getElementById("home-premium-nudge");
  if(!el) return;
  if(isPremium()){ el.innerHTML=""; return; }

  const pct=stats.total?Math.round((stats.visited/stats.total)*10)/10:0;
  const filledCount=Object.values(stats.prefStats).filter(d=>d.visited>0).length;

  let personalMsg;
  if(stats.visited===0) personalMsg="旅の記録を地図に刻もう";
  else if(filledCount<=5) personalMsg=`${filledCount}県に足跡が。地図に色がつき始めます`;
  else if(stats.prefComplete>0) personalMsg=`${stats.prefComplete}県制覇！地図がゴールドに輝いています`;
  else personalMsg=`${filledCount}県を巡った軌跡を、地図で一望`;

  el.innerHTML=
    `<div class="premium-nudge" id="premium-nudge-card">` +
      `<div class="premium-nudge-top">` +
        `<div class="premium-nudge-map">🗾</div>` +
        `<div class="premium-nudge-text">` +
          `<div class="premium-nudge-title"><span class="crown">👑</span> 全国制覇マップ</div>` +
          `<div class="premium-nudge-sub">${personalMsg}</div>` +
        `</div>` +
      `</div>` +
      `<div class="premium-nudge-features">` +
        `<span class="premium-nudge-feat">🗾 都道府県の塗り分け</span>` +
        `<span class="premium-nudge-feat">📊 タップで詳細表示</span>` +
        `<span class="premium-nudge-feat">✨ 制覇県が輝く演出</span>` +
      `</div>` +
      `<button class="premium-nudge-cta">マップを解放する</button>` +
      `<div class="premium-nudge-social">旅好きユーザーに人気 No.1 の機能</div>` +
    `</div>`;
  document.getElementById("premium-nudge-card").addEventListener("click", showPaywall);
}

// --- もうすぐ制覇に地図ナッジ ---
function renderAlmostMapHint(){
  if(isPremium()) return;
  const el=document.getElementById("almost-section");
  if(!el || !el.innerHTML) return;
  if(el.querySelector(".almost-map-hint")) return;
  const hint=document.createElement("div");
  hint.className="almost-map-hint";
  hint.innerHTML="🗾 マップで残りの駅を確認 →";
  hint.addEventListener("click", showPaywall);
  el.appendChild(hint);
}

// --- 統計タブ訴求: 好奇心ギャップ ---
function renderStatsMapTeaser(stats){
  const el=document.getElementById("stats-premium-nudge");
  if(!el) return;
  if(isPremium()){ el.innerHTML=""; return; }

  const filledCount=Object.values(stats.prefStats).filter(d=>d.visited>0).length;

  el.innerHTML=
    `<div class="stats-map-teaser" id="stats-map-teaser-card">` +
      `<div class="stats-map-teaser-header">` +
        `<div class="stats-map-teaser-title">🗾 地方別マップ分析</div>` +
        `<span class="stats-map-teaser-badge">PRO</span>` +
      `</div>` +
      `<div class="stats-map-preview">` +
        `<div class="stats-map-blur">` +
          `<div class="stats-map-lock">🔒 プレミアムで解放</div>` +
        `</div>` +
      `</div>` +
      `<div class="stats-map-benefits">` +
        `<div class="stats-map-benefit"><span class="stats-map-benefit-icon">🎨</span> ${filledCount}県の訪問状況を色分け表示</div>` +
        `<div class="stats-map-benefit"><span class="stats-map-benefit-icon">🏆</span> 制覇した県がゴールドに輝く</div>` +
        `<div class="stats-map-benefit"><span class="stats-map-benefit-icon">📍</span> 県タップで未訪問の駅を一覧</div>` +
      `</div>` +
    `</div>`;
  document.getElementById("stats-map-teaser-card").addEventListener("click", showPaywall);
}

// --- チェックイン後トースト: ピークエンドの法則 ---
let _toastTimer=null;
function showPremiumToast(stationName, prefName){
  if(isPremium()) return;
  const el=document.getElementById("premium-toast");
  if(!el) return;

  const msgs=[
    `🗾 ${prefName}の地図が更新！ <span class="toast-gold">マップで確認 →</span>`,
    `✨ ${prefName}に新しい足跡！ <span class="toast-gold">地図を見る →</span>`,
    `🎯 ${prefName}の達成率UP！ <span class="toast-gold">マップで確認 →</span>`,
  ];
  el.innerHTML=msgs[Math.floor(Math.random()*msgs.length)];
  el.hidden=false;
  el.onclick=()=>{ el.hidden=true; showPaywall(); };

  if(_toastTimer) clearTimeout(_toastTimer);
  _toastTimer=setTimeout(()=>{ el.hidden=true; },5000);
}

function updatePremiumUI(){
  const gate=document.getElementById("map-premium-gate");
  const unlocked=document.getElementById("map-unlocked");
  const dot=document.getElementById("map-premium-dot");
  const navBadge=document.getElementById("nav-premium-badge");
  const banner=document.getElementById("premium-status-banner");
  const premium=isPremium();

  if(gate) gate.style.display=premium?"none":"";
  if(unlocked) unlocked.style.display=premium?"":"none";
  if(dot) dot.style.display=premium?"none":"";
  if(navBadge) navBadge.hidden=!premium;

  if(banner){
    if(premium){
      const s=calcStats();
      const filledCount=Object.values(s.prefStats).filter(d=>d.visited>0).length;
      banner.innerHTML=
        `<div class="premium-banner">` +
          `<div class="premium-banner-icon">👑</div>` +
          `<div class="premium-banner-text">` +
            `<div class="premium-banner-title">道の駅マスター</div>` +
            `<div class="premium-banner-sub">全機能が解放されています</div>` +
          `</div>` +
          `<div class="premium-banner-stats">` +
            `<div class="premium-banner-stat">${filledCount}<span>県</span></div>` +
          `</div>` +
        `</div>`;
    } else {
      banner.innerHTML="";
    }
  }
}

function showPaywall(){ document.getElementById("paywall-modal").hidden=false; }

document.getElementById("premium-gate-cta").addEventListener("click", showPaywall);
document.getElementById("premium-gate-restore").addEventListener("click", showPaywall);

document.querySelectorAll(".price-option").forEach(o=>{
  o.addEventListener("click",()=>{
    document.querySelectorAll(".price-option").forEach(x=>x.classList.remove("selected"));
    o.classList.add("selected");
  });
});
document.getElementById("paywall-cta").addEventListener("click",()=>{
  document.getElementById("paywall-modal").hidden=true;
  handleStripeCheckout();
});

function handleStripeCheckout(){
  if(REVENUE_CONFIG.stripePaymentLink){
    window.location.href=REVENUE_CONFIG.stripePaymentLink;
  } else {
    activatePremium();
  }
}

function activatePremium(){
  setPremium(true);
  updatePremiumUI(); render();
  showPremiumCelebration();
}

// 決済後リダイレクト判定
(function checkPaymentReturn(){
  const params=new URLSearchParams(window.location.search);
  if(params.get("premium")==="activated"){
    setPremium(true);
    window.history.replaceState({}, "", window.location.pathname);
    setTimeout(()=>{ updatePremiumUI(); render(); showPremiumCelebration(); }, 500);
  }
})();

function showPremiumCelebration(){
  triggerConfetti(50);
  const overlay=document.createElement("div");
  overlay.className="premium-celebrate-overlay";
  overlay.innerHTML=
    `<div class="premium-celebrate">` +
      `<div class="premium-celebrate-crown">👑</div>` +
      `<div class="premium-celebrate-title">道の駅マスター<br>へようこそ！</div>` +
      `<div class="premium-celebrate-features">` +
        `<div class="premium-celebrate-feat"><span>🗾</span> 全国制覇マップが解放されました</div>` +
        `<div class="premium-celebrate-feat"><span>🚫</span> 広告なしの快適体験</div>` +
        `<div class="premium-celebrate-feat"><span>📷</span> スタンプ写真が無制限に</div>` +
        `<div class="premium-celebrate-feat"><span>📊</span> 詳細統計ダッシュボード</div>` +
        `<div class="premium-celebrate-feat"><span>☁️</span> クラウド同期</div>` +
        `<div class="premium-celebrate-feat"><span>📝</span> 旅の日記 + 複数写真記録</div>` +
      `</div>` +
      `<button class="premium-celebrate-btn">マップを見に行く</button>` +
    `</div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(()=>overlay.classList.add("show"));

  const close=()=>{
    overlay.classList.remove("show");
    setTimeout(()=>{ if(overlay.parentNode) overlay.remove(); },400);
    document.querySelectorAll(".btab").forEach(x=>x.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(x=>x.classList.remove("active"));
    document.querySelector('.btab[data-tab="map"]').classList.add("active");
    document.getElementById("tab-map").classList.add("active");
  };
  overlay.querySelector(".premium-celebrate-btn").addEventListener("click",close);
  overlay.addEventListener("click",e=>{ if(e.target===overlay) close(); });
}
document.getElementById("paywall-skip").addEventListener("click",()=>{
  document.getElementById("paywall-modal").hidden=true;
});

// ===== タブ =====
document.querySelectorAll(".btab").forEach(t=>{
  t.addEventListener("click",()=>{
    document.querySelectorAll(".btab").forEach(x=>x.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(x=>x.classList.remove("active"));
    t.classList.add("active"); document.getElementById("tab-"+t.dataset.tab).classList.add("active");
  });
});

// ===== 駅詳細 =====
let _detailStationId=null;
const detailModal=document.getElementById("station-detail-modal");
const detailHeader=document.getElementById("station-detail-header");
const detailBody=document.getElementById("station-detail-body");

function openStationDetail(stationId){
  const st=MICHINOEKI_DATA.find(s=>s.id===stationId);
  if(!st) return;
  const info=getVisitInfo(stationId);
  if(!info||!info.visited) return;
  _detailStationId=stationId;

  const emoji=PREF_EMOJI[st.pref]||"📍";
  detailHeader.innerHTML=
    `<div class="sd-emoji">${emoji}</div>`+
    `<div class="sd-info">`+
      `<div class="sd-name">${st.name}</div>`+
      `<div class="sd-meta">${st.pref} ${st.location}</div>`+
    `</div>`+
    `<div class="sd-date">📅 ${info.date||"—"}</div>`;

  const photos=info.photos||[];
  const allPhotos=info.photo?[info.photo,...photos]:[...photos];
  const premium=isPremium();
  const maxFree=1;

  let html=`<div class="sd-section">`;
  html+=`<div class="sd-section-title">📷 写真</div>`;
  html+=`<div class="sd-photos" id="sd-photos">`;
  allPhotos.forEach((p,i)=>{
    html+=`<img class="sd-photo-thumb" src="${p}" data-idx="${i}" alt="写真${i+1}">`;
  });
  if(premium || allPhotos.length < maxFree){
    html+=`<label class="sd-photo-add" id="sd-photo-add-btn"><span>+</span><span class="sd-photo-add-label">追加</span><input type="file" accept="image/*" capture="environment" id="sd-photo-input" hidden></label>`;
  } else {
    html+=`<div class="sd-photo-add locked" id="sd-photo-add-locked"><span>👑</span><span class="sd-photo-add-label">PRO</span></div>`;
  }
  html+=`</div></div>`;

  html+=buildAffiliateSection(st);

  html+=`<div class="sd-section">`;
  html+=`<div class="sd-section-title">📝 旅の日記</div>`;
  if(premium){
    html+=`<textarea class="sd-diary" id="sd-diary" placeholder="この道の駅の思い出を書いてみましょう…">${info.note||""}</textarea>`;
  } else {
    html+=`<div class="sd-diary-lock" id="sd-diary-lock">`;
    html+=`<div class="sd-diary-lock-icon">📝</div>`;
    html+=`<div class="sd-diary-lock-text">`;
    html+=`<div class="sd-diary-lock-title">旅の日記を記録</div>`;
    html+=`<div class="sd-diary-lock-sub">プレミアムで解放 →</div>`;
    html+=`</div></div>`;
  }
  html+=`</div>`;

  detailBody.innerHTML=html;

  document.querySelectorAll(".sd-photo-thumb").forEach(img=>{
    img.addEventListener("click",()=>{
      const ov=document.createElement("div");
      ov.className="sd-photo-full-overlay";
      ov.innerHTML=`<img src="${img.src}">`;
      ov.addEventListener("click",()=>ov.remove());
      document.body.appendChild(ov);
    });
  });

  const photoInput=document.getElementById("sd-photo-input");
  if(photoInput){
    photoInput.addEventListener("change",e=>{
      const f=e.target.files[0]; if(!f) return;
      compressAndSavePhoto(_detailStationId, f, ()=>{
        openStationDetail(_detailStationId);
      });
    });
  }

  const lockedAdd=document.getElementById("sd-photo-add-locked");
  if(lockedAdd) lockedAdd.addEventListener("click", showPaywall);

  const diaryLock=document.getElementById("sd-diary-lock");
  if(diaryLock) diaryLock.addEventListener("click", showPaywall);

  detailModal.hidden=false;
}

function addPhotoToStation(stationId, dataUrl){
  const m=loadManual();
  const entry=m[stationId];
  if(!entry) return;
  if(!entry.photo){
    entry.photo=dataUrl;
  } else {
    if(!entry.photos) entry.photos=[];
    entry.photos.push(dataUrl);
  }
  m[stationId]=entry;
  saveManual(m);
}

function saveStationDetail(){
  if(!_detailStationId) return;
  const m=loadManual();
  const entry=m[_detailStationId];
  if(!entry) return;
  const diaryEl=document.getElementById("sd-diary");
  if(diaryEl) entry.note=diaryEl.value;
  m[_detailStationId]=entry;
  saveManual(m);
  render();
}

document.getElementById("station-detail-save").addEventListener("click",()=>{
  saveStationDetail();
  detailModal.hidden=true;
});
document.getElementById("station-detail-close").addEventListener("click",()=>{
  saveStationDetail();
  detailModal.hidden=true;
});
detailModal.addEventListener("click",e=>{
  if(e.target===detailModal){ saveStationDetail(); detailModal.hidden=true; }
});

// ===== 検索・フィルター =====
document.getElementById("search").addEventListener("input",render);
document.querySelectorAll(".filter-chip").forEach(chip=>{
  chip.addEventListener("click",()=>{
    document.querySelectorAll(".filter-chip").forEach(c=>c.classList.remove("active"));
    chip.classList.add("active");
    currentFilter=chip.dataset.filter;
    render();
  });
});

// ===== スタンプモーダル =====
const stampModal=document.getElementById("stamp-modal"),stampPhotoInput=document.getElementById("stamp-photo"),stampPreview=document.getElementById("stamp-preview"),stampSearch=document.getElementById("stamp-search"),stampResults=document.getElementById("stamp-results"),stampSelected=document.getElementById("stamp-selected"),stampConfirm=document.getElementById("stamp-confirm");
let stampPhotoData=null,stampSelectedId=null;
document.getElementById("open-stamp-btn").addEventListener("click",()=>{resetStampModal();stampModal.hidden=false;});
document.getElementById("stamp-cancel").addEventListener("click",()=>{stampModal.hidden=true;});
function resetStampModal(){stampPhotoData=null;stampSelectedId=null;stampPhotoInput.value="";stampPreview.hidden=true;stampSearch.value="";stampResults.innerHTML="";stampSelected.textContent="";stampConfirm.disabled=true;}
stampPhotoInput.addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const img=new Image(),r=new FileReader();r.onload=ev=>{img.onload=()=>{const mx=400,sc=Math.min(1,mx/img.width),cv=document.createElement("canvas");cv.width=img.width*sc;cv.height=img.height*sc;cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);stampPhotoData=cv.toDataURL("image/jpeg",0.7);stampPreview.src=stampPhotoData;stampPreview.hidden=false;};img.src=ev.target.result;};r.readAsDataURL(f);});
stampSearch.addEventListener("input",()=>{const t=stampSearch.value.trim();stampResults.innerHTML="";if(!t)return;MICHINOEKI_DATA.filter(s=>`${s.name} ${s.pref} ${s.location}`.includes(t)).slice(0,20).forEach(s=>{const d=document.createElement("div");d.textContent=`${PREF_EMOJI[s.pref]||""} ${s.pref} - ${s.name}（${s.location}）`;d.addEventListener("click",()=>{stampSelectedId=s.id;stampSelected.textContent=`選択中: ${s.pref} ${s.name}`;stampResults.innerHTML="";stampSearch.value=`${s.pref} ${s.name}`;stampConfirm.disabled=false;});stampResults.appendChild(d);});});
stampConfirm.addEventListener("click",()=>{if(stampSelectedId===null)return;const st=MICHINOEKI_DATA.find(s=>s.id===stampSelectedId);setVisited(stampSelectedId,true,stampPhotoData);stampModal.hidden=true;render();checkNewBadges();if(st)showPremiumToast(st.name,st.pref);});

// ===== バックアップ =====
document.getElementById("export-btn").addEventListener("click",()=>{const d={manual:loadManual(),dismissed:loadDismissed(),settings:loadSettings(),exportedAt:new Date().toISOString()};const b=new Blob([JSON.stringify(d)],{type:"application/json"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`michinoeki_backup_${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(u);});
const importFile=document.getElementById("import-file");
document.getElementById("import-btn").addEventListener("click",()=>importFile.click());
importFile.addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.manual)saveManual(d.manual);if(d.dismissed)saveDismissed(d.dismissed);if(d.settings)saveSettings(d.settings);render();alert("バックアップを読み込みました！");}catch{alert("読み込みに失敗しました。");}};r.readAsText(f);importFile.value="";});

// ===== 音声 =====
const voiceModal=document.getElementById("voice-modal"),voiceStatus=document.getElementById("voice-status"),voiceRecognized=document.getElementById("voice-recognized"),voiceMatches=document.getElementById("voice-matches"),voiceDoneMsg=document.getElementById("voice-done-msg"),voiceMicBtn=document.getElementById("voice-mic");
let recognition=null,isListening=false;
function initSR(){const S=window.SpeechRecognition||window.webkitSpeechRecognition;if(!S)return null;const r=new S();r.lang="ja-JP";r.continuous=false;r.interimResults=true;r.maxAlternatives=3;return r;}
function norm(s){return s.replace(/[\s　]+/g,"").replace(/[ぁ-ん]/g,c=>String.fromCharCode(c.charCodeAt(0)+0x60)).toLowerCase();}
function score(a,b){const x=norm(a),y=norm(b);if(x===y)return 100;if(y.includes(x)||x.includes(y))return 80;const sh=x.length<y.length?x:y,lo=x.length<y.length?y:x;let m=0,p=0;for(const c of sh){const i=lo.indexOf(c,p);if(i!==-1){m++;p=i+1;}}return Math.round((m/lo.length)*70);}
function findM(t){if(!t.trim())return[];return MICHINOEKI_DATA.map(s=>({station:s,score:Math.max(score(t,s.name),score(t,s.pref+s.name))})).sort((a,b)=>b.score-a.score).filter(r=>r.score>=30).slice(0,8);}
function showM(ms){voiceMatches.innerHTML="";ms.forEach(m=>{const i=getVisitInfo(m.station.id),d=!!(i&&i.visited),it=document.createElement("div");it.className="voice-match-item"+(d?" checked":"");it.innerHTML=`<span class="voice-match-name">${m.station.name}</span><span class="voice-match-pref">${m.station.pref}</span><span class="voice-match-score">${d?"✅ 済":"タップでチェック"}</span>`;if(!d){it.addEventListener("click",()=>{setVisited(m.station.id,true);it.classList.add("checked");it.querySelector(".voice-match-score").textContent="✅ 済";voiceDoneMsg.textContent=`✅ ${m.station.pref} ${m.station.name} をチェック！`;voiceDoneMsg.hidden=false;setTimeout(()=>voiceDoneMsg.hidden=true,3000);render();checkNewBadges();showPremiumToast(m.station.name,m.station.pref);});}voiceMatches.appendChild(it);});}
function startL(){if(!recognition){recognition=initSR();if(!recognition){voiceStatus.textContent="音声認識に対応していません（Chrome推奨）";return;}}recognition.onresult=e=>{let im="",fi="";for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)fi+=t;else im+=t;}const d=fi||im;voiceRecognized.textContent=`「${d}」`;showM(findM(d));};recognition.onend=()=>{isListening=false;voiceMicBtn.textContent="🎤 聴き取り開始";voiceMicBtn.classList.remove("recording");voiceStatus.textContent="もう一度マイクボタンを押してください";voiceStatus.classList.remove("listening");};recognition.onerror=e=>{isListening=false;voiceMicBtn.textContent="🎤 聴き取り開始";voiceMicBtn.classList.remove("recording");voiceStatus.classList.remove("listening");voiceStatus.textContent=e.error==="not-allowed"?"マイクが許可されていません":e.error==="no-speech"?"音声が検出されませんでした":"エラーが発生しました";};recognition.start();isListening=true;voiceMicBtn.textContent="⏹ 聴き取り中...";voiceMicBtn.classList.add("recording");voiceStatus.textContent="🔴 聴いています...道の駅名を読み上げてください";voiceStatus.classList.add("listening");voiceDoneMsg.hidden=true;}
document.getElementById("voice-btn").addEventListener("click",()=>{voiceRecognized.textContent="";voiceMatches.innerHTML="";voiceDoneMsg.hidden=true;voiceStatus.textContent="マイクボタンを押してください";voiceStatus.classList.remove("listening");voiceMicBtn.textContent="🎤 聴き取り開始";voiceMicBtn.classList.remove("recording");voiceModal.hidden=false;});
voiceMicBtn.addEventListener("click",()=>{if(isListening){recognition.stop();isListening=false;}else startL();});
document.getElementById("voice-close").addEventListener("click",()=>{if(recognition)recognition.stop();isListening=false;voiceModal.hidden=true;});

// ===== シェア =====
document.getElementById("share-btn").addEventListener("click",()=>{const s=calcStats(),pct=s.total?Math.round((s.visited/s.total)*10)/10:0,lv=getLevel(s.visited);document.getElementById("share-card").innerHTML=`<h3>${lv.emoji} ${lv.title}</h3><div class="share-number">${s.visited} / ${s.total}</div><div class="share-detail">訪問達成率 ${pct}% ｜ ${s.prefComplete}県制覇</div><div class="share-app">道の駅スタンプ帳</div>`;document.getElementById("share-modal").hidden=false;});
document.getElementById("share-copy").addEventListener("click",()=>{const s=calcStats(),pct=s.total?Math.round((s.visited/s.total)*10)/10:0,lv=getLevel(s.visited);navigator.clipboard.writeText(`${lv.emoji} ${lv.title}\n🚗 道の駅スタンプ帳\n${s.visited}/${s.total}駅（${pct}%）\n${s.prefComplete}県制覇！\n#道の駅 #道の駅スタンプ帳 #道の駅巡り`).then(()=>alert("コピーしました！SNSに貼り付けてシェア！")).catch(()=>alert("コピーに失敗しました"));});
document.getElementById("share-close").addEventListener("click",()=>{document.getElementById("share-modal").hidden=true;});

// ===== マップポップアップ =====
document.getElementById("map-popup-close").addEventListener("click",()=>{document.getElementById("map-popup").hidden=true;});
document.getElementById("map-popup").addEventListener("click",e=>{if(e.target.id==="map-popup")document.getElementById("map-popup").hidden=true;});

// ===== PWA =====
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});

// ===== 初期化 =====
_prevCount=calcStats().visited;
initBadges();
initCompletedPrefs();
updatePremiumUI();
render();
