'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface DharmaWord { text: string; source: string; commentary: string }

const DAILY_WORDS: DharmaWord[] = [
  { text: '천상천하 유아독존 삼계개고 아당안지', source: '석가모니불 탄생게',
    commentary: '아기 부처님이 태어나 일곱 걸음을 걸으며 하신 말씀입니다. "하늘 위 하늘 아래 나 홀로 존귀하다"는 뜻인데, 이는 교만이 아닙니다. 마치 갓 태어난 아기가 세상에서 가장 소중한 존재이듯, 모든 사람 하나하나가 그 자체로 우주에서 가장 존귀한 존재라는 뜻입니다. 길가에 핀 들꽃 한 송이도 대체 불가능한 것처럼, 당신의 존재 자체가 이미 완전합니다. 오늘 하루, 나 자신이 얼마나 소중한 존재인지 한 번 느껴보세요.' },
  { text: '일체유심조 — 모든 것은 오직 마음이 지어낸 것이다', source: '화엄경',
    commentary: '같은 비가 내려도 농부는 기뻐하고 소풍 가는 아이는 슬퍼합니다. 비는 그냥 비일 뿐인데, 마음이 기쁨과 슬픔을 만들어 냅니다. 마치 같은 찰흙으로 꽃병도 만들고 벽돌도 만드는 것처럼, 우리 마음이 세상 모든 경험을 빚어냅니다. 직장에서 받은 한마디 말도 마음먹기에 따라 상처가 되기도 하고 성장의 기회가 되기도 합니다. 오늘 일어나는 일들을 내 마음이 어떻게 해석하고 있는지 한 걸음 물러서서 바라보세요.' },
  { text: '과거심불가득 현재심불가득 미래심불가득', source: '금강경',
    commentary: '물이 흐르는 강을 손으로 움켜쥘 수 없듯, 마음도 잡을 수 없습니다. 어제의 후회에 매여 있으면 이미 흘러간 물을 쥐려는 것이고, 내일 걱정에 사로잡히면 아직 오지 않은 물을 잡으려는 것입니다. 지금 이 순간의 마음도 쉬지 않고 변합니다. 마치 하늘의 구름처럼 떠다니다 사라지는 것이 마음의 본래 모습입니다. 그러니 지나간 일에 끌려다니지 말고, 올 일에 휘둘리지 말고, 지금 이 자리에서 편안히 머무세요.' },
  { text: '색즉시공 공즉시색 수상행식 역부여시', source: '반야심경',
    commentary: '얼음과 물은 다른 것 같지만 본질은 같은 H₂O입니다. 눈에 보이는 형태(색)와 텅 빔(공)은 대립하는 것이 아니라 동전의 양면입니다. 컵이 비어 있어야 물을 담을 수 있고, 방이 비어 있어야 사람이 살 수 있듯, 비어 있음이 곧 가능성입니다. 오늘 마음이 복잡할 때, 그 복잡함 속에도 고요함이 함께 있다는 것을 기억하세요. 파도가 아무리 거세어도 바다 깊은 곳은 고요한 것처럼요.' },
  { text: '네 스스로를 등불로 삼고 네 스스로에 의지하라', source: '대반열반경',
    commentary: '부처님이 돌아가시기 전 마지막으로 하신 말씀입니다. 깜깜한 밤길을 걸을 때 남의 손전등을 빌려 쓸 수는 있지만, 결국 내가 직접 걸어야 합니다. 스승이나 경전은 길을 비춰주는 안내판이지, 대신 걸어주지 않습니다. 마치 자전거를 배울 때 아무리 이론을 들어도 직접 넘어지며 배워야 하듯, 깨달음의 길도 스스로 경험해야 합니다. 오늘 하루, 다른 사람의 판단이 아닌 내 안의 지혜에 귀 기울여 보세요.' },
  { text: '한 송이 꽃이 피니 온 세상에 봄이 온다', source: '선가귀감',
    commentary: '매화 한 송이가 피면 아직 겨울인데도 봄이 왔음을 압니다. 한 사람의 작은 선행이 세상을 바꿀 수 있다는 뜻입니다. 버스에서 자리를 양보하는 한 사람을 보면 주변 사람들의 마음도 따뜻해지는 것처럼, 선한 마음은 전염됩니다. 나 하나쯤이야 하지 말고, 내가 바로 그 첫 번째 매화꽃이 되어 보세요. 당신의 작은 미소 하나가 누군가의 겨울을 끝낼 수 있습니다.' },
  { text: '천 리 길도 한 걸음부터 시작한다', source: '도덕경',
    commentary: '서울에서 부산까지 400km를 걸어간다고 하면 엄두가 나지 않습니다. 하지만 지금 내 앞의 한 걸음만 내딛으면 됩니다. 그 한 걸음이 모여 천 리가 됩니다. 다이어트도, 공부도, 수행도 마찬가지입니다. 오늘 5분 명상이 1년 뒤 큰 변화를 만듭니다. 마치 물방울이 바위를 뚫듯, 작지만 꾸준한 것이 가장 강합니다. 거창한 계획보다 지금 당장 할 수 있는 작은 한 가지를 시작해 보세요.' },
  { text: '물은 낮은 곳으로 흐르되 모든 것을 이롭게 한다', source: '도덕경',
    commentary: '물은 다투지 않습니다. 높은 곳에서 낮은 곳으로 자연스럽게 흐르면서도 만물을 살립니다. 사람들이 피하는 낮은 곳에 머물면서도 불평하지 않습니다. 회사에서 남들이 꺼리는 일을 묵묵히 하는 사람이 결국 가장 신뢰받는 것처럼, 겸손함은 약함이 아니라 가장 큰 힘입니다. 오늘 하루, 이기려 하지 말고 흘러가듯 자연스럽게 살아보세요. 물처럼 부드럽지만 바위도 깎는 힘을 갖게 될 것입니다.' },
  { text: '분별하는 마음을 내려놓으면 걸림이 없다', source: '반야심경',
    commentary: '좋다 나쁘다, 옳다 그르다 — 우리는 하루에도 수천 번 판단합니다. 마치 저울 위에 끊임없이 무엇을 올려놓는 것처럼요. 그 저울을 내려놓으면 어떨까요? 비가 오면 그냥 비가 오는 것이고, 바람이 불면 그냥 바람이 부는 것입니다. 출근길 막히는 도로에서도 "짜증나는 교통체증"이 아니라 그냥 "차들이 서 있는 풍경"으로 바라볼 수 있습니다. 판단을 멈추면 마음이 넓어지고, 걸리는 것이 없어집니다.' },
  { text: '보시는 아무 것도 바라지 않고 베푸는 것이니라', source: '금강경',
    commentary: '아이에게 밥을 먹이면서 보답을 바라는 부모는 없습니다. 그것이 진정한 보시입니다. 하지만 우리는 종종 "내가 이만큼 했으니 저 사람도 이만큼 해야지"라고 생각합니다. 마치 씨앗을 뿌리면서 열매를 미리 세는 것과 같습니다. 진짜 베풂은 던진 돌멩이처럼 — 강물에 빠지면 파문만 남기고 돌은 사라집니다. 오늘 누군가에게 아무 조건 없이 커피 한 잔 건네보세요. 그 가벼움이 진짜 자유입니다.' },
  { text: '원수를 사랑으로 대하면 원수가 사라진다', source: '법구경',
    commentary: '누군가 나에게 화를 내며 돌을 던지면, 돌을 받아서 되던지면 싸움은 끝나지 않습니다. 하지만 그 돌을 내려놓으면 싸움은 나 혼자서라도 끝낼 수 있습니다. 미움은 뜨거운 숯을 손에 쥐고 상대방에게 던지려는 것과 같아서, 던지기 전에 내 손이 먼저 덥니다. 오늘 마음속에 미운 사람이 떠오르면, 그 사람도 나처럼 행복하고 싶어하는 사람이라고 한 번만 생각해 보세요.' },
  { text: '하루하루가 좋은 날이다', source: '운문선사 어록',
    commentary: '비가 와도 좋은 날, 눈이 와도 좋은 날, 아무 일 없어도 좋은 날 — 운문 선사는 매일이 좋은 날이라 했습니다. 이것은 긍정적 사고와 다릅니다. 좋고 나쁨의 판단 자체를 넘어선 것입니다. 마치 거울이 아름다운 것도 못생긴 것도 가리지 않고 비추듯, 오는 것을 있는 그대로 받아들이면 모든 날이 의미 있습니다. 오늘이 힘든 날이더라도, 바로 이 순간 숨 쉬고 있다는 것만으로도 좋은 날입니다.' },
  { text: '중생이 곧 부처요 번뇌가 곧 보리니라', source: '육조단경',
    commentary: '연꽃은 깨끗한 물이 아니라 진흙탕에서 핍니다. 진흙이 없으면 연꽃도 없습니다. 우리의 고통과 번뇌가 바로 그 진흙입니다. 실연의 아픔이 있어야 사랑의 소중함을 알고, 실패가 있어야 성공의 기쁨을 압니다. 지금 겪는 어려움을 없애려 하지 말고, 그 안에서 피어날 연꽃을 상상해 보세요. 당신은 이미 부처이고, 지금의 고통이 깨달음의 양분이 됩니다.' },
  { text: '마음이 고요하면 온 세상이 고요하다', source: '대승기신론',
    commentary: '폭풍우 치는 바다 위의 배는 요동치지만, 바다 깊은 곳은 고요합니다. 우리 마음도 마찬가지입니다. 표면에서는 걱정, 분노, 슬픔의 파도가 일지만, 마음 깊은 곳에는 늘 고요함이 있습니다. 출퇴근 지하철 소음 속에서도 눈을 감고 세 번 깊이 호흡하면 그 고요함을 만날 수 있습니다. 세상을 바꿀 수는 없지만, 내 마음을 고요하게 하면 세상이 달라 보입니다.' },
  { text: '집착하지 않으면 괴로움이 없다', source: '사십이장경',
    commentary: '어린아이가 모래성을 쌓고는 파도가 무너뜨리자 울음을 터뜨립니다. 어른인 우리도 크게 다르지 않습니다. 직위, 재산, 관계 — 모래성처럼 영원하지 않은 것에 집착하며 괴로워합니다. 손을 펴면 바람이 통하고, 꽉 쥐면 손이 아픕니다. 소유하되 집착하지 않는 것, 사랑하되 구속하지 않는 것 — 그것이 자유입니다. 오늘 꽉 쥐고 있는 무엇 하나를 살짝 놓아보세요.' },
  { text: '지금 여기에 온전히 머무는 것이 수행이다', source: '틱낫한 스님',
    commentary: '밥을 먹을 때 밥맛을 모르고, 걸을 때 걸음을 모르고, 대화할 때 상대방 말을 듣지 않는 — 우리는 대부분 "여기"에 있으면서 마음은 "거기"에 가 있습니다. 설거지를 하면서 설거지를 온전히 느끼면 그것이 명상이고, 차를 마시면서 차의 온기를 느끼면 그것이 수행입니다. 특별한 자세나 장소가 필요 없습니다. 지금 이 글을 읽는 이 순간, 당신은 이미 수행 중입니다.' },
  { text: '자비는 세상에서 가장 강한 힘이다', source: '법화경',
    commentary: '태양은 좋은 사람이든 나쁜 사람이든 가리지 않고 비춥니다. 자비도 그렇습니다. 상대방이 자격이 있든 없든, 내가 먼저 따뜻한 마음을 내는 것입니다. 엄마가 아이에게 뛰어가듯 자연스럽고, 강물이 바다로 흐르듯 거침이 없습니다. 자비는 약함이 아니라 용기입니다. 오늘 만나는 모든 사람에게 속으로 "이 사람도 행복하기를"이라고 한 번씩 말해보세요. 마음이 넓어지는 것을 느낄 수 있습니다.' },
  { text: '화를 다스리는 자가 참된 용사이다', source: '법구경',
    commentary: '전쟁터에서 만 명을 이긴 장군보다 자기 마음 하나를 이긴 사람이 더 위대하다고 부처님은 말씀하셨습니다. 화가 치밀어 오를 때 10초만 참으면 뇌의 화학반응이 가라앉는다고 합니다. 마치 뜨거운 국에 바로 입을 대면 데이지만 잠시 식히면 맛있게 먹을 수 있듯, 화도 잠깐 내려놓으면 지혜로운 대응이 가능합니다. 오늘 짜증나는 순간이 오면 숨을 세 번 쉬어보세요. 그것이 용맹정진입니다.' },
  { text: '매순간이 새로운 시작이다', source: '임제록',
    commentary: '어제 실수했다고 오늘도 실수할 것이라는 보장은 없습니다. 매 순간은 이전과 완전히 다른 새로운 순간입니다. 마치 강물이 같은 자리에 흐르는 것 같지만 어제의 물과 오늘의 물은 전혀 다른 물인 것처럼요. 아침에 눈을 뜨면 어제의 나는 이미 지나간 사람이고, 지금의 나는 완전히 새로운 사람입니다. 과거에 묶이지 말고 이 순간을 신선하게 시작하세요.' },
  { text: '감사할 줄 아는 마음이 가장 큰 복이다', source: '지장경',
    commentary: '매일 마시는 물, 매일 쉬는 숨, 매일 걷는 다리 — 이 당연한 것들이 사라진다면 어떨까요? 병원에 입원해 본 사람은 걸을 수 있다는 것 자체에 감사합니다. 감사는 없는 것을 찾는 것이 아니라 이미 있는 것을 발견하는 것입니다. 마치 별은 항상 하늘에 있지만 어두워야 보이듯, 잠시 멈추고 둘러보면 감사할 것들이 밤하늘의 별처럼 무수히 많습니다.' },
  { text: '지혜로운 사람은 말을 아끼고 행동으로 보인다', source: '숫타니파타',
    commentary: '빈 수레가 더 요란하듯, 진짜 실력 있는 사람은 말이 적습니다. 맛있는 빵집은 광고를 하지 않아도 줄이 서고, 좋은 의사는 자랑하지 않아도 환자가 찾아옵니다. 부처님도 깨달음 후 처음에는 아무 말도 하지 않으려 했습니다. 진리는 말로 전달되는 것이 아니라 삶으로 보여주는 것이기 때문입니다. 오늘은 한마디를 줄이고 대신 한 가지를 실천해 보세요.' },
  { text: '어리석은 자는 불행의 원인을 밖에서 찾는다', source: '담마파다',
    commentary: '신발이 불편하면 온 세상에 가죽을 깔 수 없습니다. 대신 내 발에 맞는 신발을 신으면 됩니다. 직장이 힘든 것, 사람이 밉운 것, 세상이 불공평한 것 — 모두 바깥의 문제로 보이지만, 결국 내가 바뀌면 세상이 달라 보입니다. 안경이 더러우면 세상이 흐려 보이듯, 먼저 내 마음의 안경을 닦아보세요.' },
  { text: '탐욕은 한 방울의 소금물과 같다', source: '잡아함경',
    commentary: '목이 마를 때 소금물을 마시면 순간은 해소되는 것 같지만 더 갈증이 납니다. 욕심도 마찬가지입니다. 새 핸드폰을 사면 기쁘지만 금방 더 좋은 것이 나옵니다. 승진을 하면 좋지만 더 높은 자리가 눈에 들어옵니다. 끝이 없습니다. 진정한 만족은 더 많이 가지는 것이 아니라 지금 가진 것으로 충분하다고 느끼는 마음입니다.' },
  { text: '이 또한 지나가리라', source: '아함경',
    commentary: '좋은 일이 왔을 때 교만하지 않고, 나쁜 일이 왔을 때 절망하지 않는 비결이 이 한마디에 있습니다. 여름이 지나면 가을이 오고, 겨울이 지나면 봄이 옵니다. 지금 겪는 힘든 일도, 지금 누리는 좋은 일도 모두 지나갑니다. 이것을 알면 힘들 때 버틸 수 있고, 좋을 때 겸손할 수 있습니다. 강물 위에 떠내려가는 나뭇잎처럼, 흘러가는 대로 놓아보세요.' },
  { text: '미소는 입으로 짓는 기도이다', source: '틱낫한 스님',
    commentary: '기도라고 하면 두 손 모으고 눈 감는 것을 떠올리지만, 가장 쉽고 강력한 기도는 미소입니다. 미소를 지으면 뇌에서 엔도르핀이 나오고, 그 미소를 본 상대방도 무의식적으로 미소를 짓게 됩니다. 전염병처럼 퍼지는 미소는 세상을 조금씩 밝게 만듭니다. 거울 앞에서 억지로라도 미소를 지어보세요. 표정이 감정을 만들고, 그 감정이 하루를 만듭니다.' },
  { text: '걸을 때 한 걸음 한 걸음이 기적이다', source: '틱낫한 스님',
    commentary: '우리는 하루에 수천 걸음을 걷지만 단 한 걸음도 제대로 느끼지 못합니다. 땅을 밟는 발바닥의 감촉, 무릎이 구부러지는 느낌, 공기가 얼굴을 스치는 바람 — 이 모든 것이 기적입니다. 다리를 다쳐 걸을 수 없었던 사람에게 한 걸음은 감격의 눈물입니다. 오늘 퇴근길에 10걸음만 천천히, 발바닥을 느끼며 걸어보세요. 일상이 명상이 됩니다.' },
  { text: '분노를 품는 것은 독약을 마시고 상대가 죽기를 바라는 것과 같다', source: '법구경',
    commentary: '누군가가 밉다고 하루종일 그 사람을 떠올리면 괴로운 건 나 자신입니다. 상대방은 아무것도 모른 채 평화롭게 지내고 있을 수도 있습니다. 분노는 내 속에서 불타는 숯불입니다. 숯불을 꺼내 상대에게 던지기 전에 내 손이 먼저 덥습니다. 그 숯불을 내려놓는 순간, 가장 먼저 자유로워지는 것은 바로 나 자신입니다.' },
  { text: '만남은 인연이요 헤어짐도 인연이니라', source: '유마경',
    commentary: '사람과의 만남을 실처럼 생각해 보세요. 내 인생이라는 천에 누군가의 실이 들어와 아름다운 무늬를 만듭니다. 어떤 실은 끝까지 함께하고, 어떤 실은 중간에 끊어집니다. 하지만 그 실이 있었기에 무늬가 완성됩니다. 이별이 아프더라도 만남 자체가 선물이었습니다. 떠나간 사람을 원망하지 말고, 함께했던 시간에 감사하세요.' },
  { text: '자기 자신을 사랑하지 않는 사람은 남도 사랑할 수 없다', source: '앙굿따라 니까야',
    commentary: '비행기에서 비상시 산소마스크를 내 얼굴에 먼저 쓰라고 합니다. 내가 먼저 숨을 쉬어야 옆사람을 도울 수 있기 때문입니다. 자기 사랑도 마찬가지입니다. 자신을 혹사하면서 남을 돕겠다는 것은 텅 빈 주전자로 차를 따르겠다는 것과 같습니다. 오늘 하루, 자신에게 "수고했어"라고 말해주세요. 그 한마디가 내일 누군가에게 건넬 따뜻함의 원천이 됩니다.' },
  { text: '부지런함은 불멸의 길이요 게으름은 죽음의 길이다', source: '법구경',
    commentary: '물이 흐르면 썩지 않고, 문지도리가 돌아가면 녹슬지 않습니다. 몸과 마음도 마찬가지입니다. 매일 조금씩 걷고, 읽고, 생각하는 사람은 늙어도 청춘이고, 젊어도 아무것도 하지 않는 사람은 이미 늙은 것입니다. 부지런함은 자신을 괴롭히는 것이 아니라 생명의 물을 계속 흘려보내는 것입니다. 오늘 딱 10분만 일찍 일어나 보세요.' },
]

