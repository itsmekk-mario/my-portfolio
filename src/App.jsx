import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const DEFAULT_LANG = 'ko'
const LANG_STORAGE_KEY = 'kown-portfolio-lang-v1'
const POSTS_STORAGE_PREFIX = 'kown-portfolio-posts-v1'

function getPostsStorageKey(lang) {
  return `${POSTS_STORAGE_PREFIX}:${lang}`
}

function getStoredLang() {
  if (typeof window === 'undefined') return DEFAULT_LANG
  const stored = window.localStorage.getItem(LANG_STORAGE_KEY)
  return stored === 'en' || stored === 'ko' ? stored : DEFAULT_LANG
}

function getFallbackPosts(lang) {
  return DEFAULT_POSTS_BY_LANG[lang] ?? DEFAULT_POSTS_BY_LANG[DEFAULT_LANG]
}

function readPostsFromStorage(lang) {
  if (typeof window === 'undefined') return getFallbackPosts(lang)

  const storageKey = getPostsStorageKey(lang)
  const stored = window.localStorage.getItem(storageKey)
  if (!stored) return getFallbackPosts(lang)

  try {
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch {
    // ignore broken local data
  }

  return getFallbackPosts(lang)
}

const DEFAULT_POSTS_BY_LANG = {
  ko: [
    {
      id: 1,
      title: 'Jetson 기반 자율주행 차량 설계',
      date: '2026-04-08',
      tags: ['ROS2', 'Jetson', 'Autonomy'],
      excerpt: '학생 자율주행 프로젝트에서 인지·제어·시스템 통합을 어떻게 설계했는지 정리했습니다.',
      content:
        '이 프로젝트는 “코드를 잘 짜는 일”보다 “시스템을 설계하는 일”에 가까웠습니다. 센싱, 판단 로직, 구동, 인터페이스가 한 덩어리로 안정적으로 동작해야 했기 때문입니다. 전체 구조는 ROS2 노드 기반으로 잡고, Jetson Orin Nano를 연산 플랫폼으로 사용했습니다. 조향·스로틀은 PCA9685로 PWM 제어를 구성했고, OpenCV/YOLO로 인지 파이프라인을 만들었습니다. 가장 큰 교훈은, 믿을 수 있는 움직임은 모델 정확도보다 아키텍처와 인터페이스에서 나온다는 점이었습니다.',
    },
    {
      id: 2,
      title: '왜 저는 항상 시스템부터 생각하는가',
      date: '2026-04-06',
      tags: ['Engineering', 'Systems'],
      excerpt: '소프트웨어를 “전체 시스템의 일부”로 두고 설계할 때 더 강해진다고 믿습니다.',
      content:
        '저는 센싱하고, 판단하고, 움직이는 것을 만드는 데 관심이 있습니다. 그래서 데이터 흐름, 제어 구조, 제약 조건, 신뢰성을 먼저 봅니다. 고립된 기능을 만드는 데서 끝내고 싶지 않습니다. 실제 세계에서 올바르게 동작하는 시스템을 설계하고 싶습니다.',
    },
  ],
  en: [
    {
      id: 1,
      title: 'Designing a Jetson-based Autonomous Vehicle',
      date: '2026-04-08',
      tags: ['ROS2', 'Jetson', 'Autonomy'],
      excerpt:
        'How I approached perception, control, and system integration for a student-built autonomous vehicle.',
      content:
        'This project started as a systems problem, not just a coding problem. I needed sensing, decision logic, actuation, and interface layers to work together. I used ROS2 for the overall structure, Jetson Orin Nano as the compute platform, PCA9685 for steering and throttle control, and OpenCV/YOLO for perception. The most important lesson was that reliable motion comes from architecture and interfaces, not just model accuracy.',
    },
    {
      id: 2,
      title: 'Why I Think in Systems First',
      date: '2026-04-06',
      tags: ['Engineering', 'Systems'],
      excerpt:
        'Software is more useful when it is treated as one part of a larger physical and decision-making system.',
      content:
        'I am interested in building things that sense, decide, and move. That means I care about data flow, control structure, constraints, and reliability. I do not want to write isolated features. I want to design systems that behave correctly in the real world.',
    },
  ],
}

const CONTENT_BY_LANG = {
  ko: {
    locale: 'ko-KR',
    langName: 'KO',
    langToggle: 'EN',
    nav: [
      { id: 'about', label: '소개' },
      { id: 'focus', label: '관심 분야' },
      { id: 'stack', label: '기술 스택' },
      { id: 'projects', label: '프로젝트' },
      { id: 'blog', label: '랩 노트' },
      { id: 'contact', label: '연락' },
    ],
    hero: {
      eyebrow: '대한민국 · AI & Engineering',
      accent: '제 모국어는 엔지니어링입니다.',
      description:
        '센싱하고, 판단하고, 움직이는 시스템을 만듭니다 — 소프트웨어·AI·로보틱스·제어를 실제 엔지니어링 프로젝트로 통합합니다.',
      meta: ['보인고 재학생', 'AI 강사', '학생 개발자', '시스템 중심 빌더'],
      actions: {
        projects: '프로젝트 보기',
        github: 'GitHub',
        blog: '랩 노트',
      },
      status: '엔지니어링 중심 포트폴리오',
      info: [
        { label: '정체성', value: '젊은 엔지니어' },
        { label: '핵심 분야', value: 'AI · Robotics · Aerospace' },
        { label: '방법론', value: '시스템 설계' },
        { label: '접근', value: '감지 → 판단 → 움직임' },
      ],
    },
    about: {
      kicker: '소개',
      title: '엔지니어링 사고, 소프트웨어 실행.',
      body: [
        '저는 대한민국에서 시스템을 먼저 생각하며 소프트웨어, 로보틱스, AI, 제어를 넘나드는 엔지니어링 프로젝트를 만드는 고등학생 개발자입니다.',
        '특히 항공우주공학, 로켓공학, 자율 시스템, 컴퓨터 비전, 임베디드 제어, AI 보조 개발에 관심이 있습니다.',
      ],
    },
    focus: {
      kicker: '엔지니어링 관심',
      title: '제가 만들고 싶은 분야들.',
      cardText: '소프트웨어와 시스템 사고, 그리고 실전 구현으로 공학적 탐구를 이어갑니다.',
      areas: [
        '항공우주공학',
        '로켓공학',
        '로보틱스',
        '자율 시스템',
        '컴퓨터 비전',
        '임베디드 시스템',
        'AI 보조 개발',
        '시스템 설계',
      ],
    },
    stack: {
      kicker: '기술 스택',
      title: '지능형 시스템을 위한 도구들.',
      skills: {
        언어: ['Python', 'C', 'C++', 'Kotlin', 'TypeScript', 'Go'],
        '로보틱스 / 임베디드': ['ROS2', 'Jetson Orin Nano', 'I2C', 'PWM', 'PCA9685', 'Linux'],
        'AI / 비전': ['YOLO', 'TensorRT', 'OpenCV', 'Flask'],
        '도구 / 시스템': ['Git', 'GitHub', 'VS Code', 'Android Studio', 'Fusion 360'],
      },
    },
    projects: {
      kicker: '대표 프로젝트',
      title: 'Jetson 기반 자율주행 플랫폼',
      badge: '대표 빌드',
      githubLink: 'GitHub 보기',
      summary:
        'Jetson Orin Nano 위에서 동작하는 ROS2 기반 자율주행 플랫폼. 단일 데모가 아니라 “엔지니어링 시스템”으로 설계했습니다.',
      highlights: [
        {
          label: '문제',
          text:
            '인지, 의사결정 로직, 구동이 하나의 통합 시스템으로 실시간 동작하는 로보틱스 플랫폼을 만드는 것.',
        },
        {
          label: '아키텍처',
          text:
            'ROS2 노드 구조, Flask 제어 인터페이스, PCA9685 모터/서보 제어, CSI 카메라 파이프라인, YOLO 탐지, 스테레오 깊이 추정.',
        },
        {
          label: '결과',
          text:
            '화려한 데모보다 통합·제어 흐름·엔지니어링 동작을 우선한 AI 중심 자율주행 프로토타입.',
        },
      ],
    },
    blog: {
      kicker: '랩 노트',
      title: '가벼운 블로그처럼 글을 작성·수정·삭제해보세요.',
      manage: '글 관리',
      closeEditor: '에디터 닫기',
      export: 'JSON 내보내기',
      noteStrong: '동작 방식:',
      note:
        '게시글은 localStorage로 이 브라우저에 저장됩니다. 백엔드 없이도 작성·수정·삭제할 수 있지만, 변경 사항은 이 브라우저에만 남습니다(코드로 배포하기 전까지).',
      postsHeading: '게시글',
      postKicker: '게시글',
      actions: { edit: '수정', delete: '삭제' },
      editor: {
        editTitle: '게시글 수정',
        newTitle: '새 게시글',
        reset: '초기화',
        labels: {
          title: '제목',
          date: '날짜',
          tags: '태그',
          excerpt: '요약',
          content: '본문',
        },
        placeholders: {
          title: '게시글 제목',
          tags: 'ROS2, Vision, Engineering',
          excerpt: '짧은 요약',
          content: '여기에 글을 작성하세요',
        },
        publish: '로컬 게시글 발행',
        update: '게시글 업데이트',
      },
    },
    philosophy: {
      kicker: '철학',
      title: '코드는 시스템의 일부일 뿐.',
      quote: '“제 모국어는 엔지니어링입니다.”',
      body:
        '저는 단지 코드를 작성하지 않습니다. 시스템, 인터페이스, 동작, 그리고 “움직임”을 설계합니다. 센싱·제어·지능이 실제 제약 조건 속에서 함께 동작하는 방식을 중요하게 생각합니다.',
    },
    contact: {
      kicker: '연락',
      title: '의미 있는 프로젝트와 기술 협업에 열려 있습니다.',
      githubLabel: 'GitHub',
      githubHint: '리포지토리, 코드, 엔지니어링 빌드',
      emailLabel: '이메일',
      emailHint: '협업/프로젝트 관련 연락',
      futureLabel: '향후 글쓰기',
      futureTitle: '랩 노트 / 블로그',
      futureHint: '지금은 위 에디터로 로컬 노트를 작성하세요',
    },
  },
  en: {
    locale: 'en-CA',
    langName: 'EN',
    langToggle: 'KO',
    nav: [
      { id: 'about', label: 'About' },
      { id: 'focus', label: 'Focus' },
      { id: 'stack', label: 'Stack' },
      { id: 'projects', label: 'Projects' },
      { id: 'blog', label: 'Lab Notes' },
      { id: 'contact', label: 'Contact' },
    ],
    hero: {
      eyebrow: 'Republic of Korea · AI & Engineering',
      accent: 'My first language is engineering.',
      description:
        'I build systems that sense, decide, and move — combining software, AI, robotics, and control into real-world engineering projects.',
      meta: ['Boin High School Student', 'AI Instructor', 'Student Developer', 'Systems-first Builder'],
      actions: { projects: 'View Projects', github: 'GitHub', blog: 'Lab Notes' },
      status: 'Engineering-first portfolio',
      info: [
        { label: 'Identity', value: 'Young Engineer' },
        { label: 'Core Fields', value: 'AI · Robotics · Aerospace' },
        { label: 'Method', value: 'System Design' },
        { label: 'Approach', value: 'Sense → Decide → Move' },
      ],
    },
    about: {
      kicker: 'About',
      title: 'Engineering mindset. Software execution.',
      body: [
        'I am a high school student developer from the Republic of Korea who thinks in systems and builds engineering-driven projects across software, robotics, AI, and control.',
        'I am especially interested in aerospace engineering, rocket engineering, autonomous systems, computer vision, embedded control, and AI-assisted development.',
      ],
    },
    focus: {
      kicker: 'Engineering Focus',
      title: 'Fields I want to build in.',
      cardText:
        'Engineering-driven exploration through software, systems thinking, and real-world implementation.',
      areas: [
        'Aerospace Engineering',
        'Rocket Engineering',
        'Robotics',
        'Autonomous Systems',
        'Computer Vision',
        'Embedded Systems',
        'AI-assisted Development',
        'System Design',
      ],
    },
    stack: {
      kicker: 'Tech Stack',
      title: 'Tools for intelligent systems.',
      skills: {
        Languages: ['Python', 'C', 'C++', 'Kotlin', 'TypeScript', 'Go'],
        'Robotics / Embedded': ['ROS2', 'Jetson Orin Nano', 'I2C', 'PWM', 'PCA9685', 'Linux'],
        'AI / Vision': ['YOLO', 'TensorRT', 'OpenCV', 'Flask'],
        'Tools / System': ['Git', 'GitHub', 'VS Code', 'Android Studio', 'Fusion 360'],
      },
    },
    projects: {
      kicker: 'Featured Project',
      title: 'Jetson-based Autonomous Vehicle',
      badge: 'Flagship Build',
      githubLink: 'View GitHub',
      summary:
        'ROS2-based autonomous driving platform built on Jetson Orin Nano, designed as an engineering system rather than just a single demo.',
      highlights: [
        {
          label: 'Problem',
          text:
            'Build a real-time robotics platform where perception, decision logic, and actuation operate as one integrated system.',
        },
        {
          label: 'Architecture',
          text:
            'ROS2 node-based structure, Flask control interface, PCA9685 motor and servo control, CSI camera pipeline, YOLO detection, and stereo depth estimation.',
        },
        {
          label: 'Result',
          text:
            'An AI-first autonomous driving prototype that emphasizes integration, control flow, and engineering behavior over flashy demos.',
        },
      ],
    },
    blog: {
      kicker: 'Lab Notes',
      title: 'Write, edit, and remove posts like a lightweight blog.',
      manage: 'Manage Posts',
      closeEditor: 'Close Editor',
      export: 'Export JSON',
      noteStrong: 'How this works:',
      note:
        'Posts are saved in this browser using localStorage. That means you can write, edit, and delete posts here without a backend, but the changes are local to your browser unless you later publish them from code.',
      postsHeading: 'Posts',
      postKicker: 'Post',
      actions: { edit: 'Edit', delete: 'Delete' },
      editor: {
        editTitle: 'Edit Post',
        newTitle: 'New Post',
        reset: 'Reset',
        labels: { title: 'Title', date: 'Date', tags: 'Tags', excerpt: 'Excerpt', content: 'Content' },
        placeholders: {
          title: 'Post title',
          tags: 'ROS2, Vision, Engineering',
          excerpt: 'Short summary',
          content: 'Write your post here',
        },
        publish: 'Publish Local Post',
        update: 'Update Post',
      },
    },
    philosophy: {
      kicker: 'Philosophy',
      title: 'Code is only part of the system.',
      quote: '“My first language is engineering.”',
      body:
        'I do not just write code. I design systems, interfaces, behavior, and motion. I care about how sensing, control, and intelligence work together under real-world constraints.',
    },
    contact: {
      kicker: 'Contact',
      title: 'Open to meaningful projects and technical collaboration.',
      githubLabel: 'GitHub',
      githubHint: 'Repositories, code, engineering builds',
      emailLabel: 'Email',
      emailHint: 'Contact for collaboration or projects',
      futureLabel: 'Future Writing',
      futureTitle: 'Lab Notes / Blog',
      futureHint: 'Use the editor above for local notes now',
    },
  },
}

function formatDate(value, locale) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString(locale || 'en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return value
  }
}

