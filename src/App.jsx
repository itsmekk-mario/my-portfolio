import './App.css'

function App() {
  const skills = {
    Languages: ['Python', 'C', 'C++', 'Kotlin', 'TypeScript', 'Go'],
    'Robotics / Embedded': ['ROS2', 'Jetson Orin Nano', 'I2C', 'PWM', 'PCA9685', 'Linux'],
    'AI / Vision': ['YOLO', 'TensorRT', 'OpenCV', 'Flask'],
    Tools: ['Git', 'GitHub', 'VS Code', 'Android Studio', 'Fusion 360'],
  }

  const projectHighlights = [
    'ROS2-based autonomous driving architecture',
    'PCA9685 motor and servo control',
    'Flask web-based control interface',
    'CSI camera streaming pipeline',
    'YOLO object detection integration',
    'Stereo depth estimation',
    'AI-first decision structure',
  ]

  return (
    <div className="app">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <header className="header">
        <a className="brand" href="#home">
          kown
        </a>

        <nav className="nav">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#project">Project</a>
          <a href="#philosophy">Philosophy</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section id="home" className="hero section">
          <div className="hero-left">
            <div className="eyebrow">AI &amp; Engineering · Republic of Korea</div>
            <h1>
              kown
              <span className="hero-accent">My first language is engineering.</span>
            </h1>

            <p className="hero-description">
              I build systems that move — combining engineering, code, AI, and robotics.
            </p>

            <div className="hero-meta">
              <span>Boin High School Student</span>
              <span>AI Instructor</span>
              <span>Student Developer</span>
            </div>

            <div className="hero-actions">
              <a className="btn btn-primary" href="#project">
                View Projects
              </a>
              <a className="btn btn-secondary" href="#contact">
                Contact
              </a>
            </div>
          </div>

          <div className="hero-right card glass">
            <div className="status-line">
              <span className="status-dot" />
              Engineering-focused portfolio
            </div>

            <div className="info-grid">
              <div className="info-item">
                <p className="info-label">Identity</p>
                <h3>Young Engineer</h3>
              </div>
              <div className="info-item">
                <p className="info-label">Focus</p>
                <h3>AI · Robotics · Aerospace</h3>
              </div>
              <div className="info-item">
                <p className="info-label">Location</p>
                <h3>Republic of Korea</h3>
              </div>
              <div className="info-item">
                <p className="info-label">Approach</p>
                <h3>Systems, Motion, Intelligence</h3>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="section-heading">
            <p className="section-kicker">About</p>
            <h2>Engineering mindset, software execution.</h2>
          </div>

          <div className="card about-card">
            <p>
              I am a high school student developer from the Republic of Korea who thinks in
              systems and builds engineering-driven projects. My work sits at the intersection
              of software, robotics, control, AI, and real-world motion.
            </p>
            <p>
              I am especially interested in aerospace engineering, rocket engineering, robotics,
              computer vision, autonomous systems, embedded systems, and AI-assisted development.
            </p>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="section-heading">
            <p className="section-kicker">Tech Stack</p>
            <h2>Built for intelligent systems.</h2>
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

        <section id="project" className="section">
          <div className="section-heading">
            <p className="section-kicker">Featured Project</p>
            <h2>Jetson-based Autonomous Vehicle</h2>
          </div>

          <div className="project-layout">
            <article className="card project-main glass">
              <div className="project-badge">Flagship Build</div>
              <p className="project-description">
                A ROS2-based autonomous driving car designed as an engineering system rather than
                a simple demo. The vehicle integrates perception, control, motion logic, and a
                web-based interface into a unified AI-first architecture.
              </p>

              <div className="project-points">
                {projectHighlights.map((item) => (
                  <div className="project-point" key={item}>
                    <span className="project-point-mark" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <aside className="card project-side">
              <h3>System View</h3>
              <ul className="system-list">
                <li>Perception with YOLO + stereo depth</li>
                <li>Control path through PCA9685 and embedded interfaces</li>
                <li>Flask-based control and monitoring interface</li>
                <li>Camera streaming with CSI pipeline</li>
                <li>Decision structure oriented around AI-first operation</li>
              </ul>
            </aside>
          </div>
        </section>

        <section id="philosophy" className="section">
          <div className="section-heading">
            <p className="section-kicker">Philosophy</p>
            <h2>More than code.</h2>
          </div>

          <div className="card quote-card glass">
            <blockquote>"My first language is engineering."</blockquote>
            <p>
              I do not just write code. I design systems, behavior, and motion — connecting
              hardware, intelligence, and structure into something that works in the real world.
            </p>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="section-heading">
            <p className="section-kicker">Contact</p>
            <h2>Let&apos;s build something meaningful.</h2>
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
              <span>View repositories</span>
            </a>

            <a className="card contact-card" href="mailto:khk090525@gmail.com">
              <p className="contact-label">Email</p>
              <h3>khk090525@gmail.com</h3>
              <span>Send a message</span>
            </a>

            <div className="card contact-card contact-placeholder">
              <p className="contact-label">Future Portfolio / Blog</p>
              <h3>Coming Soon</h3>
              <span>Technical writing, build logs, and experiments</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App