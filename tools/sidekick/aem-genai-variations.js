(function () {
  let isAEMGenAIVariationsAppLoaded = false;

  function loadAEMGenAIVariationsApp() {
    const script = document.createElement('script');
    script.src = 'https://experience.adobe.com/solutions/aem-sites-genai-aem-genai-variations-mfe/static-assets/resources/sidekick/client.js?source=plugin';
    script.onload = function () {
      isAEMGenAIVariationsAppLoaded = true;
    };
    script.onerror = function () {
      console.error('Error loading AEMGenAIVariationsApp.');
    };
    document.head.appendChild(script);
  }

  function handlePluginButtonClick() {
    if (!isAEMGenAIVariationsAppLoaded) {
      loadAEMGenAIVariationsApp();
    }
  }

  // Support for Sidekick V1
  const sidekick = document.querySelector('helix-sidekick');
  if (sidekick) {
    sidekick.addEventListener('custom:aem-genai-variations-sidekick', handlePluginButtonClick);
  } else {
    document.addEventListener('sidekick-ready', () => {
      document.querySelector('helix-sidekick')
        ?.addEventListener('custom:aem-genai-variations-sidekick', handlePluginButtonClick);
    }, { once: true });
  }

  // Support for Sidekick V2
  const sidekickV2 = document.querySelector('aem-sidekick');
  if (sidekickV2) {
    sidekickV2.addEventListener('custom:aem-genai-variations-sidekick', handlePluginButtonClick);
  } else {
    document.addEventListener('sidekick-ready', () => {
      document.querySelector('aem-sidekick')
        ?.addEventListener('custom:aem-genai-variations-sidekick', handlePluginButtonClick);
    }, { once: true });
  }
}());
