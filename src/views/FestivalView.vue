<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

// 路由参数
const route = useRoute()
const festivalId = computed(() => route.params.id as string)

// 页面加载状态
const isLoading = ref(true)

// 节日数据
const festivalData = ref({
  id: '',
  name: '',
  englishName: '',
  date: '',
  banner: '',
  description: '',
  origin: '',
  customs: [],
  culturalMeaning: '',
  relatedWorks: [],
  customs360: {
    enabled: false,
    images: [],
  },
  historyTimeline: [],
  idioms: [],
  poems: [],
  userShares: [],
})

// 当前标签页
const activeTab = ref('intro')

// 互动展示当前角度
const rotationAngle = ref(0)

// 轮播相关
const currentSlide = ref(0)
const slideInterval = ref(null)

// 古今对比当前显示
const timelineIndex = ref(0)

// 用户分享表单
const shareForm = ref({
  name: '',
  content: '',
  images: [],
  location: '',
})

// 验证表单
const formValid = computed(() => {
  return shareForm.value.name.trim() !== '' && shareForm.value.content.trim() !== ''
})

// 图片上传
const fileInput = ref(null)
const uploadImage = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const files = event.target.files
  if (!files || !files.length) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    // 只允许图片
    if (!file.type.includes('image/')) continue

    const reader = new FileReader()
    reader.onload = (e) => {
      shareForm.value.images.push(e.target.result)
    }
    reader.readAsDataURL(file)
  }
}

// 移除上传的图片
const removeImage = (index) => {
  shareForm.value.images.splice(index, 1)
}

// 轮换360度视图
const rotate = (direction) => {
  if (direction === 'left') {
    rotationAngle.value = (rotationAngle.value - 45) % 360
  } else {
    rotationAngle.value = (rotationAngle.value + 45) % 360
  }
}

// 切换轮播图
const setSlide = (index) => {
  currentSlide.value = index
  // 重置轮播计时器
  resetSlideInterval()
}