// 연중 일수 계산 (1월1일=0, 12월31일=364/365)
function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24)) - 1
}

// 정오(12시) 기준 리셋: 오늘 12시 전이면 어제 날짜, 12시 이후면 오늘 날짜
function getDharmaIdx(): number {
  const now = new Date()
  const hour = now.getHours()
  let day = getDayOfYear()
  if (hour < 12) day = day - 1
  if (day < 0) day = 364
  return day % DAILY_WORDS.length
}

export default function DharmaPage() {
  const { slug } = useParams<{ slug: string }>()
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    setIdx(getDharmaIdx())
  }, [])

  const word = DAILY_WORDS[idx]

  // 다음 리셋까지 남은 시간
  const now = new Date()
  const nextNoon = new Date(now)
  if (now.getHours() >= 12) nextNoon.setDate(nextNoon.getDate() + 1)
  nextNoon.setHours(12, 0, 0, 0)

  return (
    <div style={{ padding: 'clamp(24px,5vw,40px) 16px 60px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      {/* 장경각 SVG — 경판 책장 + 경전 나오는 애니메이션 */}
      <div style={{ display: 'inline-block', position: 'relative', width: 120, height: 110, marginBottom: 10 }}>
        <svg viewBox="0 0 120 110" style={{ width: '100%' }}>
          <defs>
            <linearGradient id="jgWood" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6b4a2a" />
              <stop offset="50%" stopColor="#5a3a1a" />
              <stop offset="100%" stopColor="#4a2a10" />
            </linearGradient>
            <linearGradient id="jgPlate" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d4c4a0" />
              <stop offset="100%" stopColor="#b8a878" />
            </linearGradient>
          </defs>
          {/* 책장 외곽 */}
          <rect x="8" y="8" width="104" height="88" rx="3" fill="url(#jgWood)" stroke="#3a2210" strokeWidth="1.5" />
          {/* 상단 처마 */}
          <path d="M4 8 L60 2 L116 8" fill="none" stroke="#8a6a40" strokeWidth="2" strokeLinecap="round" />
          <rect x="8" y="6" width="104" height="5" rx="1" fill="#7a5a30" />
          {/* 선반 5단 */}
          {[22, 36, 50, 64, 78].map((y, i) => (
            <g key={i}>
              <rect x="10" y={y} width="100" height="2" rx="0.5" fill="#7a5a30" />
              {/* 경판들 — 세로로 빼곡히 */}
              {Array.from({ length: 12 }).map((_, j) => {
                const px = 14 + j * 8
                const colors = ['#c8b890', '#d0c098', '#baa878', '#c4b488', '#d4c4a0', '#b8a470']
                return (
                  <rect key={j} x={px} y={y - 12} width="5" height="12" rx="0.5"
                    fill={colors[j % colors.length]}
                    stroke="#a09068" strokeWidth="0.3"
                    opacity={0.9} />
                )
              })}
            </g>
          ))}
          {/* 하단 받침 */}
          <rect x="6" y="92" width="108" height="6" rx="2" fill="#5a3a1a" stroke="#3a2210" strokeWidth="0.8" />
          {/* 다리 */}
          <rect x="16" y="96" width="6" height="10" rx="1" fill="#4a2a10" />
          <rect x="98" y="96" width="6" height="10" rx="1" fill="#4a2a10" />
        </svg>
        {/* 경전이 나오는 애니메이션 */}
        <div style={{
          position: 'absolute', top: '25%', left: '50%',
          transform: 'translateX(-50%)',
          animation: 'jg-scroll 4s ease-in-out infinite',
          pointerEvents: 'none',
        }}>
          <svg viewBox="0 0 50 30" width="50" height="30">
            {/* 경전 두루마리 */}
            <rect x="5" y="4" width="40" height="22" rx="2" fill="#f0e8d0" stroke="#c8b890" strokeWidth="0.8" />
            <rect x="5" y="4" width="40" height="4" rx="1" fill="#d4c4a0" />
            <rect x="5" y="22" width="40" height="4" rx="1" fill="#d4c4a0" />
            {/* 경전 텍스트 선 */}
            <line x1="10" y1="11" x2="40" y2="11" stroke="#8a7a58" strokeWidth="0.5" />
            <line x1="10" y1="14" x2="38" y2="14" stroke="#8a7a58" strokeWidth="0.5" />
            <line x1="10" y1="17" x2="35" y2="17" stroke="#8a7a58" strokeWidth="0.5" />
            {/* 卍 */}
            <text x="25" y="16" textAnchor="middle" fill="#c9a84c" fontSize="6" fontWeight="700" opacity="0.5">卍</text>
          </svg>
        </div>
        {/* 빛 효과 */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 60, height: 40, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.15) 0%, transparent 70%)',
          animation: 'jg-light 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      </div>
      <style>{`
        @keyframes jg-scroll {
          0%, 15% { transform: translateX(-50%) translateY(0) scale(0.5); opacity: 0; }
          30% { transform: translateX(-50%) translateY(-15px) scale(0.9); opacity: 1; }
          60% { transform: translateX(-50%) translateY(-25px) scale(1); opacity: 1; }
          80%, 100% { transform: translateX(-50%) translateY(-35px) scale(0.8); opacity: 0; }
        }
        @keyframes jg-light {
          0%, 15% { opacity: 0; }
          30%, 60% { opacity: 1; }
          80%, 100% { opacity: 0; }
        }
      `}</style>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: '#c9a84c', letterSpacing: 3, fontFamily: '"Noto Serif KR",serif', marginBottom: 8 }}>오늘의 부처님 말씀</h2>
      <p style={{ fontSize: 11, color: 'rgba(201,168,76,0.4)', marginBottom: 28 }}>
        {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        <span style={{ marginLeft: 8 }}>· 매일 낮 12시 갱신</span>
      </p>

      {/* 주요 말씀 */}
      <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: 'clamp(24px,5vw,40px)', position: 'relative', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ position: 'absolute', top: 12, left: 20, fontSize: 48, color: 'rgba(201,168,76,0.1)', fontFamily: 'serif', lineHeight: 1 }}>"</div>
        <p style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 700, color: '#f0dfa0', lineHeight: 1.8, letterSpacing: 1, fontFamily: '"Noto Serif KR",serif', margin: '12px 0 16px', wordBreak: 'keep-all' }}>
          {word.text}
        </p>
        <p style={{ fontSize: 13, color: 'rgba(201,168,76,0.6)', fontStyle: 'italic' }}>— {word.source}</p>
      </div>

      {/* 해설 */}
      <div style={{ background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 12, padding: 'clamp(18px,4vw,28px)', textAlign: 'left', marginBottom: 28 }}>
        <p style={{ fontSize: 11, color: 'rgba(201,168,76,0.45)', letterSpacing: 2, marginBottom: 10, textAlign: 'center' }}>오늘의 해설</p>
        <p style={{ fontSize: 'clamp(13px,3vw,15px)', color: 'rgba(240,223,160,0.75)', lineHeight: 2.0, wordBreak: 'keep-all', margin: 0 }}>
          {word.commentary}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => {
          navigator.clipboard.writeText(`${word.text}\n— ${word.source}\n\n${word.commentary}`).then(() => alert('말씀과 해설이 복사되었습니다.'))
        }} style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 13 }}>말씀 복사</button>
        <a href={`/${slug}/cyber`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 24px', fontSize: 13, textDecoration: 'none' }}>☸ 도량으로</a>
      </div>
    </div>
  )
}
