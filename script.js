// ==========================================================================
// Michael Guo - Portfolio Script
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  renderProjectBoxes();
  setupModalEvents();
});

// Render Project Boxes with clean layout & dimensions
function renderProjectBoxes() {
  const container = document.getElementById('projects-container');
  if (!container || typeof projects === 'undefined') return;

  container.innerHTML = projects.map(project => `
    <div class="project-box" onclick="openProjectModal('${project.id}')" role="button" tabindex="0">
      <div class="project-box-top">
        <div class="project-box-header">
          <h3 class="project-box-title">${project.title}</h3>
          <span class="project-box-date">${project.date.split('–')[0].trim()}</span>
        </div>
        <p class="project-box-subtitle">${project.subtitle}</p>
        <p class="project-box-tagline">${project.tagline}</p>
      </div>

      <div class="project-box-footer">
        <span class="project-box-tech">${project.tags.slice(0, 3).join(' • ')}</span>
        <span class="details-link">View details &rarr;</span>
      </div>
    </div>
  `).join('');
}

// Modal handling logic
function setupModalEvents() {
  const backdrop = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn && backdrop) {
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closeModal();
      }
    });
  }
}

function openProjectModal(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  const contentArea = document.getElementById('modal-content-area');
  const backdrop = document.getElementById('project-modal');

  contentArea.innerHTML = `
    <h2 class="modal-header-title">${project.title}</h2>
    <p class="modal-header-sub">${project.subtitle} • <span style="font-family: var(--font-mono);">${project.date}</span></p>
    
    <div class="modal-section-heading">Summary</div>
    <p class="modal-body-text">${project.description}</p>

    <div class="modal-section-heading">Key Accomplishments</div>
    <ul class="exp-bullets" style="margin-bottom: 1.25rem;">
      ${project.highlights.map(h => `<li>${h}</li>`).join('')}
    </ul>

    <div class="modal-section-heading">Technologies</div>
    <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.5rem;">
      ${project.tags.map(tag => `<span style="font-family: var(--font-mono); font-size: 0.8rem; padding: 0.2rem 0.6rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted);">${tag}</span>`).join('')}
    </div>

    <div class="modal-links-row">
      ${project.liveUrl ? `
        <a href="${project.liveUrl}" target="_blank" rel="noopener" class="modal-action-btn">
          <span>View Live Site</span> &rarr;
        </a>
      ` : ''}
      ${project.githubUrl ? `
        <a href="${project.githubUrl}" target="_blank" rel="noopener" class="modal-action-btn">
          <span>View GitHub Code</span> &rarr;
        </a>
      ` : ''}
    </div>
  `;

  backdrop.classList.add('open');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const backdrop = document.getElementById('project-modal');
  if (backdrop) {
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}
