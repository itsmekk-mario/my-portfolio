import { useEffect, useMemo, useState } from 'react'
import './App.css'

const DEFAULT_POSTS = [
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
]

const STORAGE_KEY = 'kown-portfolio-posts-v1'

function formatDate(value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return value
  }
}

function App() {
  const [posts, setPosts] = useState(DEFAULT_POSTS)
  const [selectedPostId, setSelectedPostId] = useState(DEFAULT_POSTS[0].id)
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
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        setPosts(parsed)
        setSelectedPostId(parsed[0].id)
      }
    } catch {
      // ignore broken local data
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  }, [posts])

  const selectedPost = useMemo(() => {
    return posts.find((post) => post.id === selectedPostId) ?? posts[0] ?? null
  }, [posts, selectedPostId])

  const skills = {
    Languages: ['Python', 'C', 'C++', 'Kotlin', 'TypeScript', 'Go'],
    'Robotics / Embedded': ['ROS2', 'Jetson Orin Nano', 'I2C', 'PWM', 'PCA9685', 'Linux'],
    'AI / Vision': ['YOLO', 'TensorRT', 'OpenCV', 'Flask'],
    'Tools / System': ['Git', 'GitHub', 'VS Code', 'Android Studio', 'Fusion 360'],
  }

  const focusAreas = [
    'Aerospace Engineering',
    'Rocket Engineering',
    'Robotics',
    'Autonomous Systems',
    'Computer Vision',
    'Embedded Systems',
    'AI-assisted Development',
    'System Design',
  ]

  const projectHighlights = [
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
  ]

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
    setPosts(filtered.length ? filtered : DEFAULT_POSTS)
    if (selectedPostId === id) {
      setSelectedPostId((filtered[0] ?? DEFAULT_POSTS[0]).id)
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

      <header className="header">
        <a className="brand" href="#home">
          kown
        </a>

        <nav className="nav">
          <a href="#about">About</a>
          <a href="#focus">Focus</a>
          <a href="#stack">Stack</a>
          <a href="#projects">Projects</a>
          <a href="#blog">Lab Notes</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="app">
        <section id="home" className="hero section">
          <div className="hero-copy">
            <div className="eyebrow">Republic of Korea · AI &amp; Engineering</div>
            <h1>
              kown
              <span className="hero-accent">My first language is engineering.</span>
            </h1>

            <p className="hero-description">
              I build systems that sense, decide, and move — combining software, AI,
              robotics, and control into real-world engineering projects.
            </p>

            <div className="hero-meta">
              <span>Boin High School Student</span>
              <span>AI Instructor</span>
              <span>Student Developer</span>
              <span>Systems-first Builder</span>
            </div>

            <div className="hero-actions">
              <a className="btn btn-primary" href="#projects">
                View Projects
              </a>
              <a
                className="btn btn-secondary"
                href="https://github.com/itsmekk-mario"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a className="btn btn-ghost" href="#blog">
                Lab Notes
              </a>
            </div>
          </div>

          <aside className="hero-panel card glass">
            <div className="status-line">
              <span className="status-dot" />
              Engineering-first portfolio
            </div>

            <div className="info-grid">
              <div className="info-item">
                <p className="info-label">Identity</p>
                <h3>Young Engineer</h3>
              </div>
              <div className="info-item">
                <p className="info-label">Core Fields</p>
                <h3>AI · Robotics · Aerospace</h3>
              </div>
              <div className="info-item">
                <p className="info-label">Method</p>
                <h3>System Design</h3>
              </div>
              <div className="info-item">
                <p className="info-label">Approach</p>
                <h3>Sense → Decide → Move</h3>
              </div>
            </div>
          </aside>
        </section>

        <section id="about" className="section two-col-section">
          <div className="section-heading">
            <p className="section-kicker">About</p>
            <h2>Engineering mindset. Software execution.</h2>
          </div>

          <div className="card about-card">
            <p>
              I am a high school student developer from the Republic of Korea who thinks in
              systems and builds engineering-driven projects across software, robotics, AI,
              and control.
            </p>
            <p>
              I am especially interested in aerospace engineering, rocket engineering,
              autonomous systems, computer vision, embedded control, and AI-assisted
              development.
            </p>
          </div>
        </section>

        <section id="focus" className="section">
          <div className="section-heading">
            <p className="section-kicker">Engineering Focus</p>
            <h2>Fields I want to build in.</h2>
          </div>

          <div className="focus-grid">
            {focusAreas.map((item) => (
              <article className="card focus-card" key={item}>
                <h3>{item}</h3>
                <p>
                  Engineering-driven exploration through software, systems thinking, and
                  real-world implementation.
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="stack" className="section">
          <div className="section-heading">
            <p className="section-kicker">Tech Stack</p>
            <h2>Tools for intelligent systems.</h2>
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
            <p className="section-kicker">Featured Project</p>
            <h2>Jetson-based Autonomous Vehicle</h2>
          </div>

          <div className="project-grid">
            <article className="card project-card glass">
              <div className="project-topline">
                <span className="project-badge">Flagship Build</span>
                <a
                  className="inline-link"
                  href="https://github.com/itsmekk-mario"
                  target="_blank"
                  rel="noreferrer"
                >
                  View GitHub →
                </a>
              </div>

              <p className="project-summary">
                ROS2-based autonomous driving platform built on Jetson Orin Nano, designed
                as an engineering system rather than just a single demo.
              </p>

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
              <p className="section-kicker">Lab Notes</p>
              <h2>Write, edit, and remove posts like a lightweight blog.</h2>
            </div>

            <div className="heading-actions">
              <button className="btn btn-secondary compact" onClick={() => setAdminOpen((value) => !value)}>
                {adminOpen ? 'Close Editor' : 'Manage Posts'}
              </button>
              <button className="btn btn-ghost compact" onClick={handleExportPosts}>
                Export JSON
              </button>
            </div>
          </div>

          <div className="blog-note card subtle-card">
            <strong>How this works:</strong> posts are saved in this browser using localStorage.
            That means you can write, edit, and delete posts here without a backend, but the
            changes are local to your browser unless you later publish them from code.
          </div>

          <div className="blog-layout">
            <aside className="blog-list card">
              <div className="blog-list-head">
                <h3>Posts</h3>
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
                      <small>{formatDate(post.date)}</small>
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
                      <p className="section-kicker">Post</p>
                      <h3>{selectedPost.title}</h3>
                    </div>
                    <div className="post-view-actions">
                      <button className="mini-btn" onClick={() => handleEditPost(selectedPost)}>
                        Edit
                      </button>
                      <button className="mini-btn danger" onClick={() => handleDeletePost(selectedPost.id)}>
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="post-meta-line">
                    <span>{formatDate(selectedPost.date)}</span>
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
                <h3>{form.id ? 'Edit Post' : 'New Post'}</h3>
                <button className="mini-btn" onClick={resetForm}>
                  Reset
                </button>
              </div>

              <form className="editor-form" onSubmit={handleSavePost}>
                <label>
                  Title
                  <input
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    placeholder="Post title"
                  />
                </label>

                <label>
                  Date
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                  />
                </label>

                <label>
                  Tags
                  <input
                    value={form.tags}
                    onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                    placeholder="ROS2, Vision, Engineering"
                  />
                </label>

                <label>
                  Excerpt
                  <textarea
                    rows="3"
                    value={form.excerpt}
                    onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
                    placeholder="Short summary"
                  />
                </label>

                <label>
                  Content
                  <textarea
                    rows="8"
                    value={form.content}
                    onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                    placeholder="Write your post here"
                  />
                </label>

                <div className="editor-actions">
                  <button className="btn btn-primary compact" type="submit">
                    {form.id ? 'Update Post' : 'Publish Local Post'}
                  </button>
                </div>
              </form>
            </section>
          )}
        </section>

        <section className="section" id="philosophy">
          <div className="section-heading">
            <p className="section-kicker">Philosophy</p>
            <h2>Code is only part of the system.</h2>
          </div>

          <div className="card quote-card glass">
            <blockquote>“My first language is engineering.”</blockquote>
            <p>
              I do not just write code. I design systems, interfaces, behavior, and motion.
              I care about how sensing, control, and intelligence work together under
              real-world constraints.
            </p>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="section-heading">
            <p className="section-kicker">Contact</p>
            <h2>Open to meaningful projects and technical collaboration.</h2>
          </div>

          <div className="contact-grid">
            <a
              className="card contact-card"
              href="https://github.com/itsmekk-mario"
              target="_blank"
              rel="noreferrer"
            >
              <p className="contact-label">GitHub</p>
              <h3>itsmekk-mario</h3>
              <span>Repositories, code, engineering builds</span>
            </a>

            <a className="card contact-card" href="mailto:khk090525@gmail.com">
              <p className="contact-label">Email</p>
              <h3>khk090525@gmail.com</h3>
              <span>Contact for collaboration or projects</span>
            </a>

            <div className="card contact-card contact-placeholder">
              <p className="contact-label">Future Writing</p>
              <h3>Lab Notes / Blog</h3>
              <span>Use the editor above for local notes now</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
