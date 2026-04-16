import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const DEFAULT_LANG = 'ko'
const LANG_STORAGE_KEY = 'kown-portfolio-lang-v1'

const POSTS_PATH_BY_LANG = {
  ko: 'content/posts.ko.json',
  en: 'content/posts.en.json',
}

function getStoredLang() {
  if (typeof window === 'undefined') return DEFAULT_LANG
  const stored = window.localStorage.getItem(LANG_STORAGE_KEY)
  return stored === 'ko' || stored === 'en' ? stored : DEFAULT_LANG
}

function getPostsUrl(lang) {
  const path = POSTS_PATH_BY_LANG[lang] ?? POSTS_PATH_BY_LANG[DEFAULT_LANG]
  const basePath = import.meta.env.BASE_URL || './'
  return new URL(`${basePath}${path}`, window.location.href).toString()
}

const CONTENT_BY_LANG = {
  ko: {
    locale: 'ko-KR',
    langToggle: 'EN',
    nav: [
      { id: 'about', label: '소개' },
      { id: 'focus', label: '분야' },
      { id: 'stack', label: '기술' },
      { id: 'projects', label: '프로젝트' },
      { id: 'blog', label: '블로그' },
      { id: 'guestbook', label: '방명록' },
      { id: 'contact', label: '연락' },
    ],
    hero: {
      eyebrow: 'Republic of Korea · AI & Engineering',
      accent: '내 첫 번째 언어는 공학입니다.',
      description:
        '소프트웨어, AI, 로보틱스, 제어를 실제 시스템으로 묶어 감지하고 판단하고 움직이는 결과물을 만듭니다.',
      meta: ['보인고 학생', 'AI 강사', '학생 개발자', '시스템 중심 빌더'],
      actions: {
        projects: '프로젝트 보기',
        github: 'GitHub',
        blog: '블로그',
      },
      status: 'Engineering-first portfolio',
      info: [
        { label: '정체성', value: 'Young Engineer' },
        { label: '핵심 분야', value: 'AI · Robotics · Aerospace' },
        { label: '방법론', value: 'System Design' },
        { label: '접근', value: 'Sense · Decide · Move' },
      ],
    },
    about: {
      kicker: '소개',
      title: '공학적 사고로 설계하고, 소프트웨어로 구현합니다.',
      body: [
        '저는 대한민국의 학생 개발자로서 시스템 관점에서 문제를 보고, 소프트웨어와 하드웨어가 함께 동작하는 결과물을 만드는 데 관심이 있습니다.',
        '특히 항공우주공학, 로켓공학, 로보틱스, 자율주행, 컴퓨터 비전, 임베디드 제어, AI 기반 개발에 집중하고 있습니다.',
      ],
    },
    focus: {
      kicker: '관심 분야',
      title: '내가 깊게 만들고 싶은 영역',
      cardText: '소프트웨어와 시스템 사고를 기반으로 실제 동작하는 공학 결과물을 지향합니다.',
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
      title: '지능형 시스템을 만들기 위한 도구들',
      skills: {
        언어: ['Python', 'C', 'C++', 'Kotlin', 'TypeScript', 'Go'],
        '로보틱스 / 임베디드': ['ROS2', 'Jetson Orin Nano', 'I2C', 'PWM', 'PCA9685', 'Linux'],
        'AI / 비전': ['YOLO', 'TensorRT', 'OpenCV', 'Flask'],
        '도구 / 시스템': ['Git', 'GitHub', 'VS Code', 'Android Studio', 'Fusion 360'],
      },
    },
    projects: {
      kicker: '대표 프로젝트',
      title: 'Jetson 기반 자율주행 차량',
      badge: 'Flagship Build',
      githubLink: 'GitHub 보기',
      summary:
        'Jetson Orin Nano 위에서 동작하는 ROS2 기반 자율주행 플랫폼입니다. 단순 데모가 아니라 인지, 제어, 인터페이스를 하나의 공학 시스템으로 설계했습니다.',
      highlights: [
        {
          label: '문제',
          text: '인지, 판단, 구동이 분리되지 않고 실시간으로 연결되는 로보틱스 시스템을 만드는 것.',
        },
        {
          label: '구성',
          text: 'ROS2 노드 구조, Flask 제어 인터페이스, PCA9685 기반 모터 제어, CSI 카메라, YOLO 탐지, 깊이 추정.',
        },
        {
          label: '결과',
          text: '화려한 데모보다 안정적인 동작 흐름과 통합 설계를 우선한 AI 자율주행 프로토타입.',
        },
      ],
    },
    blog: {
      kicker: '블로그',
      title: '리포지토리에서 관리되는 배포형 글 목록입니다.',
      noteStrong: '작성과 배포:',
      note:
        '`public/content/posts.ko.json`과 `public/content/posts.en.json`을 수정한 뒤 커밋하면 GitHub Pages에 자동 반영됩니다.',
      postsHeading: '게시글',
      postKicker: '포스트',
    },
    guestbook: {
      kicker: '방명록',
      title: '방문 기록을 남겨 주세요.',
      note: 'GitHub 계정으로 댓글을 남길 수 있습니다.',
    },
    philosophy: {
      kicker: '철학',
      title: '코드는 시스템의 일부일 뿐입니다.',
      quote: '내 첫 번째 언어는 공학입니다.',
      body:
        '저는 단순히 기능을 추가하는 것보다 sensing, control, interface, behavior가 실제 제약 조건 아래에서 함께 동작하는 구조를 더 중요하게 봅니다.',
    },
    contact: {
      kicker: '연락',
      title: '의미 있는 프로젝트와 기술 협업에 열려 있습니다.',
      githubLabel: 'GitHub',
      githubHint: '리포지토리, 코드, 엔지니어링 빌드',
      emailLabel: 'Email',
      emailHint: '협업 또는 프로젝트 관련 연락',
      futureLabel: '다음 글',
      futureTitle: '블로그 / 노트',
      futureHint: '리포지토리의 posts JSON을 수정하면 바로 배포됩니다.',
    },
  },
  en: {
    locale: 'en-CA',
    langToggle: 'KO',
    nav: [
      { id: 'about', label: 'About' },
      { id: 'focus', label: 'Focus' },
      { id: 'stack', label: 'Stack' },
      { id: 'projects', label: 'Projects' },
      { id: 'blog', label: 'Lab Notes' },
      { id: 'guestbook', label: 'Guestbook' },
      { id: 'contact', label: 'Contact' },
    ],
    hero: {
      eyebrow: 'Republic of Korea · AI & Engineering',
      accent: 'My first language is engineering.',
      description:
        'I build systems that sense, decide, and move by combining software, AI, robotics, and control into real-world engineering projects.',
      meta: ['Boin High School Student', 'AI Instructor', 'Student Developer', 'Systems-first Builder'],
      actions: {
        projects: 'View Projects',
        github: 'GitHub',
        blog: 'Lab Notes',
      },
      status: 'Engineering-first portfolio',
      info: [
        { label: 'Identity', value: 'Young Engineer' },
        { label: 'Core Fields', value: 'AI · Robotics · Aerospace' },
        { label: 'Method', value: 'System Design' },
        { label: 'Approach', value: 'Sense · Decide · Move' },
      ],
    },
    about: {
      kicker: 'About',
      title: 'Engineering mindset. Software execution.',
      body: [
        'I am a student developer from the Republic of Korea who thinks in systems and builds engineering-driven projects across software, robotics, AI, and control.',
        'My strongest interests are aerospace engineering, rocket engineering, autonomous systems, computer vision, embedded control, and AI-assisted development.',
      ],
    },
    focus: {
      kicker: 'Engineering Focus',
      title: 'Fields I want to build in.',
      cardText:
        'I care about real implementation, system structure, and engineering behavior rather than isolated features.',
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
        'A ROS2-based autonomous driving platform built on Jetson Orin Nano, designed as an engineering system instead of a one-off demo.',
      highlights: [
        {
          label: 'Problem',
          text: 'Build a real-time robotics platform where perception, decision logic, and actuation work as one system.',
        },
        {
          label: 'Architecture',
          text: 'ROS2 nodes, Flask control interface, PCA9685 motor and servo control, CSI camera pipeline, YOLO detection, and depth estimation.',
        },
        {
          label: 'Result',
          text: 'An AI-first autonomous driving prototype focused on integration quality, control flow, and reliable behavior.',
        },
      ],
    },
    blog: {
      kicker: 'Lab Notes',
      title: 'A deploy-ready post list managed in the repository.',
      noteStrong: 'Authoring and deploy:',
      note:
        'Edit `public/content/posts.en.json` and `public/content/posts.ko.json`, then commit and push to publish automatically on GitHub Pages.',
      postsHeading: 'Posts',
      postKicker: 'Post',
    },
    guestbook: {
      kicker: 'Guestbook',
      title: 'Leave a note.',
      note: 'Comments are posted with a GitHub account.',
    },
    philosophy: {
      kicker: 'Philosophy',
      title: 'Code is only part of the system.',
      quote: 'My first language is engineering.',
      body:
        'I do not just write code. I care about how sensing, interfaces, control, and intelligence work together under real-world constraints.',
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
      futureHint: 'Deploy by editing the posts JSON files in the repository.',
    },
  },
}

