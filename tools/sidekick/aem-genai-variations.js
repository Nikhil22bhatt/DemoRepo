
(function () {
  let isAEMGenAIVariationsAppLoaded = false;
  let isAEMGenAIVariationsAppLoading = false;
  const EVENT_NAME = 'custom:aem-genai-variations-sidekick';

  function loadAEMGenAIVariationsApp() {
    if (isAEMGenAIVariationsAppLoaded || isAEMGenAIVariationsAppLoading) {
      return;
    }

    isAEMGenAIVariationsAppLoading = true;
    const script = document.createElement('script');
    script.src = 'https://experience.adobe.com/solutions/aem-sites-genai-aem-genai-variations-mfe/static-assets/resources/sidekick/client.js?source=plugin';
    script.onload = function () {
      isAEMGenAIVariationsAppLoaded = true;
      isAEMGenAIVariationsAppLoading = false;
    };
    script.onerror = function () {
      isAEMGenAIVariationsAppLoading = false;
      console.error('Error loading AEMGenAIVariationsApp.');
    };
    document.head.appendChild(script);
  }

  function bindGenAIVariations(sidekick) {
    if (!sidekick || sidekick.dataset.genaiVariationsBound === 'true') return;

    sidekick.dataset.genaiVariationsBound = 'true';
    sidekick.addEventListener(EVENT_NAME, loadAEMGenAIVariationsApp);
  }

  function bindExistingSidekicks() {
    bindGenAIVariations(document.querySelector('helix-sidekick'));
    bindGenAIVariations(document.querySelector('aem-sidekick'));
  }

  bindExistingSidekicks();
  document.addEventListener('sidekick-ready', bindExistingSidekicks, { once: true });
}());
