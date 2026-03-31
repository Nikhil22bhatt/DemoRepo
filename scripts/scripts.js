import {
  sampleRUM,
  getMetadata,
  loadScript,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  toCamelCase,
  toClassName,
} from './aem.js';
import getAudiences from './utils.js';

const PROD_HOST = 'main--demorepo--nikhil22bhatt.aem.live';
const HOME_PATHS = new Set(['/', '/index', '/index.html']);

function isHomePage() {
  return HOME_PATHS.has(window.location.pathname);
}

function updateText(selector, text, root = document) {
  const element = root.querySelector(selector);
  if (element) element.textContent = text;
}

function updateLink(container, href, label, className = 'button secondary') {
  if (!container) return;

  let link = container.querySelector('a');
  if (!link) {
    link = document.createElement('a');
    container.textContent = '';
    container.append(link);
  }

  link.href = href;
  link.title = label;
  link.textContent = label;
  link.className = className;
  container.classList.add('button-container');
}

function normalizeHomeCards(main) {
  const cards = main.querySelectorAll('.section .cards > ul > li');
  if (cards.length < 4) return;

  const homeCards = [cards[0], cards[1], cards[2]];
  const wideCard = cards[cards.length - 1];

  [
    {
      card: homeCards[0],
      title: 'Mortgage Loans',
      body: 'Get a SecurBank new mortgage offer to buy the home you dream of. Write down your email to get our special offer!',
      href: '/loans',
      cta: 'Get The Offer',
    },
    {
      card: homeCards[1],
      title: 'Maximize rewards with SecurBank credit cards.',
      body: 'From cash back to travel perks, our credit cards offer low rates and big benefits. Apply today and start saving.',
      href: '/creditcards',
      cta: 'Apply for a card today.',
    },
    {
      card: homeCards[2],
      title: 'Build a Strong Foundation',
      body: "Our high-yield accounts offer great returns and special bonuses, ensuring your family's financial stability and growth.",
      href: '/accounts',
      cta: 'Learn More',
    },
  ].forEach((entry) => {
    const body = entry.card?.querySelector('.cards-card-body');
    if (!body) return;

    updateText('h3', entry.title, body);
    const paragraphs = body.querySelectorAll('p');
    if (paragraphs[0]) paragraphs[0].textContent = entry.body;
    if (paragraphs[1]) updateLink(paragraphs[1], entry.href, entry.cta);
  });

  const wideBody = wideCard?.querySelector('.cards-card-body');
  if (!wideBody) return;

  updateText('h3', 'Cost of living support', wideBody);
  const wideParagraphs = wideBody.querySelectorAll('p');
  if (wideParagraphs[0]) {
    wideParagraphs[0].textContent = 'Discover tools and tips to help you with the everyday cost of living';
  }
  if (wideParagraphs[1]) {
    updateLink(wideParagraphs[1], '#', 'Explore cost of living support');
  }
}

function normalizeHomeFeature(main) {
  const feature = main.querySelector('.section.home .feature');
  if (!feature) return;

  const content = feature.querySelector('.feature-content-container');
  if (content) {
    updateText('h3', 'We made it simple', content);
    const paragraph = content.querySelector('p');
    if (paragraph) {
      paragraph.textContent = '100% online application. Flexible terms based on your needs. No hidden fees.';
    }
  }

  const callout = feature.querySelector('.feature-callout-wrapper');
  if (!callout) return;

  const headings = callout.querySelectorAll('h3, p');
  if (headings[1]) headings[1].textContent = 'The best rate';
  if (headings[2]) headings[2].textContent = 'is waiting';

  const paragraphs = callout.querySelectorAll('p');
  const actionParagraph = paragraphs[paragraphs.length - 1];
  if (actionParagraph) updateLink(actionParagraph, '/accounts', 'Apply Now', 'button');
}

