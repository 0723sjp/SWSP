import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: '위스키소종(Whiskey Flavored Smoked Tea)',
    category: 'Tea',
    price: 11000,
    description: '초콜릿과 바닐라향, 은은한 나무의 훈연향',
    image: '/whiskey_sojong.png'
  },
  {
    id: '2',
    name: '대만 일월담 홍옥(Ruby Black Tea)',
    category: 'Tea',
    price: 10000,
    description: '생기 있는 단맛, 은은한 나무향과 고구마향',
    image: '/ruby_black_tea.png'
  },
  {
    id: '3',
    name: '초리차(Chori Tea)',
    category: 'Tea',
    price: 9000,
    description: '고소한 감칠맛, 은은한 나무향',
    image: 'chori_tea.png'
  },
  {
    id: '4',
    name: '청심우롱(Qingxin Oolong)',
    category: 'Tea',
    price: 9000,
    description: '은은한 우유향, 다채로운 꽃과 과일향',
    image: 'qingxin_oolong.png'
  },
  {
    id: '5',
    name: '호박차(Pumkin Tea)',
    category: 'Tea',
    price: 9000,
    description: '부드럽고 달큰한 호박향, 은은한 감칠맛',
    image: 'pumpkin_tea.png'
  },
  {
    id: '6',
    name: '레몬머틀티(Lemon Myrtle)',
    category: 'Tea',
    price: 9000,
    description: '호주에서 자라는 관목으로 잎에서 레몬향이 나는 허브',
    image: 'lemon_myrtle.png'
  },
  {
    id: '7',
    name: '말차 빙수(Match Shaved Ice)',
    category: 'Dessert',
    price: 16000,
    description: '제주,사천,보성 말차로 만든 진한 말차 빙수',
    image: 'matcha.png'
  },
  {
    id: '8',
    name: '초리차 빙수(Chori Tea Shaved Ice)',
    category: 'Dessert',
    price: 16000,
    description: '담백하고 꼬소한 초리차 빙수',
    image: 'chori.png'
  },
  {
    id: '9',
    name: '깔루아 밀크 빙수(Kahlúa Milk Shaved Ice)',
    category: 'Dessert',
    price: 24000,
    description: '고급스러운 느낌의 깔루아 밀크 칵테일 빙수',
    image: 'kahlua_ice.png'
  },
  {
    id: 'w1',
    name: '초리차 & 탐듀 12년',
    category: 'Chaskey',
    price: 24000,
    description: '쉐리 캐스크의 견과,말린 과일 향과 은은한 스파이스가 초리차의 고소함과 조화를 이루며, 우디한 쌉쌀함이 감칠맛을 더욱 살려줍니다.',
    image: 'chori_tamdue.png'
  },
  {
    id: 'w2',
    name: '호박차 & 달위니 15년',
    category: 'Chaskey',
    price: 23000,
    description: '달위니는 허니, 바닐라,부드러운 몰트 특성이 두드러져서 호박차의 부드러운 단맛과 감칠맛을 살려줍니다. 스파이시하지 않고 포근해 따뜻한 호박차와 부드럽게 어울립니다.',
    image: 'https://images.unsplash.com/photo-1594494024039-661705ea4597?auto=format&fit=crop&q=80&w=800'
  },

  {
    id: 'w3',
    name: '청심우롱 & 발렌타인 17년',
    category: 'Chaskey',
    price: 25000,
    description: '청심우롱의 부드러운 밀크향과 꽃내음이 발렌타인 17년의 꿀과 오크 풍미를 감싸며, 달콤함은 더 둥글어지고, 스파이스는 한층 차분해지며, 여운은 길고 부드럽게 이어집니다.',
    image: 'qingxin_oolong_ballentain17.png'
  },

  {
    id: 'tc1',
    name: '사월의 숲 티 칵테일',
    category: 'Tea Cocktail',
    price: 18000,
    description: '사월의 숲 시그니처 티를 베이스로 한 향긋한 칵테일',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c1',
    name: '클래식 올드 패션드',
    category: 'Cocktail',
    price: 16000,
    description: '버번 위스키와 비터즈의 깊은 풍미',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'bc1',
    name: '위스키 블라인드 코스 (3종)',
    category: 'Blind Course',
    price: 45000,
    description: '정보 없이 오직 감각으로만 즐기는 위스키 탐험',
    image: 'https://images.unsplash.com/photo-1527281473232-9c372ce91c50?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ts1',
    name: '싱글몰트 테이스팅 코스',
    category: 'Tasting Course',
    price: 55000,
    description: '지역별 대표 싱글몰트 위스키 3종 비교 시음',
    image: 'https://images.unsplash.com/photo-1582650859079-ee63913ecb84?auto=format&fit=crop&q=80&w=800'
  },
];
