import { decorateIcons, getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const REFERENCE_FOOTER = `
  <div class="columns">
    <div>
      <div>
        <p><span class="icon icon-securbank_logo"></span></p>
        <p>201 Sussex St,</p>
        <p>Sydney, NSW, Australia</p>
        <p>+61 97784100</p>
        <p>Any reference to SecurBank, its logo and/or its products and services is for demonstration purposes only and is not intended to refer to any actual organisation, products or services.</p>
      </div>
      <div>
        <p><strong>Navigate</strong></p>
        <ul>
          <li><a href="/" title="Home">Home</a></li>
          <li><a href="/creditcards" title="Credit Cards">Credit Cards</a></li>
          <li><a href="/insurance" title="Insurances">Insurances</a></li>
          <li><a href="/accounts" title="Accounts">Accounts</a></li>
          <li><a href="/loans" title="Loans">Loans</a></li>
        </ul>
      </div>
      <div>
        <p><strong>About Us</strong></p>
        <ul>
          <li>Company</li>
          <li>What we do</li>
          <li>Help center</li>
          <li><a href="/blog">News</a></li>
          <li>Terms of service</li>
          <li>Contact</li>
        </ul>
      </div>
      <div>
        <p><strong>Help</strong></p>
        <ul>
          <li><p>Info</p></li>
          <li><p>Careers</p></li>
          <li><p>Education</p></li>
        </ul>
      </div>
    </div>
  </div>
`;

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';

  // load footer fragment
  const footerPath = footerMeta.footer || '/footer';
  let fragment = await loadFragment(footerPath);
  if (!fragment || fragment.querySelector('.error') || /Page Not Found/i.test(fragment.textContent)) {
    fragment = document.createElement('main');
    fragment.innerHTML = REFERENCE_FOOTER;
    decorateIcons(fragment);
  }

  // decorate footer DOM
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
}