function formatDate(value, locale) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return value
  }
}

function Utterances({ repo, theme = 'github-dark', issueTerm = 'pathname' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || container.childNodes.length > 0) return

    const script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.async = true
    script.setAttribute('repo', repo)
    script.setAttribute('issue-term', issueTerm)
    script.setAttribute('theme', theme)
    script.setAttribute('crossorigin', 'anonymous')
    container.appendChild(script)
  }, [repo, theme, issueTerm])

  return <div ref={containerRef} className="utterances-frame" />
}

function App() {
  const headerRef = useRef(null)
  const navRef = useRef(null)
  const navLinkRefs = useRef({})

  const [lang, setLang] = useState(getStoredLang)
  const [posts, setPosts] = useState([])
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [activeNavId, setActiveNavId] = useState(null)
  const [navIndicator, setNavIndicator] = useState({ left: 0, width: 0, visible: false })

  const copy = useMemo(() => CONTENT_BY_LANG[lang] ?? CONTENT_BY_LANG[DEFAULT_LANG], [lang])

  useEffect(() => {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang)
  }, [lang])

  useEffect(() => {
    const controller = new AbortController()

    async function loadPosts() {
      try {
        const response = await fetch(getPostsUrl(lang), { signal: controller.signal })
        if (!response.ok) throw new Error(`Failed to load posts: ${response.status}`)
        const data = await response.json()
        if (!Array.isArray(data)) throw new Error('Invalid posts format')

        setPosts(data)
        setSelectedPostId((current) => {
          const existing = data.find((post) => post?.id === current)
          return existing?.id ?? data[0]?.id ?? null
        })
      } catch {
        if (!controller.signal.aborted) {
          setPosts([])
          setSelectedPostId(null)
        }
      }
    }

    void loadPosts()
    return () => controller.abort()
  }, [lang])

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? posts[0] ?? null,
    [posts, selectedPostId],
  )

  const toggleLang = useCallback(() => {
    setLang((current) => (current === 'ko' ? 'en' : 'ko'))
  }, [])

  const scrollToSection = useCallback((id) => {
    const target = document.getElementById(id)
    if (!target) return

    const headerEl = headerRef.current
    let offset = 0

    if (headerEl) {
      const position = window.getComputedStyle(headerEl).position
      if (position === 'sticky' || position === 'fixed') {
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

  useEffect(() => {
    const navIds = copy.nav.map((item) => item.id)
    const sections = navIds.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return

    const headerEl = headerRef.current
    let topOffset = 0

    if (headerEl) {
      const position = window.getComputedStyle(headerEl).position
      if (position === 'sticky' || position === 'fixed') {
        topOffset = headerEl.getBoundingClientRect().height + 12
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const next = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]?.target?.id

        if (next) setActiveNavId(next)
      },
      {
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

    setNavIndicator({
      left: Math.max(0, linkBox.left - navBox.left),
      width: Math.max(8, linkBox.width),
      visible: true,
    })
  }, [activeNavId])

  useEffect(() => {
    const raf = window.requestAnimationFrame(updateNavIndicator)
    return () => window.cancelAnimationFrame(raf)
  }, [updateNavIndicator, lang])

  useEffect(() => {
    window.addEventListener('resize', updateNavIndicator)
    return () => window.removeEventListener('resize', updateNavIndicator)
  }, [updateNavIndicator])

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
              <a className="btn btn-primary" href="#projects" onClick={(event) => handleSectionLinkClick(event, 'projects')}>
                {copy.hero.actions.projects}
              </a>
              <a className="btn btn-secondary" href="https://github.com/itsmekk-mario" target="_blank" rel="noreferrer">
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
            {copy.focus.areas.map((item) => (
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
            {Object.entries(copy.stack.skills).map(([category, items]) => (
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
                <a className="inline-link" href="https://github.com/itsmekk-mario" target="_blank" rel="noreferrer">
                  {copy.projects.githubLink}
                </a>
              </div>

              <p className="project-summary">{copy.projects.summary}</p>

              <div className="project-detail-grid">
                {copy.projects.highlights.map((item) => (
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
                    type="button"
                  >
                    <div className="post-item-top">
                      <strong>{post.title}</strong>
                      <small>{formatDate(post.date, copy.locale)}</small>
                    </div>
                    <p>{post.excerpt}</p>
                    <div className="post-tags">
                      {(post.tags ?? []).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <article className="blog-view card glass">
              {selectedPost ? (
                <>
                  <div className="post-view-top">
                    <div>
                      <p className="section-kicker">{copy.blog.postKicker}</p>
                      <h3>{selectedPost.title}</h3>
                    </div>
                  </div>

                  <div className="post-meta-line">
                    <span>{formatDate(selectedPost.date, copy.locale)}</span>
                    <div className="post-tags large">
                      {(selectedPost.tags ?? []).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <p className="post-excerpt">{selectedPost.excerpt}</p>
                  <div className="post-content">{selectedPost.content}</div>
                </>
              ) : (
                <p className="post-content">No posts available.</p>
              )}
            </article>
          </div>
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

        <section id="guestbook" className="section">
          <div className="section-heading">
            <p className="section-kicker">{copy.guestbook.kicker}</p>
            <h2>{copy.guestbook.title}</h2>
          </div>

          <div className="card glass guestbook-card">
            <p className="guestbook-note">{copy.guestbook.note}</p>
            <Utterances repo="itsmekk-mario/my-portfolio" theme="github-dark" issueTerm="pathname" />
          </div>
        </section>

        <section id="contact" className="section">
          <div className="section-heading">
            <p className="section-kicker">{copy.contact.kicker}</p>
            <h2>{copy.contact.title}</h2>
          </div>

          <div className="contact-grid">
            <a className="card contact-card" href="https://github.com/itsmekk-mario" target="_blank" rel="noreferrer">
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
