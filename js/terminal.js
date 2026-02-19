// Mini terminal — reveals sections on command (persists across page visits)
(function () {
  const STORAGE_KEY = 'portfolio-revealed';
  const input = document.querySelector('.terminal-input');
  const output = document.querySelector('.terminal-output');
  const terminalBody = document.querySelector('.terminal-body');

  terminalBody?.addEventListener('click', () => input?.focus());

  function revealSection(id) {
    const el = document.getElementById(id);
    if (el && el.classList.contains('revealable')) {
      el.classList.add('revealed');
    }
    const navLink = document.querySelector(`.nav-revealable[data-section="${id}"]`);
    if (navLink) navLink.classList.add('nav-revealed');
    saveRevealedState();
  }

  function saveRevealedState() {
    const revealed = Array.from(document.querySelectorAll('.panel.revealable.revealed'))
      .map(el => el.id)
      .filter(Boolean);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(revealed));
    window.updateSidebarProgress?.();
  }

  function restoreRevealedState() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const ids = JSON.parse(saved);
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.classList.contains('revealable')) el.classList.add('revealed');
        const navLink = document.querySelector(`.nav-revealable[data-section="${id}"]`);
        if (navLink) navLink.classList.add('nav-revealed');
      });
    } catch (_) {}
  }

  restoreRevealedState();

  const GITHUB_URL = 'https://github.com/michaelguo07';
  const LINKEDIN_URL = 'https://linkedin.com/in/michaelguo07';
  const INSTA_URL = 'https://www.instagram.com/guobropro/';

  const commands = {
    help: () =>
      `Available commands:\n  about, skills, projects, resume, contact\n  github, linkedin, insta\n  clear — clear terminal\n  reset — reset page \n  help — show this message \n\nmaybe there are other commands...`,
    home: () => {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return '→ Home';
    },
    about: () => {
      revealSection('about');
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return '→ About';
    },
    skills: () => {
      revealSection('skills');
      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return '→ Skills';
    },
    projects: () => {
      revealSection('projects');
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return '→ Projects';
    },
    resume: () => {
      revealSection('resume');
      document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return '→ Resume';
    },
    contact: () => {
      revealSection('contact');
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return '→ Contact';
    },
    github: () => {
      window.open(GITHUB_URL, '_blank', 'noopener');
      return '→ Opening GitHub';
    },
    linkedin: () => {
      window.open(LINKEDIN_URL, '_blank', 'noopener');
      return '→ Opening LinkedIn';
    },
    insta: () => {
      window.open(INSTA_URL, '_blank', 'noopener');
      return '→ Opening Instagram';
    },
    clear: () => {
      output.innerHTML = '';
      return null;
    },
    reset: () => {
      sessionStorage.removeItem(STORAGE_KEY);
      window.location.reload();
      return null;
    },
    // Secret easter eggs (not in help)
    secret: () => 'you found a secret. there may be more',
    hello: () => 'Hello! thanks for coming',
    hookem: () => '🤘 Hook \'em Horns!',
    sudo: () => 'no sudo here :)',
    matrix: () => 'There is no spoon. But there is a cursor. Have you tried dragging it?',
  };

  function scrollTerminalToBottom() {
    // Re-query each time so we always have the live element (helps on Azure)
    const body = document.querySelector('.terminal-body');
    const inputLine = document.querySelector('.terminal-input-line');
    if (body) {
      body.scrollTop = body.scrollHeight;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          body.scrollTop = body.scrollHeight;
        });
      });
    }
    // Fallback: ask browser to show input line (works when scrollTop is ignored on Azure)
    if (inputLine) {
      inputLine.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }
  }

  function appendOutput(text, isError = false) {
    const p = document.createElement('p');
    p.style.color = isError ? '#e57373' : 'var(--muted)';
    p.style.whiteSpace = 'pre-wrap';
    p.style.wordBreak = 'break-word';
    p.textContent = text;
    output.appendChild(p);
    scrollTerminalToBottom();
  }

  function runCommand(cmd) {
    cmd = cmd.trim().toLowerCase();
    if (!cmd) return;

    const handler = commands[cmd];
    if (handler) {
      const result = handler();
      if (result) appendOutput(result);
    } else {
      appendOutput(`Command not found: ${cmd}\n  Type 'help' for available commands.`, true);
    }
  }

  input?.addEventListener('input', scrollTerminalToBottom);
  input?.addEventListener('keydown', (e) => {
    scrollTerminalToBottom();
    if (e.key === 'Enter') {
      const cmd = input.value;
      appendOutput(`$ ${cmd}`, false);
      runCommand(cmd);
      input.value = '';
    }
  });

  window.revealAndScroll = function (id) {
    if (id && id !== 'hero') revealSection(id);
  };

  window.saveRevealedState = saveRevealedState;

  input?.focus();
})();