function normalizeHomeHero(main) {
  const hero = main.querySelector('.hero.authbox');
  if (!hero) return;

  updateText('h1', 'Sail Into Financial Independence', hero);
  updateText('h2', "It's easy with us!", hero);
  updateText('.section:first-of-type .default-content-wrapper h3', 'Popular offers and services for your business', main);
}

function normalizeHomePage(main) {
  if (!isHomePage()) return;

  normalizeHomeHero(main);
  normalizeHomeCards(main);
  normalizeHomeFeature(main);
}

// Add you templates below
// window.hlx.templates.add('/templates/my-template');

// Add you plugins below
// window.hlx.plugins.add('/plugins/my-plugin.js');

/**
 * Gets all the metadata elements that are in the given scope.
 * @param {String} scope The scope/prefix for the metadata
 * @returns an array of HTMLElement nodes that match the given scope
 */
export function getAllMetadata(scope) {
  return [...document.head.querySelectorAll(`meta[property^="${scope}:"],meta[name^="${scope}-"]`)]
    .reduce((res, meta) => {
      const id = toClassName(meta.name
        ? meta.name.substring(scope.length + 1)
        : meta.getAttribute('property').split(':')[1]);
      res[id] = meta.getAttribute('content');
      return res;
    }, {});
}

window.hlx.plugins.add('experimentation', {
  condition: () => getMetadata('experiment')
    || Object.keys(getAllMetadata('campaign')).length
    || Object.keys(getAllMetadata('audience')).length,
  options: { audiences: getAudiences() },
  url: '/plugins/experimentation/src/index.js',
});

// Define an execution context
const pluginContext = {
  getAllMetadata,
  getMetadata,
  loadCSS,
  loadScript,
  sampleRUM,
  toCamelCase,
  toClassName,
};

// const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    // TODO: add auto block, if needed
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  // await window.hlx.plugins.run('loadEager');
  const main = doc.querySelector('main');
  const experimentationOptions = {
    prodHost: PROD_HOST,
    isProd: () => !(window.location.hostname.endsWith('aem.page')
    || window.location.hostname === ('localhost')),
    rumSamplingRate: 1,
    audiences: getAudiences(),
  };

  if (getMetadata('experiment')
    || Object.keys(getAllMetadata('campaign')).length
    || Object.keys(getAllMetadata('audience')).length) {
    // eslint-disable-next-line import/no-relative-packages
    const { loadEager: runEager } = await import('../plugins/experimentation/src/index.js');
    await runEager(document, experimentationOptions, pluginContext);
  }

  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  sampleRUM.enhance();

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
      if (getMetadata('experiment')
        || Object.keys(getAllMetadata('campaign')).length
        || Object.keys(getAllMetadata('audience')).length) {
        // eslint-disable-next-line import/no-relative-packages
        const { loadLazy: runLazy } = await import('../plugins/experimentation/src/index.js');
        await runLazy(document, experimentationOptions, pluginContext);
      }
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);
  normalizeHomePage(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
  import('../tools/sidekick/aem-genai-variations.js');
  
  sampleRUM('lazy');


  // Add below snippet at the end of the lazy phase
  if ((getMetadata('experiment')
    || Object.keys(getAllMetadata('campaign')).length
    || Object.keys(getAllMetadata('audience')).length)) {
    // eslint-disable-next-line import/no-relative-packages
    const { loadLazy: runLazy } = await import('../plugins/experimentation/src/index.js');
    await runLazy(document, {
      prodHost: PROD_HOST,
      isProd: () => window.location.hostname.endsWith('aem.page')
      || window.location.hostname === ('localhost'),
      audiences: getAudiences(),
    }, pluginContext);
  }
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  window.setTimeout(() => {
    window.hlx.plugins.load('delayed');
    window.hlx.plugins.run('loadDelayed');
    // eslint-disable-next-line import/no-cycle
    return import('./delayed.js');
  }, 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await window.hlx.plugins.load('eager');
  await loadEager(document);
  await window.hlx.plugins.load('lazy');
  await loadLazy(document);
  loadDelayed();
}

loadPage();
