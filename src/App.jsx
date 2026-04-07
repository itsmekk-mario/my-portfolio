import './App.css'

function App() {
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

  const projects = [
    {
      title: 'Jetson-based Autonomous Vehicle',
      summary: 'ROS2-based autonomous driving platform built on Jetson Orin Nano.',
      problem:
        'Real-time perception, control, and decision logic had to work together as one integrated engineering system.',
      architecture: [
        'ROS2 node-based system structure',
        'PCA9685 motor and servo control',
        'Flask web interface for control and monitoring',
        'CSI camera streaming pipeline',
        'YOLO object detection',
        'Stereo depth estimation',
      ],
      stack: 'ROS2, Python, OpenCV, YOLO, TensorRT, Flask, Linux, PCA9685',
      result:
        'Built an AI-first robotic vehicle pipeline that connects sensing, decision, and motion into one working system.',
    },
    {
      title: 'Engineering Portfolio Website',
      summary: 'A modern portfolio site designed as a personal engineering brand.',
      problem:
        'Needed a site that looks less like a student profile and more like a builder-focused technical identity.',
      architecture: [
        'Responsive React + Vite frontend',
        'Structured engineering-first content layout',
        'GitHub Pages deployment workflow',
      ],
      stack: 'React, Vite, CSS, GitHub Pages',
      result:
        'Created a clean and technical portfolio that presents projects, systems thinking, and engineering identity clearly.',
    },
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
          <a href="#focus">Focus</a>
          <a href="#skills">Stack</a>
          <a href="#projects">Projects</a>
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
              I build real-world systems with software, AI, robotics, and control.
            </p>

            <p className="hero-description secondary">
              High school developer focused on autonomy, perception, motion, and engineering-driven software.
            </p>

            <div className="hero-meta">
              <span>Boin High School Student</span>
              <span>AI Instructor</span>
              <span>Student Developer</span>
              <span>Republic of Korea</span>
            </div>

            <div className="hero-actions">
              <a className="btn btn-primary" href="#projects">
                View Projects
              </a>
              <a className="btn btn-secondary" href="https://github.com/itsmekk-mario" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>

          <div className="hero-right card glass">
            <div className="status-line">
              <span className="status-dot" />
              Systems-first engineering portfolio
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
                <p className="info-label">Approach</p>
                <h3>Sense · Decide · Move</h3>
              </div>
              <div className="info-item">
                <p className="info-label">Build Style</p>
                <h3>Systems, Control, Integration</h3>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="section-heading">
            <p className="section-kicker">About</p>
            <h2>Engineering mindset. Software execution.</h2>
          </div>

          <div className="card about-card">
            <p>
              I am a high school student developer from the Republic of Korea who thinks in systems
              and builds engineering-driven projects across software, robotics, AI, and control.
            </p>
            <p>
              I am interested in designing systems that do more than compute — systems that perceive,
              make decisions, and act in the real world.
            </p>
          </div>
        </section>

        <section id="focus" className="section">
          <div className="section-heading">
            <p className="section-kicker">Engineering Focus</p>
            <h2>Fields I want to build in.</h2>
          </div>

          <div className="skills-grid">
            {focusAreas.map((item) => (
              <article className="card skill-card" key={item}>
                <h3>{item}</h3>
                <p className="focus-text">
                  Engineering-driven exploration through software, systems thinking, and real-world implementation.
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section">
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
            <p className="section-kicker">Featured Projects</p>
            <h2>Systems I built, not just pages I made.</h2>
          </div>

          <div className="projects-deep">
            {projects.map((project) => (
              <article className="card project-deep-card glass" key={project.title}>
                <div className="project-top">
                  <div>
                    <p className="project-badge">Project</p>
                    <h3>{project.title}</h3>
                  </div>
                </div>

                <p className="project-summary">{project.summary}</p>

                <div className="project-block">
                  <h4>Problem</h4>
                  <p>{project.problem}</p>
                </div>

                <div className="project-block">
                  <h4>Architecture</h4>
                  <ul className="system-list">
                    {project.architecture.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="project-block">
                  <h4>Stack</h4>
                  <p>{project.stack}</p>
                </div>

                <div className="project-block">
                  <h4>Result</h4>
                  <p>{project.result}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="philosophy" className="section">
          <div className="section-heading">
            <p className="section-kicker">Philosophy</p>
            <h2>Code is only part of the system.</h2>
          </div>

          <div className="card quote-card glass">
            <blockquote>"My first language is engineering."</blockquote>
            <p>
              I do not just write code. I design systems, behavior, interfaces, and motion.
              I care about how sensing, control, intelligence, and structure work together.
            </p>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="section-heading">
            <p className="section-kicker">Contact</p>
            <h2>Open to building meaningful systems.</h2>
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
              <span>View repositories and engineering builds</span>
            </a>

            <a className="card contact-card" href="mailto:khk090525@gmail.com">
              <p className="contact-label">Email</p>
              <h3>khk090525@gmail.com</h3>
              <span>Contact for collaboration or projects</span>
            </a>

            <div className="card contact-card contact-placeholder">
              <p className="contact-label">Future Blog / Lab Notes</p>
              <h3>Coming Soon</h3>
              <span>Build logs, engineering notes, experiments</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App