function App() {
  const headerRef = useRef(null)
  const navRef = useRef(null)
  const navLinkRefs = useRef({})

  const [lang, setLang] = useState(getStoredLang)

  const copy = useMemo(() => {
    return CONTENT_BY_LANG[lang] ?? CONTENT_BY_LANG[DEFAULT_LANG]
  }, [lang])

  const [posts, setPosts] = useState(() => {
    return readPostsFromStorage(getStoredLang())
  })

  const [selectedPostId, setSelectedPostId] = useState(() => {
    const initialLang = getStoredLang()
    const initialPosts = readPostsFromStorage(initialLang)
    return initialPosts[0]?.id ?? null
  })
  const [activeNavId, setActiveNavId] = useState(null)
  const [navIndicator, setNavIndicator] = useState({ left: 0, width: 0, visible: false })
  const [adminOpen, setAdminOpen] = useState(false)
  const [form, setForm] = useState({
    id: null,
    title: '',
    date: '2026-04-08',
    tags: '',
    excerpt: '',
    content: '',
  })

  useEffect(() => {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang)
  }, [lang])

  useEffect(() => {
    window.localStorage.setItem(getPostsStorageKey(lang), JSON.stringify(posts))
  }, [lang, posts])

  const selectedPost = useMemo(() => {
    return posts.find((post) => post.id === selectedPostId) ?? posts[0] ?? null
  }, [posts, selectedPostId])

  const skills = copy.stack.skills
  const focusAreas = copy.focus.areas
  const projectHighlights = copy.projects.highlights

  const toggleLang = useCallback(() => {
    setLang((current) => {
      const next = current === 'ko' ? 'en' : 'ko'
      const nextPosts = readPostsFromStorage(next)
      setPosts(nextPosts)
      setSelectedPostId(nextPosts[0]?.id ?? null)
      return next
    })
  }, [])

  useEffect(() => {
    const navIds = (copy.nav || []).map((item) => item.id)
    const sections = navIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!sections.length) return

    const headerEl = headerRef.current
    let topOffset = 0

    if (headerEl) {
      const headerStyle = window.getComputedStyle(headerEl)
      const headerPosition = headerStyle.position
      if (headerPosition === 'sticky' || headerPosition === 'fixed') {
        topOffset = headerEl.getBoundingClientRect().height + 12
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const candidates = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        const next = candidates[0]?.target?.id ?? null
        if (next && navIds.includes(next)) setActiveNavId(next)
      },
      {
        root: null,
        threshold: [0.15, 0.35, 0.55, 0.75],
        rootMargin: `-${topOffset}px 0px -65% 0px`,
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [copy.nav])

  const updateNavIndicator = useCallback(() => {
    const navEl = navRef.current
    const linkEl = activeNavId ? navLinkRefs.current[activeNavId] : null

    if (!navEl || !linkEl) {
      setNavIndicator((current) => (current.visible ? { ...current, visible: false } : current))
      return
    }

    const navBox = navEl.getBoundingClientRect()
    const linkBox = linkEl.getBoundingClientRect()
    const left = Math.max(0, linkBox.left - navBox.left)
    const width = Math.max(8, linkBox.width)

    setNavIndicator({ left, width, visible: true })
  }, [activeNavId])

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => updateNavIndicator())
    return () => window.cancelAnimationFrame(raf)
  }, [updateNavIndicator, lang])

  useEffect(() => {
    function handleResize() {
      updateNavIndicator()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateNavIndicator])

  const scrollToSection = useCallback((id) => {
    const target = document.getElementById(id)
    if (!target) return

    const headerEl = headerRef.current
    let offset = 0

    if (headerEl) {
      const headerStyle = window.getComputedStyle(headerEl)
      const headerPosition = headerStyle.position
      if (headerPosition === 'sticky' || headerPosition === 'fixed') {
        offset = headerEl.getBoundingClientRect().height + 8
      }
    }

    const top = target.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }, [])

  const handleSectionLinkClick = useCallback(
    (event, id) => {
      event.preventDefault()
      scrollToSection(id)

      const nextHash = `#${id}`
      if (window.location.hash === nextHash) {
        window.history.replaceState(null, '', nextHash)
      } else {
        window.history.pushState(null, '', nextHash)
      }
    },
    [scrollToSection],
  )

  function resetForm() {
    setForm({
      id: null,
      title: '',
      date: '2026-04-08',
      tags: '',
      excerpt: '',
      content: '',
    })
  }

  function handleSavePost(event) {
    event.preventDefault()

    const nextPost = {
      id: form.id ?? Date.now(),
      title: form.title.trim(),
      date: form.date,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
    }

    if (!nextPost.title || !nextPost.excerpt || !nextPost.content) return

    setPosts((current) => {
      const exists = current.some((post) => post.id === nextPost.id)
      const updated = exists
        ? current.map((post) => (post.id === nextPost.id ? nextPost : post))
        : [nextPost, ...current]

      return [...updated].sort((a, b) => new Date(b.date) - new Date(a.date))
    })

    setSelectedPostId(nextPost.id)
    resetForm()
  }

  function handleEditPost(post) {
    setAdminOpen(true)
    setForm({
      id: post.id,
      title: post.title,
      date: post.date,
      tags: post.tags.join(', '),
      excerpt: post.excerpt,
      content: post.content,
    })
  }

  function handleDeletePost(id) {
    const filtered = posts.filter((post) => post.id !== id)
    const fallback = DEFAULT_POSTS_BY_LANG[lang] ?? DEFAULT_POSTS_BY_LANG[DEFAULT_LANG]
    setPosts(filtered.length ? filtered : fallback)
    if (selectedPostId === id) {
      setSelectedPostId((filtered[0] ?? fallback[0]).id)
    }
    if (form.id === id) resetForm()
  }

  function handleExportPosts() {
    const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'kown-posts.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-shell">
      <div className="bg-grid" />
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <header className="header" ref={headerRef}>
        <a className="brand" href="#home" aria-label="Home" onClick={(event) => handleSectionLinkClick(event, 'home')}>
          kown
        </a>

        <div className="header-right">
          <nav className="nav" aria-label="Primary" ref={navRef}>
            {copy.nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={activeNavId === item.id ? 'active' : undefined}
                ref={(node) => {
                  if (node) navLinkRefs.current[item.id] = node
                }}
                onClick={(event) => handleSectionLinkClick(event, item.id)}
              >
                {item.label}
              </a>
            ))}
            <span
              className="nav-indicator"
              style={{
                width: `${navIndicator.width}px`,
                transform: `translateX(${navIndicator.left}px)`,
                opacity: navIndicator.visible ? 1 : 0,
              }}
              aria-hidden="true"
            />
          </nav>

          <button className="lang-toggle" type="button" onClick={toggleLang} aria-label="Toggle language">
            {copy.langToggle}
          </button>
        </div>
      </header>

      <main className="app">
        <section id="home" className="hero section">
          <div className="hero-copy">
            <div className="eyebrow">{copy.hero.eyebrow}</div>
            <h1>
              kown
              <span className="hero-accent">{copy.hero.accent}</span>
            </h1>

            <p className="hero-description">{copy.hero.description}</p>

            <div className="hero-meta">
              {copy.hero.meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="hero-actions">
              <a
                className="btn btn-primary"
                href="#projects"
                onClick={(event) => handleSectionLinkClick(event, 'projects')}
              >
                {copy.hero.actions.projects}
              </a>
              <a
                className="btn btn-secondary"
                href="https://github.com/itsmekk-mario"
                target="_blank"
                rel="noreferrer"
              >
                {copy.hero.actions.github}
              </a>
              <a className="btn btn-ghost" href="#blog" onClick={(event) => handleSectionLinkClick(event, 'blog')}>
                {copy.hero.actions.blog}
              </a>
            </div>
          </div>

          <aside className="hero-panel card glass">
            <div className="status-line">
              <span className="status-dot" />
              {copy.hero.status}
            </div>

            <div className="info-grid">
              {copy.hero.info.map((item) => (
                <div className="info-item" key={item.label}>
                  <p className="info-label">{item.label}</p>
                  <h3>{item.value}</h3>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section id="about" className="section two-col-section">
          <div className="section-heading">
            <p className="section-kicker">{copy.about.kicker}</p>
            <h2>{copy.about.title}</h2>
          </div>

          <div className="card about-card">
            {copy.about.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section id="focus" className="section">
          <div className="section-heading">
            <p className="section-kicker">{copy.focus.kicker}</p>
            <h2>{copy.focus.title}</h2>
          </div>

          <div className="focus-grid">
            {focusAreas.map((item) => (
              <article className="card focus-card" key={item}>
                <h3>{item}</h3>
                <p>{copy.focus.cardText}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="stack" className="section">
          <div className="section-heading">
            <p className="section-kicker">{copy.stack.kicker}</p>
            <h2>{copy.stack.title}</h2>
          </div>

          <div className="skills-grid">
            {Object.entries(skills).map(([category, items]) => (
              <article className="card skill-card" key={category}>
                <h3>{category}</h3>
                <div className="chip-wrap">
                  {items.map((item) => (
                    <span className="chip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="section">
          <div className="section-heading">
            <p className="section-kicker">{copy.projects.kicker}</p>
            <h2>{copy.projects.title}</h2>
          </div>

          <div className="project-grid">
            <article className="card project-card glass">
              <div className="project-topline">
                <span className="project-badge">{copy.projects.badge}</span>
                <a
                  className="inline-link"
                  href="https://github.com/itsmekk-mario"
                  target="_blank"
                  rel="noreferrer"
                >
                  {copy.projects.githubLink} →
                </a>
              </div>

              <p className="project-summary">{copy.projects.summary}</p>

              <div className="project-detail-grid">
                {projectHighlights.map((item) => (
                  <div className="project-block" key={item.label}>
                    <h4>{item.label}</h4>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="blog" className="section">
          <div className="section-heading section-heading-row">
            <div>
              <p className="section-kicker">{copy.blog.kicker}</p>
              <h2>{copy.blog.title}</h2>
            </div>

            <div className="heading-actions">
              <button className="btn btn-secondary compact" onClick={() => setAdminOpen((value) => !value)}>
                {adminOpen ? copy.blog.closeEditor : copy.blog.manage}
              </button>
              <button className="btn btn-ghost compact" onClick={handleExportPosts}>
                {copy.blog.export}
              </button>
            </div>
          </div>

          <div className="blog-note card subtle-card">
            <strong>{copy.blog.noteStrong}</strong> {copy.blog.note}
          </div>

          <div className="blog-layout">
            <aside className="blog-list card">
              <div className="blog-list-head">
                <h3>{copy.blog.postsHeading}</h3>
                <span>{posts.length}</span>
              </div>

              <div className="post-list-items">
                {posts.map((post) => (
                  <button
                    key={post.id}
                    className={`post-item ${selectedPost?.id === post.id ? 'active' : ''}`}
                    onClick={() => setSelectedPostId(post.id)}
                  >
                    <div className="post-item-top">
                      <strong>{post.title}</strong>
                      <small>{formatDate(post.date, copy.locale)}</small>
                    </div>
                    <p>{post.excerpt}</p>
                    <div className="post-tags">
                      {post.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <article className="blog-view card glass">
              {selectedPost && (
                <>
                  <div className="post-view-top">
                    <div>
                      <p className="section-kicker">{copy.blog.postKicker}</p>
                      <h3>{selectedPost.title}</h3>
                    </div>
                    <div className="post-view-actions">
                      <button className="mini-btn" onClick={() => handleEditPost(selectedPost)}>
                        {copy.blog.actions.edit}
                      </button>
                      <button className="mini-btn danger" onClick={() => handleDeletePost(selectedPost.id)}>
                        {copy.blog.actions.delete}
                      </button>
                    </div>
                  </div>

                  <div className="post-meta-line">
                    <span>{formatDate(selectedPost.date, copy.locale)}</span>
                    <div className="post-tags large">
                      {selectedPost.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <p className="post-excerpt">{selectedPost.excerpt}</p>
                  <div className="post-content">{selectedPost.content}</div>
                </>
              )}
            </article>
          </div>

          {adminOpen && (
            <section className="editor-panel card">
              <div className="editor-head">
                <h3>{form.id ? copy.blog.editor.editTitle : copy.blog.editor.newTitle}</h3>
                <button className="mini-btn" onClick={resetForm}>
                  {copy.blog.editor.reset}
                </button>
              </div>

              <form className="editor-form" onSubmit={handleSavePost}>
                <label>
                  {copy.blog.editor.labels.title}
                  <input
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    placeholder={copy.blog.editor.placeholders.title}
                  />
                </label>

                <label>
                  {copy.blog.editor.labels.date}
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                  />
                </label>

                <label>
                  {copy.blog.editor.labels.tags}
                  <input
                    value={form.tags}
                    onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                    placeholder={copy.blog.editor.placeholders.tags}
                  />
                </label>

                <label>
                  {copy.blog.editor.labels.excerpt}
                  <textarea
                    rows="3"
                    value={form.excerpt}
                    onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
                    placeholder={copy.blog.editor.placeholders.excerpt}
                  />
                </label>

                <label>
                  {copy.blog.editor.labels.content}
                  <textarea
                    rows="8"
                    value={form.content}
                    onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                    placeholder={copy.blog.editor.placeholders.content}
                  />
                </label>

                <div className="editor-actions">
                  <button className="btn btn-primary compact" type="submit">
                    {form.id ? copy.blog.editor.update : copy.blog.editor.publish}
                  </button>
                </div>
              </form>
            </section>
          )}
        </section>

        <section className="section" id="philosophy">
          <div className="section-heading">
            <p className="section-kicker">{copy.philosophy.kicker}</p>
            <h2>{copy.philosophy.title}</h2>
          </div>

          <div className="card quote-card glass">
            <blockquote>{copy.philosophy.quote}</blockquote>
            <p>{copy.philosophy.body}</p>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="section-heading">
            <p className="section-kicker">{copy.contact.kicker}</p>
            <h2>{copy.contact.title}</h2>
          </div>

          <div className="contact-grid">
            <a
              className="card contact-card"
              href="https://github.com/itsmekk-mario"
              target="_blank"
              rel="noreferrer"
            >
              <p className="contact-label">{copy.contact.githubLabel}</p>
              <h3>itsmekk-mario</h3>
              <span>{copy.contact.githubHint}</span>
            </a>

            <a className="card contact-card" href="mailto:khk090525@gmail.com">
              <p className="contact-label">{copy.contact.emailLabel}</p>
              <h3>khk090525@gmail.com</h3>
              <span>{copy.contact.emailHint}</span>
            </a>

            <div className="card contact-card contact-placeholder">
              <p className="contact-label">{copy.contact.futureLabel}</p>
              <h3>{copy.contact.futureTitle}</h3>
              <span>{copy.contact.futureHint}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
