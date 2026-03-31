import { createOptimizedPicture, decorateButtons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const CARD_CTA_FALLBACKS = [
  { match: /mortgage loans/i, href: '/loans' },
  { match: /maximize/i, href: '/creditcards' },
  { match: /build a strong foundation/i, href: '/accounts' },
];

function addFallbackCardLink(cardBody) {
  const paragraphs = [...cardBody.querySelectorAll(':scope > p')];
  const actionParagraph = paragraphs[paragraphs.length - 1];
  if (!actionParagraph || actionParagraph.querySelector('a')) return;

  const heading = cardBody.querySelector('h3');
  const headingText = heading?.textContent?.trim() || '';
  const fallback = CARD_CTA_FALLBACKS.find(({ match }) => match.test(headingText));
  if (!fallback) return;

  const label = actionParagraph.textContent.trim();
  if (!label) return;

  const link = document.createElement('a');
  link.href = fallback.href;
  link.title = label;
  link.textContent = label;

  actionParagraph.textContent = '';
  actionParagraph.append(link);
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    li.querySelectorAll('.cards-card-body').forEach(addFallbackCardLink);
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  ul.querySelectorAll('a').forEach((a) => {
    a.className = 'button secondary';
    decorateButtons(a);
  });
  block.textContent = '';
  block.append(ul);
}