// 下一张轮播图
const nextSlide = () => {
  if (!festivalData.value.relatedWorks || festivalData.value.relatedWorks.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % festivalData.value.relatedWorks.length
}

// 上一张轮播图
const prevSlide = () => {
  if (!festivalData.value.relatedWorks || festivalData.value.relatedWorks.length === 0) return
  currentSlide.value =
    (currentSlide.value - 1 + festivalData.value.relatedWorks.length) %
    festivalData.value.relatedWorks.length
}

// 重置轮播计时器
const resetSlideInterval = () => {
  if (slideInterval.value) {
    clearInterval(slideInterval.value)
  }
  slideInterval.value = setInterval(() => {
    nextSlide()
  }, 5000)
}

// 查看时间线下一项
const nextTimelineItem = () => {
  if (festivalData.value.historyTimeline && festivalData.value.historyTimeline.length > 0) {
    timelineIndex.value = (timelineIndex.value + 1) % festivalData.value.historyTimeline.length
  }
}

// 查看时间线上一项
const prevTimelineItem = () => {
  if (festivalData.value.historyTimeline && festivalData.value.historyTimeline.length > 0) {
    timelineIndex.value =
      (timelineIndex.value - 1 + festivalData.value.historyTimeline.length) %
      festivalData.value.historyTimeline.length
  }
}

// 提交用户分享
const submitShare = () => {
  if (!formValid.value) return

  // 模拟提交
  const newShare = {
    id: Date.now().toString(),
    userName: shareForm.value.name,
    content: shareForm.value.content,
    images: [...shareForm.value.images],
    location: shareForm.value.location,
    createTime: new Date().toISOString(),
  }

  festivalData.value.userShares.unshift(newShare)

  // 重置表单
  shareForm.value = {
    name: '',
    content: '',
    images: [],
    location: '',
  }

  // 显示成功消息
  alert('分享成功！')
}

// 获取节日数据
const fetchFestivalData = () => {
  // 这里模拟 API 请求，实际应用中应使用 axios 等库从后端获取数据
  setTimeout(() => {
    // 根据节日 ID 获取不同数据
    const festivals = {
      'spring-festival': {
        id: 'spring-festival',
        name: '春节',
        englishName: 'Spring Festival',
        date: '农历正月初一',
        banner: 'images/festivals/spring-festival-banner.png',
        description:
          '春节，是农历新年，是一年之岁首、传统意义上的年节。春节历史悠久，由上古时代岁首祈年祭祀演变而来。万物本乎天、人本乎祖，祈年祭祀、敬天法祖，报本反始也。春节的起源蕴含着深邃的文化内涵，在传承发展中承载了丰厚的历史文化底蕴。',
        origin:
          '春节起源于殷商时期年头岁尾的祭神祭祖活动。在古代，春节被称为"元旦"，是岁首，也是一年的开始。殷商时期，人们在新旧年交替的时刻举行祭祀仪式祈求丰收、驱逐疫鬼，后来逐渐演变成春节。',
        customs: [
          {
            name: '贴春联',
            description:
              '春联又称对联、对子、桃符等，它以工整、对偶、简洁、精巧的文字描绘时代背景，抒发美好愿望，是中国特有的文学形式。',
          },
          {
            name: '贴福字',
            description:
              '中国民间在春节有贴"福"字的习俗，"福"字指福气、福运，寄托了人们对幸福生活的向往，对美好未来的祈愿。',
          },
          {
            name: '守岁',
            description:
              '守岁是除夕的重要习俗之一，即在旧年最后一天的晚上，家家户户团聚，熬夜迎接新年的到来。',
          },
          {
            name: '吃饺子',
            description: '北方地区有除夕吃饺子的传统，饺子形如元宝，寓意"新年发财、招财进宝"。',
          },
        ],
        culturalMeaning:
          '春节是中华民族最隆重的传统佳节，不仅是中国人情感得以维系和团圆的纽带，更是中华文化得以传承和弘扬的重要载体。它承载着丰富的历史文化内涵，体现了中华民族的精神追求和价值观念。',
        relatedWorks: [
          {
            id: 1,
            title: '《元日》',
            author: '王安石',
            dynasty: '宋',
            content: '爆竹声中一岁除，春风送暖入屠苏。千门万户曈曈日，总把新桃换旧符。',
            coverImage: 'images/works/yuanri.png',
            description: '这首诗生动描绘了宋代元日（春节）的习俗与热闹景象。',
          },
          {
            id: 2,
            title: '《除夜》',
            author: '文征明',
            dynasty: '明',
            content: '千家笑语漏迟迟，忧患潜从物外知。美酒一杯谁与共，衰翁独坐夜阑时。',
            coverImage: 'images/works/chuye.png',
            description: '这首诗表达了作者除夕夜独自一人的孤寂感受。',
          },
          {
            id: 3,
            title: '《钱塘湖春行》',
            author: '白居易',
            dynasty: '唐',
            content: '孤山寺北贾亭西，水面初平云脚低。几处早莺争暖树，谁家新燕啄春泥。',
            coverImage: 'images/works/qiantanghu.png',
            description: '这首诗描绘了早春时节西湖的美景。',
          },
        ],
        customs360: {
          enabled: true,
          images: [
            'images/festivals/spring-festival-360-1.png',
            'images/festivals/spring-festival-360-2.png',
            'images/festivals/spring-festival-360-3.png',
            'images/festivals/spring-festival-360-4.png',
            'images/festivals/spring-festival-360-5.png',
            'images/festivals/spring-festival-360-6.png',
            'images/festivals/spring-festival-360-7.png',
            'images/festivals/spring-festival-360-8.png',
          ],
        },
        historyTimeline: [
          {
            era: '古代',
            year: '公元前2000年左右',
            title: '祭祀仪式起源',
            description: '春节起源于古代的祭神祭祖活动，商朝时已有庆祝新年的活动。',
            image: 'images/festivals/spring-ancient.png',
          },
          {
            era: '汉朝',
            year: '公元前202年-公元220年',
            title: '正式确立为春节',
            description: '汉代，春节被正式确立为重要节日，形成了一系列庆祝习俗。',
            image: 'images/festivals/spring-han.png',
          },
          {
            era: '唐宋时期',
            year: '618年-1279年',
            title: '习俗丰富发展',
            description: '唐宋时期，春节习俗更加丰富，出现了贴春联、放爆竹等传统。',
            image: 'images/festivals/spring-tang.png',
          },
          {
            era: '现代',
            year: '1949年至今',
            title: '春节假期制度化',
            description: '新中国成立后，春节被定为法定假日，庆祝形式更加多样化。',
            image: 'images/festivals/spring-modern.png',
          },
        ],
        idioms: [
          {
            idiom: '春风得意',
            explanation:
              '原指春天里顺着风势行驶的船只，帆随风涨，船行得很快。后比喻时运亨通，心情愉快。源自唐代孟郊《登科后》诗"春风得意马蹄疾，一日看尽长安花"。',
            story:
              '唐朝时，孟郊54岁才考中进士，及第后心情愉快，骑着马在长安城里到处游览，写下了这首诗。',
          },
          {
            idiom: '辞旧迎新',
            explanation: '告别过去的一年，迎接新的一年。形容春节期间的活动和心情。',
            story: '这个成语源于人们对新年的期盼，希望在新的一年里能有新的开始和好的运气。',
          },
          {
            idiom: '爆竹喜庆',
            explanation: '形容过年时燃放爆竹带来的欢乐喜庆气氛。',
            story:
              '相传在古代，年是一种凶猛的怪兽，每到除夕就出来伤害人畜，后来人们发现年怕红色和响声，便在除夕燃放爆竹驱赶年兽。',
          },
        ],
        poems: [
          {
            title: '《元日》',
            author: '王安石',
            content: '爆竹声中一岁除，春风送暖入屠苏。千门万户曈曈日，总把新桃换旧符。',
            translation:
              '在爆竹声中旧的一年已经过去，春风送来温暖人们开始喝屠苏酒。新年第一天的太阳照耀着千家万户，家家户户都把旧的桃符取下换上新的。',
          },
          {
            title: '《除夕》',
            author: '高鼎',
            content: '千家笑语漏迟迟，各门分岁送灯知。合沓烧钱灰满地，萧萧破竹有声时。',
            translation:
              '除夕之夜千家万户欢声笑语，时间过得真慢啊，各家门前分岁酒，相互赠送彩灯表示情谊。到处烧纸钱祭祖，灰烬散落满地，爆竹声声震耳欲聋。',
          },
        ],
        userShares: [
          {
            id: '1',
            userName: '老北京',
            content: '今年春节和家人一起包饺子，其乐融融！这是我们家几十年的传统了。',
            images: ['images/shares/spring-share1.png'],
            location: '北京',
            createTime: '2023-01-22T10:30:00Z',
          },
          {
            id: '2',
            userName: '南方姑娘',
            content: '南方的春节习俗和北方不太一样，我们这边有吃年糕的传统，象征着年年高升。',
            images: ['images/shares/spring-share2.png', 'images/shares/spring-share3.png'],
            location: '广州',
            createTime: '2023-01-21T16:45:00Z',
          },
        ],
      },
      'dragon-boat-festival': {
        id: 'dragon-boat-festival',
        name: '端午节',
        englishName: 'Dragon Boat Festival',
        date: '农历五月初五',
        banner: 'images/festivals/dragon-boat-banner.png',
        description:
          '端午节，为每年农历五月初五，是中国民间的传统节日。端午节起源于中国，最初是古代百越地区崇拜龙图腾的节日，后来逐渐演变成为中国汉族人民纪念爱国诗人屈原的传统节日。',
        origin:
          '端午节的起源有多种说法，最广为流传的是纪念屈原的说法。屈原是中国战国时期楚国的诗人、政治家，他因反对楚国投降秦国，遭到放逐。公元前278年，秦军攻破楚国都城，屈原悲愤交加，于农历五月初五跳汨罗江自尽。当地百姓闻讯后，纷纷划船捞救，并且投下粽子等食物，以免鱼虾伤害屈原的遗体。这便是划龙舟、吃粽子习俗的由来。',
        customs: [
          {
            name: '划龙舟',
            description:
              '划龙舟是端午节最具代表性的活动，起源于古人为寻找屈原的遗体。现在已发展成为一项体育赛事。',
          },
          {
            name: '吃粽子',
            description: '吃粽子是端午节的传统食俗，最初是为了祭祀屈原，后来成为端午节的应景食品。',
          },
          {
            name: '挂艾草',
            description:
              '端午节有在门上挂艾草和菖蒲的习俗，因为这些植物有特殊的香气，可以驱除蚊虫和不洁之物。',
          },
          {
            name: '佩戴香囊',
            description: '端午节有佩戴香囊的传统，香囊中装有香料，可以驱虫避邪，保佑平安健康。',
          },
        ],
        culturalMeaning:
          '端午节不仅是中国重要的传统节日，也是一个展现中华民族爱国情怀的节日。它凝聚了中华民族的集体记忆和文化认同，体现了中国人民尊贤敬德、慎终追远的民族精神。',
        relatedWorks: [
          {
            id: 1,
            title: '《离骚》',
            author: '屈原',
            dynasty: '战国',
            content:
              '帝高阳之苗裔兮，朕皇考曰伯庸。摄提贞于孟陬兮，惟庚寅吾以降。皇览揆余初度兮，肇锡余以嘉名...',
            coverImage: 'images/works/lisao.png',
            description: '《离骚》是屈原最著名的作品，表达了他对楚国的忧思和对理想的追求。',
          },
          {
            id: 2,
            title: '《九歌》',
            author: '屈原',
            dynasty: '战国',
            content: '东皇太一：吉日兮辰良，穆将愉兮上皇；抚长剑兮玉珥，璆锵鸣兮琳琅...',
            coverImage: 'images/works/jiuge.png',
            description: '《九歌》是屈原创作的祭祀诗，融合了楚地的民间歌谣。',
          },
          {
            id: 3,
            title: '《天问》',
            author: '屈原',
            dynasty: '战国',
            content: '遂古之初，谁传道之？上下未形，何由考之？冥昭瞢暗，谁能极之？...',
            coverImage: 'images/works/tianwen.png',
            description: '《天问》以疑问的形式，探索了宇宙和人生的种种奥秘。',
          },
        ],
        customs360: {
          enabled: true,
          images: [
            'images/festivals/dragon-boat-360-1.png',
            'images/festivals/dragon-boat-360-2.png',
            'images/festivals/dragon-boat-360-3.png',
            'images/festivals/dragon-boat-360-4.png',
            'images/festivals/dragon-boat-360-5.png',
            'images/festivals/dragon-boat-360-6.png',
            'images/festivals/dragon-boat-360-7.png',
            'images/festivals/dragon-boat-360-8.png',
          ],
        },
        historyTimeline: [
          {
            era: '战国时期',
            year: '公元前278年',
            title: '屈原投江',
            description: '相传屈原在农历五月初五日跳汨罗江自尽，百姓划船寻找其遗体。',
            image: 'images/festivals/dragon-ancient.png',
          },
          {
            era: '汉代',
            year: '公元前202年-公元220年',
            title: '端午习俗初步形成',
            description: '汉代已有端午节吃粽子、划龙舟的记载，端午习俗初步形成。',
            image: 'images/festivals/dragon-han.png',
          },
          {
            era: '唐宋时期',
            year: '618年-1279年',
            title: '端午成为重要节日',
            description: '唐宋时期，端午节已成为重要节日，相关活动更加丰富多彩。',
            image: 'images/festivals/dragon-tang.png',
          },
          {
            era: '现代',
            year: '2009年至今',
            title: '列入非物质文化遗产',
            description: '2009年，端午节被联合国教科文组织列入人类非物质文化遗产代表作名录。',
            image: 'images/festivals/dragon-modern.png',
          },
        ],
        idioms: [
          {
            idiom: '投汨罗',
            explanation: '比喻为国尽忠而死。源自屈原投汨罗江的故事。',
            story:
              '公元前278年，秦军攻破楚国都城，屈原悲愤交加，于农历五月初五抱石跳汨罗江自尽，以身殉国。',
          },
          {
            idiom: '龙舟竞渡',
            explanation: '端午节的传统活动，起源于楚国人民为寻找屈原的遗体。',
            story: '相传屈原跳江后，楚国百姓竞相划船捞救，形成了划龙舟的传统。',
          },
          {
            idiom: '粽叶飘香',
            explanation: '形容端午节时家家户户包粽子的景象和香味。',
            story:
              '传说人们为了不让鱼虾啃食屈原的遗体，将米团用楝树叶包裹后投入江中，这就是最早的粽子。',
          },
        ],
        poems: [
          {
            title: '《竞渡曲》',
            author: '刘禹锡',
            content: '竞渡深悲千载冤，忠魂一去讵能还。国亡身殒今何有，只留离骚在世间。',
            translation:
              '龙舟竞渡是对千年前屈原冤死的深切悼念，忠诚的灵魂一旦离去怎么能够返还人间。国家灭亡他的身躯也消亡了，如今什么都没有留下，只有《离骚》这部不朽的作品仍然流传于世。',
          },
          {
            title: '《端午》',
            author: '文秀',
            content: '节分端午自谁言，万古传闻为屈原。堪笑楚江空渺渺，不能洗得直臣冤。',
            translation:
              '端午节的由来谁最先说的呢？千百年来大家都说是为了纪念屈原。可笑的是，那广阔的楚江水啊，却不能洗去一位正直大臣的冤屈。',
          },
        ],
        userShares: [
          {
            id: '1',
            userName: '龙舟健儿',
            content: '今年参加了家乡的龙舟比赛，感受到了浓厚的节日氛围和团队协作的力量！',
            images: ['images/shares/dragon-share1.png'],
            location: '湖南',
            createTime: '2023-06-22T09:15:00Z',
          },
          {
            id: '2',
            userName: '粽子达人',
            content: '自己动手包的粽子，有肉粽、蜜枣粽、豆沙粽，全家人都说好吃！',
            images: ['images/shares/dragon-share2.png', 'images/shares/dragon-share3.png'],
            location: '苏州',
            createTime: '2023-06-21T14:30:00Z',
          },
        ],
      },
    }

    if (festivalId.value in festivals) {
      festivalData.value = festivals[festivalId.value]
    } else {
      // 默认显示春节数据
      festivalData.value = festivals['spring-festival']
    }

    isLoading.value = false

    // 初始化轮播计时器
    resetSlideInterval()
  }, 1000)
}

// 组件挂载时获取数据
onMounted(() => {
  fetchFestivalData()
})
</script>
