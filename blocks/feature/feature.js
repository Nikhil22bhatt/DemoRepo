import { fetchPlaceholders } from '../../scripts/aem.js';

function addFallbackFeatureLink(container) {
  const actionParagraphs = [...container.querySelectorAll(':scope > p')];
  const actionParagraph = actionParagraphs[actionParagraphs.length - 1];
  if (!actionParagraph || actionParagraph.querySelector('a')) return;

  const headingText = container.querySelector('h3')?.textContent?.trim() || '';
  if (!/the best rate/i.test(headingText)) return;

  const label = actionParagraph.textContent.trim();
  if (!label) return;

  const link = document.createElement('a');
  link.href = '/accounts';
  link.title = label;
  link.textContent = label;
  link.className = 'button';

  actionParagraph.textContent = '';
  actionParagraph.append(link);
}

export default async function decorate(block) {
  const mediaWrapper = document.createElement('div');
  mediaWrapper.classList.add('feature-content-media');
  const picture = block.querySelector('picture');
  mediaWrapper.append(picture);

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('feature-content-wrapper');
  let row = block.getElementsByTagName('div')[3];
  row.classList.add('feature-content-container');
  contentWrapper.append(mediaWrapper);
  contentWrapper.append(row);

  const callOutWrapper = document.createElement('div');
  callOutWrapper.classList.add('feature-callout-wrapper');
  /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
  row = block.getElementsByTagName('div')[4];
  addFallbackFeatureLink(row);
  const placeholders = await fetchPlaceholders('');
  const { interestrate } = placeholders;
  const interest = document.createElement('p');
  interest.classList.add('feature-interest-rate');
  interest.innerHTML = `<strong>${interestrate}%</strong><sup>APR</sup>`;
  callOutWrapper.appendChild(interest);

  callOutWrapper.append(row);

  block.textContent = '';
  block.append(contentWrapper);
  block.append(callOutWrapper);
}
